import type { Card, CardType, ElementSymbol } from '../models/card.ts';
import type { CardTranslations } from '../models/cardTranslation.ts';
import { translateCharacteristic } from '../data/ptbr/glossary.ts';

export type SortKey = 'type' | 'name' | 'cost';

export interface CardFilterState {
  query: string;
  /** Código do set (ex.: "S01"), ou "" para todas as coleções. */
  set: string;
  types: CardType[];
  elements: ElementSymbol[];
  sort: SortKey;
}

export const INITIAL_FILTERS: CardFilterState = { query: '', set: '', types: [], elements: [], sort: 'type' };

const TYPE_ORDER: Record<CardType, number> = { ninja: 0, jutsu: 1, mission: 2, client: 3 };

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Custo usado para ordenar: Entrada para Ninja/Missão/Cliente; para Jutsu, o total de Chakra da opção
 * mais barata entre o custo principal e as alternativas ("X" conta como 0).
 */
export function sortCost(card: Card): number {
  if (card.type === 'jutsu') {
    const options = [card.cost, ...(card.cost.alternatives ?? [])];
    return Math.min(...options.map(({ symbols, generic }) => symbols.length + (generic === 'X' ? 0 : generic)));
  }
  return card.entranceCost;
}

/** Texto pesquisável já normalizado, calculado uma vez por carta (a busca roda a cada tecla). */
const haystackCache = new WeakMap<Card, string>();
function haystackOf(c: Card): string {
  let h = haystackCache.get(c);
  if (h === undefined) {
    h = normalize([c.name, ...('characteristics' in c ? c.characteristics : []), ...c.text].join(' '));
    haystackCache.set(c, h);
  }
  return h;
}

/** Com PT-BR, a busca acha a carta pelo texto em inglês ou em português. Um cache por conjunto de traduções. */
const ptHaystackCache = new WeakMap<CardTranslations, WeakMap<Card, string>>();
function ptHaystackOf(c: Card, translations: CardTranslations): string {
  let cache = ptHaystackCache.get(translations);
  if (!cache) ptHaystackCache.set(translations, (cache = new WeakMap()));
  let h = cache.get(c);
  if (h === undefined) {
    const characteristics = 'characteristics' in c ? c.characteristics.map(translateCharacteristic) : [];
    const pt = normalize([...characteristics, ...(translations[c.id]?.text ?? [])].join(' '));
    h = `${haystackOf(c)} ${pt}`;
    cache.set(c, h);
  }
  return h;
}

/** `translations`: traduções PT-BR já carregadas, quando o jogador escolheu ver as cartas em português. */
export function filterCards(cards: Card[], f: CardFilterState, translations?: CardTranslations | null): Card[] {
  const q = normalize(f.query.trim());
  const result = cards.filter((c) => {
    if (f.set && c.set !== f.set) return false;
    if (f.types.length && !f.types.includes(c.type)) return false;
    if (f.elements.length && !c.elements.some((e) => f.elements.includes(e))) return false;
    if (q && !(translations ? ptHaystackOf(c, translations) : haystackOf(c)).includes(q)) return false;
    return true;
  });

  const byName = (a: Card, b: Card) => a.name.localeCompare(b.name, 'pt-BR');
  const byCost = (a: Card, b: Card) => sortCost(a) - sortCost(b);
  const byType = (a: Card, b: Card) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type];

  return result.sort((a, b) => {
    if (f.sort === 'name') return byName(a, b);
    if (f.sort === 'cost') return byCost(a, b) || byName(a, b);
    return byType(a, b) || byCost(a, b) || byName(a, b);
  });
}
