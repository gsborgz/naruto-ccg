import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indexDeck, cannotAddReasonIn, summarizeDeck } from '../deckRules.ts';
import { CARDS_BY_ID } from '../../data/cards.ts';
import { customDeckCardId, customSourceId, hasCustomCards, isCustomCardId } from './customIds.ts';
import { customCardToCard, UNNAMED_CARD } from './deckCard.ts';
import { newCustomCard, type CustomCard } from './model.ts';

const NOW = '2026-01-01T00:00:00.000Z';

function card(changes: Partial<CustomCard>): CustomCard {
  return { ...newCustomCard(changes.type ?? 'ninja', NOW), ...changes };
}

test('ids das cartas criadas no deck', () => {
  const id = customDeckCardId('abc');
  assert.equal(id, 'custom-abc');
  assert.ok(isCustomCardId(id));
  assert.equal(customSourceId(id), 'abc');
  assert.ok(!isCustomCardId('s01-n-001'));
  assert.ok(hasCustomCards({ 's01-n-001': 3, [id]: 1 }));
  assert.ok(!hasCustomCards({ 's01-n-001': 3, [id]: 0 }));
});

test('Ninja criado vira carta do catálogo', () => {
  const c = customCardToCard(
    card({
      id: 'n1',
      name: '  Naruto   Uzumaki ',
      elements: [
        { element: 'wind', variant: '01' },
        { element: 'wind', variant: '02' },
      ],
      entranceCost: '3',
      handCost: 'X',
      healthy: '7/2',
      injured: 'X/0',
      characteristics: ['Leaf', ' Squad ', ''],
      attribute: { frame: '01', label: 'Genjutsu/Tree' },
      text: '[Effect:] Draw 1 card.\n\n[[RASENGAN]] \\(3\\)',
      flavor: ' Believe it! ',
    }),
  );
  assert.equal(c.id, 'custom-n1');
  assert.equal(c.set, 'CUSTOM');
  assert.equal(c.name, 'Naruto Uzumaki');
  assert.deepEqual(c.elements, ['wind']);
  assert.equal(c.flavor, 'Believe it!');
  assert.deepEqual(c.text, ['Effect: Draw 1 card.', '[RASENGAN] (3)']);
  assert.equal(c.type, 'ninja');
  if (c.type !== 'ninja') return;
  assert.equal(c.entranceCost, 3);
  assert.equal(c.handCost, -1);
  assert.deepEqual(c.healthy, { combat: 7, support: 2 });
  assert.deepEqual(c.injured, { combat: 'X', support: 0 });
  assert.deepEqual(c.characteristics, ['Leaf', 'Squad']);
  assert.deepEqual(c.attributes, ['Genjutsu', 'Tree']);
});

test('Jutsu criado: custo, alternativas e sem nome', () => {
  const c = customCardToCard(
    card({
      type: 'jutsu',
      name: ' ',
      jutsuCost: { symbols: ['earth'], generic: '1', alternatives: [{ symbols: [], generic: 'X' }] },
    }),
  );
  assert.equal(c.name, UNNAMED_CARD);
  assert.equal(c.type, 'jutsu');
  if (c.type !== 'jutsu') return;
  assert.deepEqual(c.cost, { symbols: ['earth'], generic: 1, alternatives: [{ symbols: [], generic: 'X' }] });
  assert.ok(!('characteristics' in c));
});

test('cartas criadas seguem as regras de montagem', () => {
  const squad = customCardToCard(card({ id: 's', name: 'Team 7', characteristics: ['Squad'] }));
  const ninja = customCardToCard(card({ id: 'n', name: 'Naruto Uzumaki' }));
  const lookup = (id: string) => CARDS_BY_ID.get(id) ?? [squad, ninja].find((c) => c.id === id);

  // Squad vai para o Baralho de Reforço.
  const summary = summarizeDeck({ [squad.id]: 1 }, lookup);
  assert.equal(summary.reinforcement, 1);
  assert.equal(summary.total, 0);

  // Deck cheio (50): não entra mais nenhuma carta do Deck; sem limite de cópias por nome.
  assert.equal(cannotAddReasonIn(indexDeck({ 's01-n-001': 3, [ninja.id]: 5 }, lookup), ninja), null);
  assert.notEqual(cannotAddReasonIn(indexDeck({ [ninja.id]: 50 }, lookup), ninja), null);
});
