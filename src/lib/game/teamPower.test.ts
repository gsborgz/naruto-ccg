import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTeamPower, teamPower, type PowerLookup } from './teamPower.ts';

const POWERS: Record<string, { healthy: { combat: number | 'X'; support: number | 'X' }; injured: { combat: number | 'X'; support: number | 'X' } }> = {
  lider: { healthy: { combat: 3, support: 1 }, injured: { combat: 1, support: 0 } },
  apoio1: { healthy: { combat: 0, support: 1 }, injured: { combat: 0, support: 0 } },
  apoio2: { healthy: { combat: 2, support: 1 }, injured: { combat: 1, support: 1 } },
  xis: { healthy: { combat: 'X', support: 0 }, injured: { combat: 'X', support: 0 } },
};
const lookup: PowerLookup = (id) => POWERS[id];

test('Poder do Time: Combate do Líder + Suporte dos Apoios (não Combate + Combate)', () => {
  const group = [
    { uid: '1', cardId: 'lider' },
    { uid: '2', cardId: 'apoio1' },
    { uid: '3', cardId: 'apoio2' },
  ];
  assert.deepEqual(teamPower(group, lookup), { value: 5, hasX: false, parts: [3, 1, 1] });
});

test('Poder do Time: Ninja sozinho = o Combate dele; Ferido usa os valores de Ferido', () => {
  assert.equal(teamPower([{ uid: '1', cardId: 'lider' }], lookup)?.value, 3);
  const group = [
    { uid: '1', cardId: 'lider', injured: true as const },
    { uid: '2', cardId: 'apoio1', injured: true as const },
    { uid: '3', cardId: 'apoio2' },
  ];
  assert.deepEqual(teamPower(group, lookup)?.parts, [1, 0, 1]);
  assert.equal(teamPower(group, lookup)?.value, 2);
});

test('Poder do Time: X e cartas que não são Ninja', () => {
  const x = teamPower([{ uid: '1', cardId: 'xis' }, { uid: '2', cardId: 'apoio2' }], lookup)!;
  assert.equal(formatTeamPower(x), '1+X');
  assert.equal(formatTeamPower(teamPower([{ uid: '1', cardId: 'xis' }], lookup)!), 'X');
  assert.equal(teamPower([{ uid: '1', cardId: 'cliente' }], lookup), null);
});
