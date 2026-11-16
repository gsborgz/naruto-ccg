import { ELEMENT_LABEL, type CardType, type ElementSymbol } from '../../models/card.ts';
import { customDeckCardId } from './customIds.ts';
import {
  ATTRIBUTE_FRAMES,
  MAX_VILLAGES,
  VILLAGES,
  type CardElement,
  type CustomCard,
  type CustomCardArt,
  type JutsuCostPart,
  type VillageMark,
} from './model.ts';

/**
 * Cartas do criador fora deste navegador: nas salas de jogo e nos compartilhamentos por código (docs/SALAS.md,
 * "Cartas criadas"). O deck leva a definição de cada carta criada, para o servidor aplicar as regras e quem recebe
 * conseguir desenhá-la.
 *
 * As artes enviadas pelo jogador ficam no Vercel Blob (`src/lib/artStore.ts`) e a carta leva só o endereço. As
 * artes do próprio site (caminhos `/card-layouts/...` e `/cards/...`) ficam como estão. Data URLs não são aceitos:
 * a arte tem que ser enviada antes, pelo **Salvar** do criador (`uploadCardArt`).
 */

export const SHARED_CARD_LIMITS = {
  /** Cartas criadas diferentes num deck. */
  cardsPerDeck: 80,
} as const;

/** Peso máximo de uma arte no servidor (o navegador comprime para até 300 KB; a folga cobre arredondamentos). */
export const ART_MAX_BYTES = 400_000;

/** Formatos aceitos de arte enviada: WebP (o que o navegador gera), JPEG e PNG (navegadores sem WebP no canvas). */
export const ART_DATA_URL = /^data:image\/(jpeg|webp|png);base64,[A-Za-z0-9+/]+=*$/;

/** Caminho da arte no Blob: o nome é o SHA-256 do arquivo (a mesma imagem nunca é guardada duas vezes). */
export function artPathname(hash: string, ext: string): string {
  return `naruto-ccg/art/${hash}.${ext}`;
}

/** Endereço público de uma arte no Blob (qualquer store do Vercel Blob, na pasta das artes). */
export const BLOB_ART_URL = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/naruto-ccg\/art\/[0-9a-f]{64}\.(webp|jpg|png)$/;

/** A arte está no Blob (e não só neste navegador)? */
export function isBlobArt(src: string | null | undefined): boolean {
  return !!src && BLOB_ART_URL.test(src);
}

const ELEMENTS = Object.keys(ELEMENT_LABEL) as ElementSymbol[];
const TYPES: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];
const LAYOUT_IDS = ['layout-01', 'layout-02', 'layout-03', 'layout-04', 'layout-05'] as const;
const VARIANTS = ['01', '02', '03'] as const;
const ENTRANCE_ICONS = ['entrance-01', 'entrance-02', 'entrance-03', 'entrance-04'] as const;
const HAND_ICONS = ['hand-01', 'hand-02', 'hand-03'] as const;
/** Arte do próprio site: arte extraída ou carta impressa (sem `..`, sem endereço externo). */
const SITE_ART = /^\/(card-layouts|cards)\/[A-Za-z0-9_.\-/]+$/;

type Rec = Record<string, unknown>;
const isRec = (x: unknown): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x);

class Invalid extends Error {}
const fail = (): never => {
  throw new Invalid();
};

function str(v: unknown, max: number): string {
  return typeof v === 'string' && v.length <= max ? v : fail();
}
function optStr(v: unknown, max: number): string | undefined {
  return v === undefined ? undefined : str(v, max);
}
function optBool(v: unknown): boolean | undefined {
  return v === undefined ? undefined : typeof v === 'boolean' ? v : fail();
}
function oneOf<T extends string>(v: unknown, list: readonly T[]): T {
  return list.includes(v as T) ? (v as T) : fail();
}
function num(v: unknown, min: number, max: number): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : fail();
}
function arr(v: unknown, max: number): unknown[] {
  return Array.isArray(v) && v.length <= max ? v : fail();
}

function art(v: unknown): CustomCardArt {
  if (!isRec(v)) return fail();
  const src = v.src === null ? null : str(v.src, 300);
  if (src !== null && !BLOB_ART_URL.test(src) && !(SITE_ART.test(src) && !src.includes('..'))) fail();
  return { src, x: num(v.x, -20000, 20000), y: num(v.y, -20000, 20000), zoom: num(v.zoom, 0.01, 100) };
}

function costPart(v: unknown): JutsuCostPart {
  if (!isRec(v)) return fail();
  return { symbols: arr(v.symbols, 8).map((s) => oneOf(s, ELEMENTS)), generic: str(v.generic, 4) };
}

/**
 * Valida e copia (só os campos conhecidos) uma carta criada vinda de um navegador. `null` se for inválida.
 * Os textos são mostrados como texto (React), então só o tamanho é limitado.
 */
export function parseSharedCustomCard(x: unknown): CustomCard | null {
  try {
    if (!isRec(x)) return null;
    const id = str(x.id, 64);
    if (!/^[A-Za-z0-9-]+$/.test(id)) return null;
    const elements: CardElement[] = arr(x.elements, 3).map((e) =>
      isRec(e) ? { element: oneOf(e.element, ELEMENTS), variant: oneOf(e.variant, VARIANTS) } : fail(),
    );
    const villages: VillageMark[] = arr(x.villages ?? [], MAX_VILLAGES).map((v) =>
      isRec(v) && typeof v.rogue === 'boolean' ? { village: oneOf(v.village, VILLAGES), rogue: v.rogue } : fail(),
    );
    const attribute = isRec(x.attribute) ? x.attribute : fail();
    const jutsuCost = isRec(x.jutsuCost) ? x.jutsuCost : fail();
    const alternatives =
      jutsuCost.alternatives === undefined ? undefined : arr(jutsuCost.alternatives, 3).map(costPart);
    const kanji = optStr(attribute.kanji, 10);
    const card: CustomCard = {
      id,
      layout: oneOf(x.layout, LAYOUT_IDS),
      type: oneOf(x.type, TYPES),
      name: str(x.name, 120),
      elements,
      flavor: str(x.flavor, 600),
      text: str(x.text, 4000),
      characteristics: arr(x.characteristics, 20).map((c) => str(c, 80)),
      villages,
      entranceCost: str(x.entranceCost, 4),
      handCost: str(x.handCost, 4),
      entranceIcon: oneOf(x.entranceIcon, ENTRANCE_ICONS),
      handIcon: oneOf(x.handIcon, HAND_ICONS),
      healthy: str(x.healthy, 12),
      injured: str(x.injured, 12),
      attribute: {
        frame: oneOf(attribute.frame, ATTRIBUTE_FRAMES),
        label: str(attribute.label, 80),
        ...(kanji !== undefined && { kanji }),
      },
      jutsuCost: { ...costPart(jutsuCost), ...(alternatives && { alternatives }) },
      art: art(x.art),
      createdAt: str(x.createdAt, 40),
      updatedAt: str(x.updatedAt, 40),
    };
    if (x.artFront !== undefined) card.artFront = art(x.artFront);
    const optional = {
      artLinked: optBool(x.artLinked),
      nameBanner: optBool(x.nameBanner),
      nameSize: x.nameSize === undefined ? undefined : num(x.nameSize, -200, 200),
      panelVariant: optStr(x.panelVariant, 40),
      typeVariant: optStr(x.typeVariant, 40),
      printedFlavor: optStr(x.printedFlavor, 600),
      flavorShade: optBool(x.flavorShade),
    };
    for (const [k, v] of Object.entries(optional)) if (v !== undefined) (card as unknown as Rec)[k] = v;
    return card;
  } catch (e) {
    if (e instanceof Invalid) return null;
    throw e;
  }
}

/**
 * Cartas criadas de um deck vindo de fora: id no deck (`custom-<uuid>`) → carta. `null` se alguma for inválida
 * ou não bater com a chave.
 */
export function parseSharedCustomCards(x: unknown): Record<string, CustomCard> | null {
  if (x === undefined) return {};
  if (!isRec(x)) return null;
  const entries = Object.entries(x);
  if (entries.length > SHARED_CARD_LIMITS.cardsPerDeck) return null;
  const result: Record<string, CustomCard> = {};
  for (const [key, value] of entries) {
    const card = parseSharedCustomCard(value);
    if (!card || customDeckCardId(card.id) !== key) return null;
    result[key] = card;
  }
  return result;
}
