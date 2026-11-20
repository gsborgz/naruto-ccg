import { CARD_NAMES_EN } from '../data/cards.ts';
import { isTokenCard, type Card, type CardType, type ElementSymbol } from '../models/card.ts';

export type SortKey = 'type' | 'name' | 'cost';

/** Categoria do filtro: um tipo de carta ou `token` (as cartas de Token, de qualquer tipo; `isTokenCard`). */
export type TypeFilter = CardType | 'token';

export interface CardFilterState {
  query: string;
  /** Código do set (ex.: "S01"), ou "" para todas as coleções. */
  set: string;
  /** Categorias marcadas: a carta entra se for de qualquer uma delas. */
  types: TypeFilter[];
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
    // O nome impresso (inglês) também é achado, nas cartas em que ele difere do PT-BR.
    h = normalize([c.name, CARD_NAMES_EN.get(c.id) ?? '', ...('characteristics' in c ? c.characteristics : []), ...c.text].join(' '));
    haystackCache.set(c, h);
  }
  return h;
}

/** Busca e ordena pelos textos das cartas (os do conteúdo do jogo, em PT-BR, e o nome impresso, em inglês). */
export function filterCards(cards: Card[], f: CardFilterState): Card[] {
  const q = normalize(f.query.trim());
  const result = cards.filter((c) => {
    if (f.set && c.set !== f.set) return false;
    if (f.types.length && !f.types.includes(c.type) && !(f.types.includes('token') && isTokenCard(c))) return false;
    if (f.elements.length && !c.elements.some((e) => f.elements.includes(e))) return false;
    if (q && !haystackOf(c).includes(q)) return false;
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

const SORT_KEYS: readonly SortKey[] = ['type', 'name', 'cost'];
const TYPE_FILTERS: readonly TypeFilter[] = [...(Object.keys(TYPE_ORDER) as CardType[]), 'token'];
const ELEMENTS: readonly ElementSymbol[] = ['lightning', 'fire', 'wind', 'water', 'earth', 'void'];

/**
 * Filtros na URL (`?q=naruto&set=S01&type=ninja,jutsu&element=fire&sort=name`), para sobreviverem a um
 * recarregamento e poderem ser compartilhados. Só entram os campos diferentes do padrão.
 */
export function filtersToSearchParams(f: CardFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (f.query) params.set('q', f.query);
  if (f.set) params.set('set', f.set);
  if (f.types.length) params.set('type', f.types.join(','));
  if (f.elements.length) params.set('element', f.elements.join(','));
  if (f.sort !== INITIAL_FILTERS.sort) params.set('sort', f.sort);
  return params;
}

/** Inverso de `filtersToSearchParams`; valores desconhecidos são ignorados. */
export function filtersFromSearchParams(params: { get(name: string): string | null }): CardFilterState {
  const list = <T extends string>(name: string, allowed: readonly T[]): T[] => {
    const values = (params.get(name) ?? '').split(',').filter((v): v is T => allowed.includes(v as T));
    return [...new Set(values)];
  };
  const sort = params.get('sort') as SortKey | null;
  return {
    query: params.get('q') ?? '',
    set: params.get('set') ?? '',
    types: list('type', TYPE_FILTERS),
    elements: list('element', ELEMENTS),
    sort: sort && SORT_KEYS.includes(sort) ? sort : INITIAL_FILTERS.sort,
  };
}
