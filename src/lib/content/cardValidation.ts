import { ELEMENT_LABEL, type Card, type CardType, type ElementSymbol, type JutsuCostOption, type Power } from '../../models/card.ts';
import { NAME_WRAPS, type CardArtPlacement, type CardLayoutInfo } from '../../models/cardLayout.ts';
import { isBlobArt } from '../cardMaker/sharedCard.ts';
import { NAME_SIZE_RANGE } from './changes.ts';

/**
 * Confere uma carta do catálogo editada pelo site (aba Editar do detalhe da carta) antes de gravar: só os campos do
 * formato \`Card\`, com tipos e limites. O id, a coleção, o número, a imagem e o Token ficam os da carta gravada.
 * Devolve a carta limpa (sem campos a mais) ou a mensagem do primeiro problema.
 */

type Rec = Record<string, unknown>;
const isRec = (x: unknown): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x);
const ELEMENTS = Object.keys(ELEMENT_LABEL) as ElementSymbol[];
const TYPES: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];

class Invalid extends Error {}
const fail = (msg: string): never => {
  throw new Invalid(msg);
};

const str = (v: unknown, max: number, what: string): string =>
  typeof v === 'string' && v.length <= max ? v : fail(`${what}: texto inválido (até ${max} caracteres).`);
const strList = (v: unknown, maxItems: number, maxLen: number, what: string): string[] =>
  Array.isArray(v) && v.length <= maxItems ? v.map((s) => str(s, maxLen, what)) : fail(`${what}: lista inválida.`);
const int = (v: unknown, min: number, max: number, what: string): number =>
  Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : fail(`${what}: número inválido.`);
const num = (v: unknown, min: number, max: number, what: string): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : fail(`${what}: número inválido.`);
const bool = (v: unknown, what: string): boolean => (typeof v === 'boolean' ? v : fail(`${what}: valor inválido.`));
const elements = (v: unknown, max: number, what: string): ElementSymbol[] =>
  Array.isArray(v) && v.length <= max && v.every((e) => ELEMENTS.includes(e)) ? (v as ElementSymbol[]) : fail(`${what}: elementos inválidos.`);
const xOr = (v: unknown, min: number, max: number, what: string): number | 'X' => (v === 'X' ? 'X' : int(v, min, max, what));

function power(v: unknown, what: string): Power {
  if (!isRec(v)) fail(`${what}: inválido.`);
  const p = v as Rec;
  return { combat: xOr(p.combat, -99, 99, what), support: xOr(p.support, -99, 99, what) };
}

function costOption(v: unknown): JutsuCostOption {
  if (!isRec(v)) fail('Custo do Jutsu inválido.');
  const o = v as Rec;
  const out: JutsuCostOption = { symbols: elements(o.symbols, 6, 'Custo do Jutsu'), generic: xOr(o.generic, 0, 99, 'Custo do Jutsu') };
  if (o.xCount !== undefined) out.xCount = int(o.xCount, 2, 9, 'Custo do Jutsu');
  return out;
}

function placement(v: unknown): CardArtPlacement {
  if (!isRec(v)) fail('Enquadramento da arte inválido.');
  const p = v as Rec;
  const out: CardArtPlacement = { x: num(p.x, -20000, 20000, 'Arte'), y: num(p.y, -20000, 20000, 'Arte'), zoom: num(p.zoom, 0.01, 100, 'Arte') };
  if (p.src !== undefined) {
    if (typeof p.src !== 'string' || !isBlobArt(p.src)) fail('A arte precisa estar no Vercel Blob.');
    out.src = p.src as string;
  } else {
    if (p.print !== undefined) out.print = bool(p.print, 'Arte');
    if (p.clean !== undefined) out.clean = bool(p.clean, 'Arte');
  }
  return out;
}

/** Variante de elemento: as impressas (01 a 03) e as criadas na aba Ícones. */
const VARIANT = /^[a-z0-9][a-z0-9-]{0,19}$/;

/** Id da versão escolhida (uma carta do criador). */
const designId = (v: unknown): string =>
  typeof v === 'string' && /^[A-Za-z0-9-]{1,64}$/.test(v) ? v : fail('Versão escolhida inválida.');

function layoutInfo(v: unknown, layouts: ReadonlySet<string>): CardLayoutInfo {
  if (!isRec(v)) fail('Layout da carta inválido.');
  const l = v as Rec;
  const id = str(l.layout, 60, 'Layout');
  if (!layouts.has(id)) fail(`Layout desconhecido: ${id}.`);
  if (!isRec(l.icons)) fail('Ícones da carta inválidos.');
  const icons = l.icons as Rec;
  const elementVariants = Array.isArray(icons.elements) && icons.elements.length <= 3 && icons.elements.every((e) => typeof e === 'string' && VARIANT.test(e));
  if (!elementVariants) fail('Variante de elemento inválida.');
  const out: CardLayoutInfo = {
    layout: id,
    icons: { type: str(icons.type, 40, 'Ícone do tipo'), elements: icons.elements as CardLayoutInfo['icons']['elements'] },
    art: {},
  };
  for (const k of ['entrance', 'hand', 'attribute'] as const) {
    if (icons[k] !== undefined) (out.icons as unknown as Rec)[k] = str(icons[k], 40, 'Ícone');
  }
  if (!isRec(l.art)) fail('Artes da carta inválidas.');
  const art = l.art as Rec;
  if (art.back !== undefined) out.art.back = placement(art.back);
  if (art.front !== undefined) out.art.front = placement(art.front);
  if (l.panelVariant !== undefined) out.panelVariant = str(l.panelVariant, 40, 'Design');
  if (l.nameBanner !== undefined) out.nameBanner = bool(l.nameBanner, 'Mancha do nome');
  if (l.textDivider !== undefined) out.textDivider = bool(l.textDivider, 'Linha acima do texto');
  if (l.nameSize !== undefined) out.nameSize = num(l.nameSize, -NAME_SIZE_RANGE, NAME_SIZE_RANGE, 'Tamanho do nome');
  if (l.nameWrap !== undefined) {
    if (!NAME_WRAPS.includes(l.nameWrap as never)) fail('Quebra de linha do nome inválida.');
    out.nameWrap = l.nameWrap as CardLayoutInfo['nameWrap'];
  }
  if (l.nameText !== undefined) out.nameText = str(l.nameText, 200, 'Nome');
  if (l.textMarkup !== undefined) out.textMarkup = str(l.textMarkup, 6000, 'Texto');
  if (l.flavorShade !== undefined) out.flavorShade = bool(l.flavorShade, 'Sombreado da frase');
  if (l.villages !== undefined) {
    if (!Array.isArray(l.villages) || l.villages.length > 3) fail('Vilas inválidas.');
    out.villages = (l.villages as unknown[]).map((x) => {
      if (!isRec(x)) fail('Vila inválida.');
      const vv = x as Rec;
      return { village: str(vv.village, 40, 'Vila'), rogue: bool(vv.rogue, 'Vila') };
    });
  }
  return out;
}

export function parseCatalogCard(
  x: unknown,
  original: Card,
  layouts: ReadonlySet<string>,
): { ok: true; card: Card } | { ok: false; message: string } {
  try {
    if (!isRec(x)) fail('Carta inválida.');
    const c = x as Rec;
    const type = c.type as CardType;
    if (!TYPES.includes(type)) fail('Tipo de carta inválido.');
    const name = str(c.name, 200, 'Nome').trim();
    if (!name) fail('A carta precisa de um nome.');
    const base = {
      id: original.id,
      name,
      type,
      elements: elements(c.elements, 6, 'Elementos'),
      number: original.number,
      set: original.set,
      text: strList(c.text, 30, 3000, 'Texto'),
      image: original.image,
      ...(c.token === true && { token: true }),
      ...(c.flavor !== undefined && c.flavor !== '' && { flavor: str(c.flavor, 1500, 'Frase') }),
      ...(c.layout !== undefined && { layout: layoutInfo(c.layout, layouts) }),
      ...(c.design !== undefined && { design: designId(c.design) }),
    };
    const costs = () => ({ entranceCost: int(c.entranceCost, -1, 99, 'Custo de entrada'), handCost: int(c.handCost, -1, 99, 'Custo de mão') });
    const characteristics = () => strList(c.characteristics, 30, 120, 'Características');
    let card: Card;
    if (type === 'ninja') {
      card = {
        ...base,
        type,
        ...costs(),
        characteristics: characteristics(),
        healthy: power(c.healthy, 'Força (saudável)'),
        injured: power(c.injured, 'Força (ferido)'),
        attributes: strList(c.attributes, 3, 60, 'Atributo de Combate'),
      };
    } else if (type === 'jutsu') {
      if (!isRec(c.cost)) fail('Custo do Jutsu inválido.');
      const cost = c.cost as Rec;
      const alternatives = cost.alternatives === undefined ? [] : Array.isArray(cost.alternatives) && cost.alternatives.length <= 4 ? cost.alternatives.map(costOption) : fail('Custos alternativos inválidos.');
      card = { ...base, type, cost: { ...costOption(cost), ...(alternatives.length && { alternatives }) } };
    } else if (type === 'mission') {
      card = { ...base, type, ...costs() };
    } else {
      card = { ...base, type, ...costs(), characteristics: characteristics() };
    }
    return { ok: true, card };
  } catch (e) {
    if (e instanceof Invalid) return { ok: false, message: e.message };
    throw e;
  }
}
