import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtersFromSearchParams, filtersToSearchParams, INITIAL_FILTERS, type CardFilterState } from './cardFilters.ts';

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
