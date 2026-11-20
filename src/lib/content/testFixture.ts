import type { Card, ClientCard, JutsuCard, MissionCard, NinjaCard } from '../../models/card.ts';
import type { CardLayoutInfo } from '../../models/cardLayout.ts';

/**
 * Cartas inventadas para os testes (no lugar do catálogo de verdade, que fica no Redis e muda pelo site). Os testes
 * conferem as regras e as conversões, não os dados de cada carta impressa.
 *
 * - `fx-n-001` a `fx-n-060`: Ninjas (S01 até o 30, S02 depois); 001, 019 e 025 têm o mesmo nome; os ímpares têm
 *   `layout` (carta montada, com a impressa de fundo).
 * - `fx-j-001` a `fx-j-040`: Jutsus; `fx-m-001` a `fx-m-030`: Missões; `fx-c-001` a `fx-c-006`: Clientes.
 * - `fx-q-001` a `fx-q-006`: Esquadrões; `fx-r-001`: Ninja "Reforço" (os dois vão para o Baralho de Reforço).
 */

const pad = (n: number) => String(n).padStart(3, '0');

const scanned = (layout = 'layout-01'): CardLayoutInfo => ({
  layout,
  icons: { type: 'default', elements: ['01'], entrance: 'entrance-01', hand: 'hand-01', attribute: '01' },
  art: { back: { x: 1, y: -2, zoom: 1.05, print: true } },
});

export function fixtureNinja(n: number, extra: Partial<NinjaCard> = {}): NinjaCard {
  const id = `fx-n-${pad(n)}`;
  return {
    id,
    name: [1, 19, 25].includes(n) ? 'Naruto Uzumaki' : `Ninja ${pad(n)}`,
    type: 'ninja',
    elements: ['lightning'],
    number: pad(n),
    set: n <= 30 ? 'S01' : 'S02',
    text: n % 3 === 0 ? ['[CLONES]', 'Válido: compre 1 card.'] : [],
    flavor: n % 2 ? '"Eu não volto atrás na minha palavra!"' : undefined,
    image: id,
    entranceCost: n % 5,
    handCost: n % 3,
    characteristics: ['Folha', 'Genin', 'Masculino'],
    healthy: { combat: 4, support: 2 },
    injured: { combat: 2, support: 1 },
    attributes: ['Ninjutsu'],
    ...(n % 2 === 1 && { layout: scanned() }),
    ...extra,
  };
}

function jutsu(n: number): JutsuCard {
  const id = `fx-j-${pad(n)}`;
  return {
    id,
    name: n === 7 ? 'Sharingan Eye' : `Jutsu ${pad(n)}`,
    type: 'jutsu',
    elements: ['fire'],
    number: pad(n),
    set: 'S01',
    text: ['Efeito: o Ninja ganha +2/+0.'],
    image: id,
    cost: { symbols: ['fire'], generic: n % 3 },
  };
}

function mission(n: number): MissionCard {
  const id = `fx-m-${pad(n)}`;
  return {
    id,
    name: `Missão ${pad(n)}`,
    type: 'mission',
    elements: ['water'],
    number: pad(n),
    set: 'S01',
    text: n === 1 ? ['Permanente (3)', 'Efeito: compre 1 card.'] : ['Efeito: compre 1 card.'],
    image: id,
    entranceCost: 1,
    handCost: 1,
  };
}

function client(n: number): ClientCard {
  const id = `fx-c-${pad(n)}`;
  return {
    id,
    name: `Cliente ${pad(n)}`,
    type: 'client',
    elements: ['earth'],
    number: pad(n),
    set: 'S02',
    text: [],
    image: id,
    entranceCost: 2,
    handCost: 1,
    characteristics: ['Masculino'],
  };
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const FIXTURE_CARDS: Card[] = [
  ...range(1, 60).map((n) => fixtureNinja(n)),
  ...range(1, 40).map(jutsu),
  ...range(1, 30).map(mission),
  ...range(1, 6).map(client),
  ...range(1, 6).map((n) => ({ ...fixtureNinja(100 + n), id: `fx-q-${pad(n)}`, image: `fx-q-${pad(n)}`, name: `Time ${n}`, characteristics: ['Folha', 'Esquadrão'] })),
  { ...fixtureNinja(200), id: 'fx-r-001', image: 'fx-r-001', name: 'Hidan (Modo Maldição)', characteristics: ['Akatsuki', 'Reforço'] },
];
