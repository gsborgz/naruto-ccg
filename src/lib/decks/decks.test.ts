import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS_BY_ID } from '../../data/cards.ts';
import { catalogDraft, designLayout, versionOf, withoutLayout } from '../cardMaker/catalogEdit.ts';
import { designedCard } from '../deckDesigns.ts';
import { parseSharedDeck } from '../deckShare.ts';
import { ORIGINAL_DESIGN, parseDeck } from './types.ts';

const UUID = '7a1c9d2e-0000-4000-8000-000000000001';

test('deck na nuvem: confere o formato e guarda os designs escolhidos', () => {
  const deck = parseDeck({
    id: UUID.toUpperCase(),
    name: '  Meu deck  ',
    cards: { 'fx-n-001': 3, 'custom-abc': 1 },
    designs: { 'fx-n-001': ORIGINAL_DESIGN, 'fx-j-001': 'versao-1' },
    createdAt: '2026-01-01',
    updatedAt: '2026-01-02',
    extra: true,
  });
  assert.ok(deck);
  assert.equal(deck.id, UUID);
  assert.equal(deck.name, 'Meu deck');
  assert.deepEqual(deck.designs, { 'fx-n-001': ORIGINAL_DESIGN, 'fx-j-001': 'versao-1' });
  assert.ok(!('extra' in deck));
  const bad = (change: Record<string, unknown>) => parseDeck({ id: UUID, name: 'x', cards: {}, ...change }) === null;
  assert.ok(bad({ id: 'não-é-uuid' }));
  assert.ok(bad({ cards: { 'fx-n-001': 0 } }));
  assert.ok(bad({ cards: { 'fx-n-001': 1.5 } }));
  assert.ok(bad({ designs: { 'fx-n-001': 'com espaço' } }));
  assert.ok(bad({ designs: ['x'] }));
  // Sem designs: o campo não aparece.
  assert.ok(!('designs' in parseDeck({ id: UUID, name: 'x', cards: {} })!));
});

test('compartilhamento leva os designs escolhidos', () => {
  const shared = parseSharedDeck({ name: 'D', cards: { 'fx-n-001': 2 }, designs: { 'fx-n-001': 'v1' } }, (id) => CARDS_BY_ID.has(id));
  assert.deepEqual(shared?.designs, { 'fx-n-001': 'v1' });
  assert.equal(parseSharedDeck({ name: 'D', cards: {}, designs: 5 }, () => true), null);
});

test('design no deck: a impressa ou a alter escolhida', () => {
  const card = withoutLayout(CARDS_BY_ID.get('fx-n-001')!);
  const version = { ...versionOf(card, catalogDraft(card, 'layout-02')), id: 'v1', nameSize: -2 };
  const versions = (id: string) => (id === 'v1' ? version : undefined);
  // Sem escolha (ou `original`, de decks antigos): a impressa.
  assert.equal(designedCard(card, undefined, versions), card);
  assert.equal(designedCard(card, ORIGINAL_DESIGN, versions), card);
  const chosen = designedCard(card, 'v1', versions);
  assert.equal(chosen.design, 'v1');
  assert.equal(chosen.layout?.layout, 'layout-02');
  assert.equal(chosen.layout?.nameSize, -2);
  assert.equal(chosen.name, card.name, 'os dados ficam os da carta');
  // Alter que não existe mais: a impressa.
  assert.equal(designedCard(card, 'sumiu', versions), card);
});

test('versão da aba Editar: o texto com marcação vale quando diz o mesmo que a carta', () => {
  const card = CARDS_BY_ID.get('fx-m-002')!;
  assert.ok(card.text.length > 0);
  const draft = catalogDraft(withoutLayout(card), 'layout-02');
  // Negrito em tudo: o texto puro é o mesmo da carta.
  const marked = { ...draft, text: card.text.map((t) => `[${t}]`).join('\n') };
  assert.equal(designLayout(card, marked).textMarkup, marked.text);
  // Outro texto (arte alternativa de um jogador): a carta fica com o texto dela.
  assert.equal(designLayout(card, { ...draft, text: 'Outro efeito' }).textMarkup, undefined);
});
