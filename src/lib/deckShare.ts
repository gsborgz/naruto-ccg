import { parseDeckArts, type AltArtPlacement } from './altArts.ts';
import type { CustomCard } from './cardMaker/model.ts';
import { parseSharedCustomCards } from './cardMaker/sharedCard.ts';
import type { DeckCards } from './deckRules.ts';

/**
 * Compartilhamento de decks por UUID (mesmo modelo do projeto pokedex): o navegador envia uma cópia
 * do deck (ou de todos os decks) para o servidor, que grava no Redis e devolve um UUID. Quem tiver o
 * UUID consegue importar essa cópia. É um retrato do momento: editar o deck depois não muda o que foi
 * compartilhado (basta compartilhar de novo para gerar outro código).
 *
 * Este arquivo só tem tipos e validação, usados tanto pela API quanto pelo navegador.
 */

export interface SharedDeck {
  name: string;
  cards: DeckCards;
  /**
   * As cartas criadas que o deck usa (id no deck `custom-<uuid>` → carta), com as artes no Vercel Blob (ver
   * `src/lib/cardMaker/sharedCard.ts`). Ausente quando o deck só tem cartas do catálogo.
   */
  custom?: Record<string, CustomCard>;
  /**
   * Artes alternativas escolhidas por quem levou o deck (carta do catálogo → arte; README, "Artes alternativas"):
   * na partida, as cartas dele aparecem montadas com elas. Só nas salas.
   */
  arts?: Record<string, AltArtPlacement>;
}

export type SharePayload = { kind: 'deck'; deck: SharedDeck } | { kind: 'collection'; decks: SharedDeck[] };

export type StoredShare = SharePayload & { version: 1; createdAt: string };

export const SHARE_LIMITS = {
  nameLength: 100,
  /** Cartas diferentes num deck (um deck válido tem no máximo 50). */
  entriesPerDeck: 200,
  copiesPerCard: 99,
  decksPerCollection: 500,
} as const;

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidShareId(id: string): boolean {
  return UUID_PATTERN.test(id);
}

export function shareKey(id: string): string {
  return `naruto-ccg:share:${id.toLowerCase()}`;
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/**
 * Valida e normaliza um deck vindo de fora; `null` se for inválido. As cartas criadas (`custom`) são validadas
 * campo a campo e contam como conhecidas; só ficam as que o deck usa.
 */
export function parseSharedDeck(x: unknown, isKnownCard: (id: string) => boolean): SharedDeck | null {
  if (!isRecord(x) || typeof x.name !== 'string' || !isRecord(x.cards)) return null;
  const custom = parseSharedCustomCards(x.custom);
  if (!custom) return null;
  const name = x.name.trim().slice(0, SHARE_LIMITS.nameLength) || 'Deck sem nome';
  const entries = Object.entries(x.cards);
  if (entries.length > SHARE_LIMITS.entriesPerDeck) return null;
  const cards: DeckCards = {};
  for (const [id, qty] of entries) {
    if (!isKnownCard(id) && !Object.hasOwn(custom, id)) return null;
    if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > SHARE_LIMITS.copiesPerCard) return null;
    cards[id] = qty as number;
  }
  const arts = parseDeckArts(x.arts, cards);
  if (!arts) return null;
  const used = Object.fromEntries(Object.entries(custom).filter(([id]) => Object.hasOwn(cards, id)));
  return {
    name,
    cards,
    ...(Object.keys(used).length > 0 && { custom: used }),
    ...(Object.keys(arts).length > 0 && { arts }),
  };
}

/** Valida o corpo de um compartilhamento; `null` se for inválido. */
export function parseSharePayload(x: unknown, isKnownCard: (id: string) => boolean): SharePayload | null {
  if (!isRecord(x)) return null;
  if (x.kind === 'deck') {
    const deck = parseSharedDeck(x.deck, isKnownCard);
    return deck && { kind: 'deck', deck };
  }
  if (x.kind === 'collection') {
    if (!Array.isArray(x.decks) || x.decks.length === 0 || x.decks.length > SHARE_LIMITS.decksPerCollection) return null;
    const decks: SharedDeck[] = [];
    for (const d of x.decks) {
      const deck = parseSharedDeck(d, isKnownCard);
      if (!deck) return null;
      decks.push(deck);
    }
    return { kind: 'collection', decks };
  }
  return null;
}

/** Decks contidos num compartilhamento (1 para deck, N para coleção). */
export function sharedDecks(share: SharePayload): SharedDeck[] {
  return share.kind === 'deck' ? [share.deck] : share.decks;
}
