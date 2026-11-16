import type { Card } from '../models/card.ts';
import type { DeckCards } from './deckRules.ts';
import { isBlobArt } from './cardMaker/sharedCard.ts';
import { isCustomCardId } from './cardMaker/customIds.ts';

/**
 * Artes alternativas das cartas do catálogo (README, "Artes alternativas"): qualquer jogador envia uma arte para uma
 * carta pelo detalhe dela, e a arte fica disponível para todo mundo. Cada jogador escolhe, no próprio navegador, qual
 * arte usar em cada carta (a original ou uma das enviadas); com uma arte escolhida, a carta aparece montada com ela
 * na listagem, no montador e na partida.
 *
 * Este arquivo só tem tipos e validação, usados pela API, pelas salas e pelo navegador.
 */

/** A imagem (no Vercel Blob) e o enquadramento dela, o mesmo do criador (`CustomCardArt`). */
export interface AltArtPlacement {
  src: string;
  x: number;
  y: number;
  zoom: number;
}

/** Uma arte alternativa enviada para uma carta. */
export interface AltArt extends AltArtPlacement {
  id: string;
  cardId: string;
  createdAt: string;
}

/** Como a API devolve: com `mine` quando foi este jogador que enviou (só ele pode remover). */
export type AltArtView = AltArt & { mine?: boolean };

export const ALT_ART_LIMITS = {
  /** Artes alternativas por carta. */
  perCard: 30,
} as const;

/**
 * Carta com a arte já decidida por quem a mostra (ex.: na partida, a escolhida pelo dono da carta). Com `altArt`
 * presente (mesmo `null`), a escolha deste navegador é ignorada.
 */
export type ArtCard = Card & { altArt?: AltArtPlacement | null };

export function hasFixedArt(card: Card): card is ArtCard & { altArt: AltArtPlacement | null } {
  return 'altArt' in card;
}

/** A carta com a arte fixada (`null` = a original), ignorando a escolha deste navegador. */
export function withFixedArt(card: Card, art: AltArtPlacement | null): Card {
  const fixed: ArtCard = { ...card, altArt: art };
  return fixed;
}

const ALT_ART_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isAltArtId(id: unknown): id is string {
  return typeof id === 'string' && ALT_ART_ID.test(id);
}

/** Cartas do catálogo aceitam artes alternativas (as criadas mudam a arte no próprio criador). */
export function acceptsAltArt(cardId: string): boolean {
  return !isCustomCardId(cardId);
}

const isRec = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const num = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

/** Valida a imagem e o enquadramento; `null` se forem inválidos. Só artes do Vercel Blob. */
export function parseAltArtPlacement(x: unknown): AltArtPlacement | null {
  if (!isRec(x) || typeof x.src !== 'string' || !isBlobArt(x.src)) return null;
  if (!num(x.x, -20000, 20000) || !num(x.y, -20000, 20000) || !num(x.zoom, 0.01, 100)) return null;
  return { src: x.src, x: x.x as number, y: x.y as number, zoom: x.zoom as number };
}

/**
 * Artes escolhidas para as cartas de um deck levado para a sala (`SharedDeck.arts`): carta → arte. `null` se
 * alguma for inválida; só ficam as cartas do catálogo que o deck usa.
 */
export function parseDeckArts(x: unknown, cards: DeckCards): Record<string, AltArtPlacement> | null {
  if (x === undefined) return {};
  if (!isRec(x)) return null;
  const result: Record<string, AltArtPlacement> = {};
  for (const [cardId, value] of Object.entries(x)) {
    const placement = parseAltArtPlacement(value);
    if (!placement) return null;
    if (Object.hasOwn(cards, cardId) && acceptsAltArt(cardId)) result[cardId] = placement;
  }
  return result;
}
