import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterCards, filtersFromSearchParams, filtersToSearchParams, INITIAL_FILTERS, type CardFilterState } from './cardFilters.ts';
import type { Card } from '../models/card.ts';
import { CARD_NAMES_EN } from '../data/cards.ts';

test('filtros padrão geram uma URL vazia e voltam iguais', () => {
  assert.equal(filtersToSearchParams(INITIAL_FILTERS).toString(), '');
  assert.deepEqual(filtersFromSearchParams(new URLSearchParams()), INITIAL_FILTERS);
});

test('filtros vão para a URL e voltam iguais', () => {
  const f: CardFilterState = { query: 'Naruto & Sasuke', set: 'S01', types: ['ninja', 'jutsu'], elements: ['fire'], sort: 'name' };
  const params = filtersToSearchParams(f);
  assert.equal(params.get('type'), 'ninja,jutsu');
  assert.deepEqual(filtersFromSearchParams(new URLSearchParams(params.toString())), f);
});

test('valores desconhecidos na URL são ignorados', () => {
  const f = filtersFromSearchParams(new URLSearchParams('type=ninja,dragon,ninja&element=ice&sort=power'));
  assert.deepEqual(f.types, ['ninja']);
  assert.deepEqual(f.elements, []);
  assert.equal(f.sort, INITIAL_FILTERS.sort);
});

test('filtro Token: cartas de Token de qualquer tipo, somando com os tipos marcados', () => {
  const base = { elements: [], number: '', set: 'S01', text: [], image: '' };
  const ninja = { ...base, id: 'a', name: 'A', type: 'mission', entranceCost: 0, handCost: 0 } as Card;
  const token = { ...base, id: 'b', name: 'B', type: 'mission', entranceCost: 0, handCost: 0, token: true } as Card;
  const jutsu = { ...base, id: 'c', name: 'C', type: 'jutsu', cost: { symbols: [], generic: 0 } } as Card;
  const cards = [ninja, token, jutsu];
  const ids = (types: CardFilterState['types']) => filterCards(cards, { ...INITIAL_FILTERS, types }).map((c) => c.id).sort();
  assert.deepEqual(ids(['token']), ['b']);
  assert.deepEqual(ids(['token', 'jutsu']), ['b', 'c']);
  assert.deepEqual(filtersFromSearchParams(new URLSearchParams('type=token')).types, ['token']);
});

test('a busca acha a carta pelo nome impresso (inglês) também', () => {
  const card = { id: 'fx-x', name: 'Esfera Espiralada', type: 'jutsu', elements: [], number: '', set: 'S01', text: [], image: '', cost: { symbols: [], generic: 0 } } as Card;
  (CARD_NAMES_EN as Map<string, string>).set('fx-x', 'Spiral Sphere');
  try {
    assert.equal(filterCards([card], { ...INITIAL_FILTERS, query: 'spiral' }).length, 1);
    assert.equal(filterCards([card], { ...INITIAL_FILTERS, query: 'esfera' }).length, 1);
  } finally {
    (CARD_NAMES_EN as Map<string, string>).delete('fx-x');
  }
});
