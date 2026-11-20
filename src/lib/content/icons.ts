import { getRedis } from '../redis.ts';
import type { AnyIconConfig } from '../cardMaker/icons/index.ts';
import type { LayoutSpec } from '../cardMaker/layouts/types.ts';
import type { Card } from '../../models/card.ts';
import type { AssetMap } from './assets.ts';
import { ContentError, KEY, historyKey, readContent } from './store.ts';

/**
 * Ícones criados na aba Ícones do editor de layouts: cópia de um ícone que já existe, com um id novo no mesmo grupo, e
 * exclusão (só dos criados, e só se nenhuma carta nem layout os usa). Só no servidor.
 *
 * - Elemento: nova variante do mesmo elemento (`element:fire-04`).
 * - Custo: novo ícone de entrada ou de mão (`cost:entrance-05`, `cost:hand-04`).
 * - Atributo de Combate: nova moldura (`attribute:08`).
 * - Tipo: novo ícone alternativo do tipo, com nome (`type-variant:ninja-<nome>`), a partir do padrão ou de um alternativo.
 * O Chakra genérico é um só, e os tipos de carta são os quatro: não há ícone novo deles.
 */

/** Imagem de um ícone criado: a pasta própria, para não trocar a do ícone copiado. */
export const createdIconPath = (key: string) => `icons/custom/${key.replace(':', '-')}.webp`;

const pad = (n: number) => String(n).padStart(2, '0');

/** O próximo número livre depois do maior que começa os ids (`entrance-04` → 05; `06-03` → 07). */
function nextNumber(ids: string[], strip: (id: string) => string): string {
  const max = Math.max(0, ...ids.map((id) => Number.parseInt(strip(id), 10)).filter(Number.isFinite));
  return pad(max + 1);
}

function slug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24);
}

/**
 * Cria um ícone cópia de `base` (`<grupo>:<id>`). `name`: nome nos seletores (obrigatório no ícone alternativo do
 * tipo). Devolve a chave do ícone novo.
 */
export async function createIcon(base: string, name: string | undefined): Promise<{ key: string; version: number }> {
  const redis = getRedis();
  const icons = (await redis.hgetall<Record<string, AnyIconConfig>>(KEY.icon)) ?? {};
  const source = icons[base];
  if (!source) throw new ContentError(404, 'Ícone base não encontrado.');
  const [group, id] = [base.slice(0, base.indexOf(':')), base.slice(base.indexOf(':') + 1)];
  const ids = (g: string) => Object.keys(icons).filter((k) => k.startsWith(`${g}:`)).map((k) => k.slice(g.length + 1));
  let key: string;
  if (group === 'element') {
    const element = id.split('-')[0];
    key = `element:${element}-${nextNumber(ids('element').filter((i) => i.startsWith(`${element}-`)), (i) => i.split('-')[1])}`;
  } else if (group === 'cost') {
    const kind = id.startsWith('entrance-') ? 'entrance' : 'hand';
    key = `cost:${kind}-${nextNumber(ids('cost').filter((i) => i.startsWith(`${kind}-`)), (i) => i.split('-')[1])}`;
  } else if (group === 'attribute') {
    key = `attribute:${nextNumber(ids('attribute'), (i) => i.split('-')[0])}`;
  } else if (group === 'type' || group === 'type-variant') {
    const type = id.split('-')[0];
    const s = slug(name ?? '');
    if (!s) throw new ContentError(400, 'Dê um nome ao ícone alternativo do tipo.');
    key = `type-variant:${type}-${s}`;
  } else {
    throw new ContentError(400, 'Este grupo não tem ícones novos (o Chakra genérico é um só).');
  }
  const created = { ...source, created: true, ...(name?.trim() && { name: name.trim().slice(0, 40) }) } as AnyIconConfig;
  if (!(await redis.hsetnx(KEY.icon, key, created))) throw new ContentError(409, `Já existe o ícone ${key}.`);
  return { key, version: await redis.incr(KEY.version) };
}

/** Onde o ícone é usado (cartas do catálogo e ícones padrão dos layouts); vazio se em nenhum lugar. */
function usesOf(key: string, cards: Card[], layouts: Record<string, LayoutSpec>): string[] {
  const [group, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  const out: string[] = [];
  for (const c of cards) {
    const icons = c.layout?.icons;
    if (!icons) continue;
    const used =
      (group === 'element' && c.elements.some((el, i) => `${el}-${icons.elements[i]}` === id)) ||
      (group === 'cost' && (icons.entrance === id || icons.hand === id)) ||
      (group === 'attribute' && icons.attribute === id) ||
      (group === 'type-variant' && `${c.type}-${icons.type}` === id);
    if (used) out.push(c.id);
  }
  for (const l of Object.values(layouts)) {
    const used =
      (group === 'cost' && (l.defaults.entranceIcon === id || l.defaults.handIcon === id)) ||
      (group === 'attribute' && l.attribute.defaultFrame === id);
    if (used) out.push(`layout ${l.id}`);
  }
  return out;
}

/** Exclui um ícone criado no editor que nada usa; devolve as imagens dele no Blob, para apagar de lá. */
export async function deleteIcon(key: string): Promise<{ version: number; dropped: string[] }> {
  const content = await readContent();
  const icon = content.icons[key];
  if (!icon) throw new ContentError(404, 'Ícone não encontrado.');
  if (!icon.created) throw new ContentError(400, 'Os ícones das cartas impressas não podem ser excluídos.');
  const uses = usesOf(key, content.cards, content.layouts);
  if (uses.length) throw new ContentError(409, `O ícone é usado por ${uses.length} carta(s) ou layout(s) (ex.: ${uses[0]}). Troque antes.`);
  const redis = getRedis();
  const path = createdIconPath(key);
  const assets = (await redis.hgetall<AssetMap>(KEY.asset)) ?? {};
  const tx = redis.multi().hdel(KEY.icon, key).del(historyKey('icon', key));
  if (assets[path]) tx.hdel(KEY.asset, path);
  await tx.exec();
  return { version: await redis.incr(KEY.version), dropped: assets[path] ? [String(assets[path])] : [] };
}
