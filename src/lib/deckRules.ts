import { deckName, isReinforcementCard, isTokenCard, type Card } from '../models/card.ts';

/**
 * Regras de montagem (rulebook PT-BR, "Baralhos [Decks]", p. 10):
 * - exatamente 50 cartas (o rulebook original pedia 40);
 * - qualquer quantidade de Ninjas, Jutsus, Missões e Clientes (desde "Will of Fire");
 * - até 3 cópias de cada carta (pelo id: cartas diferentes com o mesmo nome contam separado; o rulebook
 *   limita por nome, mas o app conta por carta).
 *
 * Baralho de Reforço [Reinforcement Deck] (docs/REGRAS.md 4.17), opcional:
 * - até 15 cartas, só Esquadrões e Ninjas "Reinforcement" (ver `isReinforcementCard`);
 * - essas cartas não podem ir para o Deck, então não contam nas 50.
 *
 * Tokens: quantas cartas quiser, mas só cartas de Token (`isTokenCard`) e 1 cópia de cada. Não contam nas 50
 * nem no Reforço.
 *
 * As três partes ficam no mesmo mapa `DeckCards`: cada carta vai para um lugar só, então a parte é
 * deduzida da própria carta (decks salvos, códigos de compartilhamento e salas não mudam de formato).
 */
export const DECK_RULES = {
  size: 50,
  reinforcementMax: 15,
  /** Cópias de cada carta (pelo id) no Deck e no Baralho de Reforço. */
  copiesPerCard: 3,
  /** Cópias de cada Token. */
  copiesPerToken: 1,
} as const;

/** Parte do deck em que a carta fica. */
export type DeckPart = 'main' | 'reinforcement' | 'token';

export function deckPartOf(card: Card): DeckPart {
  let p = partCache.get(card);
  if (p === undefined) {
    p = isTokenCard(card) ? 'token' : isReinforcementCard(card) ? 'reinforcement' : 'main';
    partCache.set(card, p);
  }
  return p;
}

// Cache por carta: o montador consulta milhares de cartas a cada clique.
const partCache = new WeakMap<Card, DeckPart>();

/** Conteúdo de um deck: id da carta → quantidade (Deck, Baralho de Reforço e Tokens juntos, ver `deckPartOf`). */
export type DeckCards = Record<string, number>;

export interface DeckIssue {
  code: 'size' | 'unknown-card' | 'reinforcement-size' | 'copies' | 'token-copies';
  message: string;
}

export interface DeckSummary {
  /** Cartas do Deck (sem o Baralho de Reforço). */
  total: number;
  /** Cartas do Deck por tipo (sem o Baralho de Reforço). */
  byType: Record<Card['type'], number>;
  /** Cartas no Baralho de Reforço. */
  reinforcement: number;
  /** Cartas na parte Tokens. */
  tokens: number;
  issues: DeckIssue[];
  isValid: boolean;
}

export type CardLookup = (id: string) => Card | undefined;

/** Total de cartas no mapa, somando Deck, Baralho de Reforço e Tokens. */
export function totalCards(cards: DeckCards): number {
  return Object.values(cards).reduce((sum, qty) => sum + qty, 0);
}

/** Totais do deck pré-calculados, para checar muitas cartas sem percorrer o deck de novo. */
export interface DeckIndex {
  /** Cartas por parte do deck. */
  totals: Record<DeckPart, number>;
  /** Quantidade de cada carta (id → cópias). */
  cards: DeckCards;
}

export function indexDeck(cards: DeckCards, lookup: CardLookup): DeckIndex {
  const totals: Record<DeckPart, number> = { main: 0, reinforcement: 0, token: 0 };
  for (const [id, qty] of Object.entries(cards)) {
    if (qty <= 0) continue;
    const card = lookup(id);
    totals[card ? deckPartOf(card) : 'main'] += qty;
  }
  return { totals, cards };
}

/** Igual a `cannotAddReason`, mas usando um `DeckIndex` já calculado (O(1) por carta). */
export function cannotAddReasonIn(index: DeckIndex, card: Card): string | null {
  const part = deckPartOf(card);
  if (part === 'token') {
    return (index.cards[card.id] ?? 0) >= DECK_RULES.copiesPerToken ? 'Cada Token só pode ter 1 cópia no deck.' : null;
  }
  if ((index.cards[card.id] ?? 0) >= DECK_RULES.copiesPerCard) {
    return `O deck já tem ${DECK_RULES.copiesPerCard} cópias desta carta.`;
  }
  if (part === 'reinforcement' && index.totals.reinforcement >= DECK_RULES.reinforcementMax) {
    return `O Baralho de Reforço já tem ${DECK_RULES.reinforcementMax} cartas.`;
  }
  if (part === 'main' && index.totals.main >= DECK_RULES.size) return `O deck já tem ${DECK_RULES.size} cartas.`;
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
  const issues: DeckIssue[] = [];
  let total = 0;
  let reinforcement = 0;
  let tokens = 0;

  for (const [id, qty] of Object.entries(cards)) {
    if (qty <= 0) continue;
    const card = lookup(id);
    if (!card) {
      total += qty;
      issues.push({ code: 'unknown-card', message: `Carta desconhecida: "${id}".` });
      continue;
    }
    const part = deckPartOf(card);
    if (part === 'token') {
      tokens += qty;
      if (qty > DECK_RULES.copiesPerToken) {
        issues.push({ code: 'token-copies', message: `O Token "${deckName(card)}" tem ${qty} cópias (máximo de ${DECK_RULES.copiesPerToken}).` });
      }
      continue;
    }
    if (qty > DECK_RULES.copiesPerCard) {
      issues.push({
        code: 'copies',
        message: `"${deckName(card)}" (${card.set} ${card.number}) tem ${qty} cópias (máximo de ${DECK_RULES.copiesPerCard}).`,
      });
    }
    if (part === 'reinforcement') {
      reinforcement += qty;
    } else {
      total += qty;
      byType[card.type] += qty;
    }
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
  return { total, byType, reinforcement, tokens, issues, isValid: issues.length === 0 };
}
