import { deckName, deckNameKey, isReinforcementCard, type Card } from '../models/card.ts';

/**
 * Regras de montagem (rulebook PT-BR, "Baralhos [Decks]", p. 10, e "Nome de um Card", p. 43–44):
 * - exatamente 50 cartas (o rulebook original pedia 40);
 * - qualquer quantidade de Ninjas, Jutsus, Missões e Clientes (desde "Will of Fire");
 * - até 3 cartas com o mesmo nome, sendo o nome o impresso completo (ver `deckName`);
 *   exceto cartas que imprimem "You can play with as many copies of this card in your Deck as you want"
 *   (a partir do S26, ex.: S26 N-1551 Samurai Warrior), que não têm limite de cópias.
 *
 * Baralho de Reforço [Reinforcement Deck] (docs/REGRAS.md 4.17), opcional:
 * - até 15 cartas, só Esquadrões e Ninjas "Reinforcement" (ver `isReinforcementCard`);
 * - até 3 cartas com o mesmo nome, contadas só dentro do Baralho de Reforço;
 * - essas cartas não podem ir para o Deck, então não contam nas 50.
 *
 * As duas partes ficam no mesmo mapa `DeckCards`: cada carta vai para um lugar só, então a parte é
 * deduzida da própria carta (decks salvos, códigos de compartilhamento e salas não mudam de formato).
 */
export const DECK_RULES = {
  size: 50,
  maxCopiesPerName: 3,
  reinforcementMax: 15,
} as const;

/** Parte do deck em que a carta fica. */
export type DeckPart = 'main' | 'reinforcement';

export function deckPartOf(card: Card): DeckPart {
  let p = partCache.get(card);
  if (p === undefined) {
    p = isReinforcementCard(card) ? 'reinforcement' : 'main';
    partCache.set(card, p);
  }
  return p;
}

const NO_COPY_LIMIT = /as many copies of this card in your deck as you want/i;

// Caches por carta: o montador consulta milhares de cartas a cada clique.
const noCopyLimitCache = new WeakMap<Card, boolean>();
const nameKeyCache = new WeakMap<Card, string>();
const partCache = new WeakMap<Card, DeckPart>();

/** A carta imprime que o deck pode ter qualquer quantidade de cópias dela. */
export function hasNoCopyLimit(card: Card): boolean {
  let v = noCopyLimitCache.get(card);
  if (v === undefined) {
    v = card.text.some((t) => NO_COPY_LIMIT.test(t));
    noCopyLimitCache.set(card, v);
  }
  return v;
}

/** Chave do nome dentro da parte do deck: o limite de 3 por nome é contado separadamente em cada parte. */
function nameKey(card: Card): string {
  let k = nameKeyCache.get(card);
  if (k === undefined) {
    k = `${deckPartOf(card)}:${deckNameKey(card)}`;
    nameKeyCache.set(card, k);
  }
  return k;
}

/** Conteúdo de um deck: id da carta → quantidade (Deck e Baralho de Reforço juntos, ver `deckPartOf`). */
export type DeckCards = Record<string, number>;

export interface DeckIssue {
  code: 'size' | 'copies' | 'unknown-card' | 'reinforcement-size';
  message: string;
}

export interface DeckSummary {
  /** Cartas do Deck (sem o Baralho de Reforço). */
  total: number;
  /** Cartas do Deck por tipo (sem o Baralho de Reforço). */
  byType: Record<Card['type'], number>;
  /** Cartas no Baralho de Reforço. */
  reinforcement: number;
  issues: DeckIssue[];
  isValid: boolean;
}

type CardLookup = (id: string) => Card | undefined;

/** Quantas cartas da mesma parte do deck têm o mesmo nome desta carta (ver `deckName`). */
export function countSameName(cards: DeckCards, card: Card, lookup: CardLookup): number {
  return indexDeck(cards, lookup).copiesByName.get(nameKey(card)) ?? 0;
}

/** Total de cartas no mapa, somando Deck e Baralho de Reforço. */
export function totalCards(cards: DeckCards): number {
  return Object.values(cards).reduce((sum, qty) => sum + qty, 0);
}

/** Totais do deck pré-calculados, para checar muitas cartas sem percorrer o deck de novo. */
export interface DeckIndex {
  /** Cartas por parte do deck. */
  totals: Record<DeckPart, number>;
  /** Parte + `deckNameKey` → quantidade de cartas com esse nome naquela parte. */
  copiesByName: ReadonlyMap<string, number>;
}

export function indexDeck(cards: DeckCards, lookup: CardLookup): DeckIndex {
  const copiesByName = new Map<string, number>();
  const totals: Record<DeckPart, number> = { main: 0, reinforcement: 0 };
  for (const [id, qty] of Object.entries(cards)) {
    const card = lookup(id);
    if (!card) {
      totals.main += qty;
      continue;
    }
    totals[deckPartOf(card)] += qty;
    const key = nameKey(card);
    copiesByName.set(key, (copiesByName.get(key) ?? 0) + qty);
  }
  return { totals, copiesByName };
}

/** Igual a `cannotAddReason`, mas usando um `DeckIndex` já calculado (O(1) por carta). */
export function cannotAddReasonIn(index: DeckIndex, card: Card): string | null {
  const part = deckPartOf(card);
  if (part === 'reinforcement' && index.totals.reinforcement >= DECK_RULES.reinforcementMax) {
    return `O Baralho de Reforço já tem ${DECK_RULES.reinforcementMax} cartas.`;
  }
  if (part === 'main' && index.totals.main >= DECK_RULES.size) return `O deck já tem ${DECK_RULES.size} cartas.`;
  if (!hasNoCopyLimit(card) && (index.copiesByName.get(nameKey(card)) ?? 0) >= DECK_RULES.maxCopiesPerName) {
    return part === 'reinforcement'
      ? `Máximo de ${DECK_RULES.maxCopiesPerName} cartas com o nome "${deckName(card)}" no Baralho de Reforço.`
      : `Máximo de ${DECK_RULES.maxCopiesPerName} cartas com o nome "${deckName(card)}".`;
  }
  return null;
}

/**
 * Motivo pelo qual não é possível adicionar mais 1 cópia da carta, ou `null` se pode.
 * Usado para desabilitar o botão "+" no montador.
 */
export function cannotAddReason(cards: DeckCards, card: Card, lookup: CardLookup): string | null {
  return cannotAddReasonIn(indexDeck(cards, lookup), card);
}

export function summarizeDeck(cards: DeckCards, lookup: CardLookup): DeckSummary {
  const byType: DeckSummary['byType'] = { ninja: 0, jutsu: 0, mission: 0, client: 0 };
  const perName = new Map<string, { name: string; part: DeckPart; qty: number; unlimited: boolean }>();
  const issues: DeckIssue[] = [];
  let total = 0;
  let reinforcement = 0;

  for (const [id, qty] of Object.entries(cards)) {
    if (qty <= 0) continue;
    const card = lookup(id);
    if (!card) {
      total += qty;
      issues.push({ code: 'unknown-card', message: `Carta desconhecida: "${id}".` });
      continue;
    }
    const part = deckPartOf(card);
    if (part === 'reinforcement') {
      reinforcement += qty;
    } else {
      total += qty;
      byType[card.type] += qty;
    }
    const key = nameKey(card);
    const entry = perName.get(key) ?? { name: deckName(card), part, qty: 0, unlimited: true };
    entry.qty += qty;
    // Só fica sem limite se todas as cartas com esse nome no deck imprimirem a exceção.
    entry.unlimited &&= hasNoCopyLimit(card);
    perName.set(key, entry);
  }

  if (total !== DECK_RULES.size) {
    issues.push({
      code: 'size',
      message:
        total < DECK_RULES.size
          ? `Faltam ${DECK_RULES.size - total} cartas (o deck precisa ter exatamente ${DECK_RULES.size}).`
          : `Sobram ${total - DECK_RULES.size} cartas (o deck precisa ter exatamente ${DECK_RULES.size}).`,
    });
  }
  if (reinforcement > DECK_RULES.reinforcementMax) {
    issues.push({
      code: 'reinforcement-size',
      message: `Sobram ${reinforcement - DECK_RULES.reinforcementMax} cartas no Baralho de Reforço (máximo de ${DECK_RULES.reinforcementMax}).`,
    });
  }
  for (const { name, part, qty, unlimited } of perName.values()) {
    if (!unlimited && qty > DECK_RULES.maxCopiesPerName) {
      issues.push({
        code: 'copies',
        message: `${qty} cartas com o nome "${name}"${part === 'reinforcement' ? ' no Baralho de Reforço' : ''} — o máximo é ${DECK_RULES.maxCopiesPerName}.`,
      });
    }
  }

  return { total, byType, reinforcement, issues, isValid: issues.length === 0 };
}
