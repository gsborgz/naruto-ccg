import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../../data/cards.ts';
import { customDeckCardId } from '../cardMaker/customIds.ts';
import type { Card } from '../../models/card.ts';
import { printOrder, printsRendered } from './printDeck.ts';

const scanned = CARDS.find((c) => c.layout)!;
const unscanned = CARDS.find((c) => !c.layout)!;
const custom: Card = { ...CARDS_BY_ID.get('fx-n-001')!, id: customDeckCardId('abc'), set: 'CUSTOM', layout: undefined };

test('design do PDF: original usa a impressa, remontado monta as escaneadas', () => {
  assert.equal(printsRendered(scanned, 'original'), false);
  assert.equal(printsRendered(scanned, 'rendered'), true);
  // Ainda sem layout: sai com a impressa mesmo no remontado.
  assert.equal(printsRendered(unscanned, 'rendered'), false);
  // Carta criada não tem impressa: sempre montada.
  assert.equal(printsRendered(custom, 'original'), true);
  assert.equal(printsRendered(custom, 'rendered'), true);
});

test('ordem de impressão inclui as cartas criadas pelo lookup', () => {
  const lookup = (id: string) => CARDS_BY_ID.get(id) ?? (id === custom.id ? custom : undefined);
  const order = printOrder({ [custom.id]: 2, 'fx-n-001': 1, 'nao-existe': 1 }, lookup);
  // Carta desconhecida fica de fora; a criada entra com a quantidade do deck.
  assert.deepEqual(new Map(order.map((e) => [e.card.id, e.qty])), new Map([['fx-n-001', 1], [custom.id, 2]]));
});
