import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidShareId, parseSharePayload, SHARE_LIMITS } from './deckShare.ts';

const known = (id: string) => id.startsWith('s01-');

test('compartilhamento: aceita deck e coleção válidos (nome normalizado)', () => {
  assert.deepEqual(parseSharePayload({ kind: 'deck', deck: { name: '  Konoha  ', cards: { 's01-n-001': 3 } } }, known), {
    kind: 'deck',
    deck: { name: 'Konoha', cards: { 's01-n-001': 3 } },
  });
  const col = parseSharePayload(
    { kind: 'collection', decks: [{ name: '', cards: {} }, { name: 'B', cards: { 's01-j-007': 2 }, id: 'x' }] },
    known,
  );
  assert.deepEqual(col, {
    kind: 'collection',
    decks: [
      { name: 'Deck sem nome', cards: {} },
      { name: 'B', cards: { 's01-j-007': 2 } },
    ],
  });
});

test('compartilhamento: rejeita cartas desconhecidas, quantidades inválidas e formatos errados', () => {
  assert.equal(parseSharePayload({ kind: 'deck', deck: { name: 'A', cards: { 'zz-1': 1 } } }, known), null);
  assert.equal(parseSharePayload({ kind: 'deck', deck: { name: 'A', cards: { 's01-n-001': 0 } } }, known), null);
  assert.equal(parseSharePayload({ kind: 'deck', deck: { name: 'A', cards: { 's01-n-001': 1.5 } } }, known), null);
  assert.equal(
    parseSharePayload({ kind: 'deck', deck: { name: 'A', cards: { 's01-n-001': SHARE_LIMITS.copiesPerCard + 1 } } }, known),
    null,
  );
  assert.equal(parseSharePayload({ kind: 'collection', decks: [] }, known), null);
  assert.equal(parseSharePayload({ kind: 'other' }, known), null);
  assert.equal(parseSharePayload(null, known), null);
});

test('compartilhamento: formato do código', () => {
  assert.ok(isValidShareId('3f2b8c1e-9a4d-4e7f-8b2a-1c0d9e8f7a6b'));
  assert.ok(!isValidShareId('3f2b8c1e'));
  assert.ok(!isValidShareId('../etc/passwd'));
});
