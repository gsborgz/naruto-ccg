import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../../data/cards.ts';
import { customDeckCardId } from '../cardMaker/customIds.ts';
import type { Card } from '../../models/card.ts';
import { printOrder, printsRendered } from './printDeck.ts';

const withAlter = CARDS.find((c) => c.layout)!;
const printed = { ...withAlter, layout: undefined };
const custom: Card = { ...CARDS_BY_ID.get('fx-n-001')!, id: customDeckCardId('abc'), set: 'CUSTOM', layout: undefined };

test('design do PDF: a impressa, ou montada com a alter escolhida no deck', () => {
  assert.equal(printsRendered(printed), false);
  // Com a alter do deck (`layout` vindo de `designedCard`): montada.
  assert.equal(printsRendered(withAlter), true);
  // Carta criada não tem impressa: sempre montada.
  assert.equal(printsRendered(custom), true);
});

test('ordem de impressão inclui as cartas criadas pelo lookup', () => {
  const lookup = (id: string) => CARDS_BY_ID.get(id) ?? (id === custom.id ? custom : undefined);
  const order = printOrder({ [custom.id]: 2, 'fx-n-001': 1, 'nao-existe': 1 }, lookup);
  // Carta desconhecida fica de fora; a criada entra com a quantidade do deck.
  assert.deepEqual(new Map(order.map((e) => [e.card.id, e.qty])), new Map([['fx-n-001', 1], [custom.id, 2]]));
});
