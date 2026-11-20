import { getRedis } from '../redis.ts';
import type { IconsContent } from '../cardMaker/icons/index.ts';
import type { LayoutSpec } from '../cardMaker/layouts/types.ts';
import type { LayoutId } from '../cardMaker/model.ts';
import type { Card } from '../../models/card.ts';
import type { AssetMap } from './assets.ts';
import { applyChanges, type ContentChange } from './changes.ts';
import { cardsToPtBr } from './ptbr.ts';
import { seedSnapshot } from './seed.ts';
import { HISTORY_SIZE, type ContentKind, type ContentSnapshot, type HistoryEntry } from './types.ts';

/**
 * Conteúdo do jogo no Redis (só no servidor). O banco é dividido com o projeto pokedex: toda chave começa com
 * `naruto-ccg:`.
 *
 * - `naruto-ccg:content:version`: número que aumenta a cada gravação (o cache do navegador e do servidor usa ele).
 * - `naruto-ccg:content:cards`: hash id da carta → carta (JSON).
 * - `naruto-ccg:content:layouts`: hash id do layout → configuração do layout.
 * - `naruto-ccg:content:icons`: hash `<grupo>:<id>` → configuração do ícone.
 * - `naruto-ccg:content:assets`: hash caminho da imagem (`layout-02/jutsu-frame.webp`) → URL no Vercel Blob.
 * - `naruto-ccg:content:history:<tipo>:<id>`: lista com as últimas versões de uma carta, layout ou ícone (as mais novas
 *   primeiro). As imagens não têm histórico.
 *
 * - `naruto-ccg:content:format`: formato do conteúdo (`CONTENT_FORMAT`; 2 = textos das cartas em PT-BR).
 *
 * Com o Redis vazio, a primeira leitura grava a carga inicial (`seedSnapshot`); com um formato antigo, converte.
 */

/** Formato atual: 2 = os textos das cartas (nome, texto, frase, características, atributos) em PT-BR. */
export const CONTENT_FORMAT = 2;

export const KEY = {
  version: 'naruto-ccg:content:version',
  format: 'naruto-ccg:content:format',
  seedLock: 'naruto-ccg:content:seed-lock',
  card: 'naruto-ccg:content:cards',
  layout: 'naruto-ccg:content:layouts',
  icon: 'naruto-ccg:content:icons',
  asset: 'naruto-ccg:content:assets',
} as const satisfies Record<string, string>;

export const historyKey = (kind: ContentKind, id: string) => `naruto-ccg:content:history:${kind}:${id}`;

export class ContentError extends Error {
  readonly status: 400 | 404 | 409 | 503;
  constructor(status: 400 | 404 | 409 | 503, message: string) {
    super(message);
    this.status = status;
  }
}

export async function readContentVersion(): Promise<number | null> {
  const v = await getRedis().get<number | string>(KEY.version);
  return v === null || v === undefined ? null : Number(v);
}

/** Lê o conteúdo inteiro (grava a carga inicial antes, se o Redis estiver vazio). */
export async function readContent(): Promise<ContentSnapshot> {
  await ensureReady();
  const redis = getRedis();
  const [version, cards, layouts, icons, assets] = await redis
    .pipeline()
    .get<number | string>(KEY.version)
    .hgetall<Record<string, Card>>(KEY.card)
    .hgetall<Record<string, LayoutSpec>>(KEY.layout)
    .hgetall<IconsContent>(KEY.icon)
    .hgetall<AssetMap>(KEY.asset)
    .exec<[number | string, Record<string, Card> | null, Record<string, LayoutSpec> | null, IconsContent | null, AssetMap | null]>();
  // Mesma ordem da carga inicial (coleção por coleção), não a do hash.
  const order = new Map(seedOrder().map((id, i) => [id, i]));
  const list = Object.values(cards ?? {}).sort(
    (a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity) || a.id.localeCompare(b.id),
  );
  return {
    version: Number(version),
    cards: list,
    layouts: (layouts ?? {}) as Record<LayoutId, LayoutSpec>,
    icons: icons ?? {},
    assets: Object.fromEntries(Object.entries(assets ?? {}).map(([k, v]) => [k, String(v)])),
  };
}

/** Grava a carga inicial (Redis vazio) ou converte o conteúdo de um formato antigo. */
async function ensureReady(): Promise<void> {
  const [version, format] = await getRedis().pipeline().get<number | string>(KEY.version).get<number | string>(KEY.format).exec<[number | string | null, number | string | null]>();
  if (version === null || version === undefined) return seedContent();
  if (Number(format ?? 1) < CONTENT_FORMAT) await migrateContent();
}

/**
 * Formato 1 → 2: as cartas tinham os textos em inglês (como impressos) e o app traduzia na hora; agora o conteúdo
 * guarda o PT-BR. Mantém o `layout` de cada carta (editado pelo site). Usa a mesma trava da carga inicial.
 */
async function migrateContent(): Promise<void> {
  const redis = getRedis();
  const locked = await redis.set(KEY.seedLock, '1', { nx: true, ex: 120 });
  if (!locked) {
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      if (Number((await redis.get<number | string>(KEY.format)) ?? 1) >= CONTENT_FORMAT) return;
    }
    throw new ContentError(503, 'O conteúdo do jogo está sendo convertido. Tente de novo em instantes.');
  }
  try {
    if (Number((await redis.get<number | string>(KEY.format)) ?? 1) >= CONTENT_FORMAT) return;
    const cards = Object.values((await redis.hgetall<Record<string, Card>>(KEY.card)) ?? {});
    const converted = cardsToPtBr(cards);
    for (let i = 0; i < converted.length; i += 300) {
      await redis.hset(KEY.card, Object.fromEntries(converted.slice(i, i + 300).map((c) => [c.id, c])));
    }
    await redis.set(KEY.format, CONTENT_FORMAT);
    await bumpVersion();
  } finally {
    await redis.del(KEY.seedLock);
  }
}

let seedIds: string[] | null = null;
const seedOrder = () => (seedIds ??= seedSnapshot().cards.map((c) => c.id));

/**
 * Grava a carga inicial, se o Redis ainda não tem conteúdo. Uma trava evita que duas funções gravem ao mesmo tempo;
 * quem não pegou a trava espera a outra terminar.
 */
export async function seedContent(): Promise<void> {
  const redis = getRedis();
  const locked = await redis.set(KEY.seedLock, '1', { nx: true, ex: 120 });
  if (!locked) {
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      if ((await readContentVersion()) !== null) return;
    }
    throw new ContentError(503, 'O conteúdo do jogo está sendo gravado. Tente de novo em instantes.');
  }
  try {
    if ((await readContentVersion()) !== null) return;
    const seed = seedSnapshot();
    // Em partes, para cada pedido ao Upstash ficar pequeno.
    for (let i = 0; i < seed.cards.length; i += 300) {
      await redis.hset(KEY.card, Object.fromEntries(seed.cards.slice(i, i + 300).map((c) => [c.id, c])));
    }
    await redis.hset(KEY.layout, seed.layouts);
    await redis.hset(KEY.icon, seed.icons);
    await redis.set(KEY.format, CONTENT_FORMAT);
    await redis.set(KEY.version, 1);
  } finally {
    await redis.del(KEY.seedLock);
  }
}

/** Guarda o valor anterior no histórico do item (só as últimas `HISTORY_SIZE`); devolve o que saiu da lista. */
async function pushHistory(kind: ContentKind, id: string, value: unknown): Promise<HistoryEntry[]> {
  if (value === null || value === undefined) return [];
  const redis = getRedis();
  const key = historyKey(kind, id);
  const entry: HistoryEntry = { savedAt: new Date().toISOString(), value };
  const [, dropped] = await redis
    .pipeline()
    .lpush(key, JSON.stringify(entry))
    .lrange<HistoryEntry>(key, HISTORY_SIZE, -1)
    .ltrim(key, 0, HISTORY_SIZE - 1)
    .exec<[number, HistoryEntry[], string]>();
  return dropped ?? [];
}

async function bumpVersion(): Promise<number> {
  return getRedis().incr(KEY.version);
}

async function readItem<T>(kind: ContentKind, id: string): Promise<T> {
  await ensureReady();
  const value = await getRedis().hget<T>(KEY[kind], id);
  if (value === null || value === undefined) throw new ContentError(404, 'Item não encontrado no conteúdo.');
  return value;
}

/** Aplica edições num layout, num ícone ou no `layout` de uma carta, guardando a versão anterior. */
export async function saveChanges(kind: 'layout' | 'icon', id: string, changes: ContentChange[]): Promise<number> {
  const current = await readItem<object>(kind, id);
  const next = applyChanges(current, changes);
  await pushHistory(kind, id, current);
  await getRedis().hset(KEY[kind], { [id]: next });
  return bumpVersion();
}

export async function saveCardLayoutChanges(id: string, changes: ContentChange[]): Promise<number> {
  const card = await readItem<Card>('card', id);
  if (!card.layout) throw new ContentError(400, 'A carta ainda não foi escaneada (não tem layout).');
  const next = { ...card, layout: applyChanges(card.layout, changes) };
  await pushHistory('card', id, card);
  await getRedis().hset(KEY.card, { [id]: next });
  return bumpVersion();
}

/** Layouts das coleções impressas: não podem ser excluídos. */
export const PRINTED_LAYOUTS: readonly string[] = ['layout-01', 'layout-02', 'layout-03', 'layout-04', 'layout-05'];

/** Cria um layout novo, cópia de `base` (molduras, painéis, posições e ícones), com outro id e nome. */
export async function createLayout(id: string, label: string, base: string): Promise<number> {
  const source = await readItem<LayoutSpec>('layout', base);
  const redis = getRedis();
  const created = await redis.hsetnx(KEY.layout, id, { ...source, id, label });
  if (!created) throw new ContentError(409, 'Já existe um layout com esse id.');
  return bumpVersion();
}

/**
 * Exclui um layout criado no editor, se nenhuma carta do catálogo o usa. Devolve as imagens dele que estavam no Blob
 * (as de `<id>/`), para quem chama apagar de lá.
 */
export async function deleteLayout(id: string): Promise<{ version: number; dropped: string[] }> {
  if (PRINTED_LAYOUTS.includes(id)) throw new ContentError(400, 'Os layouts das coleções não podem ser excluídos.');
  await readItem<LayoutSpec>('layout', id);
  const redis = getRedis();
  const cards = Object.values((await redis.hgetall<Record<string, Card>>(KEY.card)) ?? {});
  const users = cards.filter((c) => c.layout?.layout === id);
  if (users.length) {
    throw new ContentError(409, `O layout é usado por ${users.length} carta(s) (ex.: ${users[0].id}). Troque o layout delas antes.`);
  }
  const assets = (await redis.hgetall<AssetMap>(KEY.asset)) ?? {};
  const own = Object.keys(assets).filter((p) => p.startsWith(`${id}/`));
  const tx = redis.multi().hdel(KEY.layout, id).del(historyKey('layout', id));
  if (own.length) tx.hdel(KEY.asset, ...own);
  await tx.exec();
  return { version: await bumpVersion(), dropped: own.map((p) => String(assets[p])) };
}

/** Lê uma carta do conteúdo (404 se não existir). */
export async function readCard(id: string): Promise<Card> {
  return readItem<Card>('card', id);
}

/** Grava uma carta inteira editada pelo site (aba Editar do detalhe), guardando a versão anterior. */
export async function saveCard(card: Card): Promise<{ version: number; previous: Card }> {
  const previous = await readItem<Card>('card', card.id);
  await pushHistory('card', card.id, previous);
  await getRedis().hset(KEY.card, { [card.id]: card });
  return { version: await bumpVersion(), previous };
}

/**
 * Grava cartas inteiras (scripts locais, ex.: o resultado do scan em scripts/card-scan/apply.ts), guardando a versão
 * anterior de cada uma. Carta nova (id que não existe) entra sem histórico.
 */
export async function saveCards(cards: Card[]): Promise<number> {
  await ensureReady();
  const redis = getRedis();
  for (const card of cards) {
    const previous = await redis.hget<Card>(KEY.card, card.id);
    await pushHistory('card', card.id, previous);
    await redis.hset(KEY.card, { [card.id]: card });
  }
  return bumpVersion();
}

/**
 * Troca a imagem de um caminho e devolve a versão nova e a URL anterior (quem chama apaga essa do Blob). A leitura da
 * anterior e a gravação são uma transação só: dois envios ao mesmo tempo nunca perdem a URL de um deles (que ficaria
 * no Blob sem uso). As imagens não têm histórico: só fica guardada a que está em uso.
 */
export async function saveAsset(path: string, url: string): Promise<{ version: number; previous: string | null }> {
  const [previous] = await getRedis().multi().hget<string>(KEY.asset, path).hset(KEY.asset, { [path]: url }).exec<[string | null, number]>();
  return { version: await bumpVersion(), previous: previous === null || previous === undefined ? null : String(previous) };
}

/** Tira a imagem do Blob do caminho (volta a valer a do deploy); devolve a URL que saiu, para apagar do Blob. */
export async function removeAsset(path: string): Promise<{ version: number; previous: string | null }> {
  const [previous] = await getRedis().multi().hget<string>(KEY.asset, path).hdel(KEY.asset, path).exec<[string | null, number]>();
  if (previous === null || previous === undefined) throw new ContentError(404, 'Esta imagem não está no Blob.');
  return { version: await bumpVersion(), previous: String(previous) };
}

/** Imagens já enviadas ao Blob (caminho → URL). */
export async function readAssets(): Promise<AssetMap> {
  const map = await getRedis().hgetall<AssetMap>(KEY.asset);
  return Object.fromEntries(Object.entries(map ?? {}).map(([k, v]) => [k, String(v)]));
}

export async function readHistory(kind: ContentKind, id: string): Promise<HistoryEntry[]> {
  return (await getRedis().lrange<HistoryEntry>(historyKey(kind, id), 0, HISTORY_SIZE - 1)) ?? [];
}

/** Volta um item para uma versão do histórico (a atual entra no histórico, então dá para desfazer a restauração). */
export async function restoreHistory(kind: ContentKind, id: string, index: number): Promise<number> {
  const entry = (await readHistory(kind, id))[index];
  if (!entry) throw new ContentError(404, 'Versão não encontrada no histórico.');
  const current = await readItem<object>(kind, id);
  await pushHistory(kind, id, current);
  await getRedis().hset(KEY[kind], { [id]: entry.value });
  return bumpVersion();
}
