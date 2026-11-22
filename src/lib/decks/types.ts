import type { DeckCards } from '../deckRules.ts';

/**
 * Deck de um jogador, guardado na nuvem (`src/lib/decks/store.ts`). Usado pelo navegador e pelo servidor.
 *
 * `designs`: a alter escolhida para cada carta do catálogo neste deck (id da carta → id da alter, uma carta do criador
 * ligada a ela). Sem escolha (ou `original`, de decks antigos), a imagem impressa. Vale na tela, na impressão e na
 * partida (`src/lib/deckDesigns.ts`).
 */
export interface Deck {
  id: string;
  name: string;
  cards: DeckCards;
  designs?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/** Escolha da imagem impressa (decks antigos; hoje, sem escolha já é a impressa). */
export const ORIGINAL_DESIGN = 'original';

export const DECK_LIMITS = {
  decks: 500,
  nameLength: 100,
  /** Cartas diferentes num deck (um deck válido tem no máximo 50, mais o Reforço e os Tokens). */
  entries: 200,
  copies: 99,
} as const;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Id de carta no deck: do catálogo (`s01-n-001`) ou criada (`custom-<uuid>`). */
const DECK_CARD_ID = /^[a-z0-9-]{1,80}$/i;
const CATALOG_ID = /^[a-z0-9-]{1,40}$/;
const VERSION_ID = /^[A-Za-z0-9-]{1,64}$/;

const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Escolhas de design válidas (ver `Deck.designs`); `null` se o formato for inválido. */
export function parseDeckDesigns(x: unknown): Record<string, string> | null {
  if (x === undefined) return {};
  if (!isRecord(x)) return null;
  const entries = Object.entries(x);
  if (entries.length > DECK_LIMITS.entries) return null;
  const out: Record<string, string> = {};
  for (const [id, v] of entries) {
    if (!CATALOG_ID.test(id) || typeof v !== 'string' || !VERSION_ID.test(v)) return null;
    out[id] = v;
  }
  return out;
}

/** Confere e normaliza um deck vindo do navegador; `null` se for inválido. */
export function parseDeck(x: unknown): Deck | null {
  if (!isRecord(x) || typeof x.id !== 'string' || !UUID.test(x.id) || typeof x.name !== 'string' || !isRecord(x.cards)) {
    return null;
  }
  const entries = Object.entries(x.cards);
  if (entries.length > DECK_LIMITS.entries) return null;
  const cards: DeckCards = {};
  for (const [id, qty] of entries) {
    if (!DECK_CARD_ID.test(id) || !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > DECK_LIMITS.copies) return null;
    cards[id] = qty as number;
  }
  const designs = parseDeckDesigns(x.designs);
  if (!designs) return null;
  const date = (v: unknown) => (typeof v === 'string' && v.length <= 40 ? v : new Date().toISOString());
  return {
    id: x.id.toLowerCase(),
    name: x.name.trim().slice(0, DECK_LIMITS.nameLength) || 'Deck sem nome',
    cards,
    ...(Object.keys(designs).length > 0 && { designs }),
    createdAt: date(x.createdAt),
    updatedAt: date(x.updatedAt),
  };
}
