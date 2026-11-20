import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../data/cards.ts';
import { deckNameKey, getInPlayNames, type NinjaCard } from '../models/card.ts';
import { fixtureNinja } from './content/testFixture.ts';
import { cannotAddReason, DECK_RULES, deckPartOf, summarizeDeck, type DeckCards } from './deckRules.ts';

// Cartas inventadas (src/lib/content/testFixture.ts), não as impressas.
const lookup = (id: string) => CARDS_BY_ID.get(id);
const ninja = (id: string, name: string, characteristics: string[]): NinjaCard => ({ ...fixtureNinja(900), id, name, image: id, characteristics });
const sageNaruto = ninja('t-sage', 'Naruto Uzumaki (Modo Sábio)', ['Folha', 'Nome: Naruto Uzumaki']);
const yukie = ninja('t-yukie', 'Yukie Fujikaze', ['Name: Koyuki Kazahana']);

/** Deck válido de 50: 21 Ninjas (7 × 3), 15 Jutsus (5 × 3), 14 Missões (4 × 3 + 2). */
const VALID: DeckCards = {
  'fx-n-002': 3, 'fx-n-003': 3, 'fx-n-004': 3, 'fx-n-005': 3, 'fx-n-006': 3, 'fx-n-007': 3, 'fx-n-008': 3,
  'fx-j-001': 3, 'fx-j-002': 3, 'fx-j-003': 3, 'fx-j-004': 3, 'fx-j-005': 3,
  'fx-m-001': 3, 'fx-m-002': 3, 'fx-m-003': 3, 'fx-m-004': 3, 'fx-m-005': 2,
};

test('nome na montagem: nome completo, com parênteses; maiúsculas e espaços não contam', () => {
  // Rulebook PT-BR p. 43: "Gaara of the Desert" e "Gaara of the Desert (Possessed Mode)" são nomes diferentes.
  assert.notEqual(deckNameKey(sageNaruto), deckNameKey(lookup('fx-n-001')!));
  assert.equal(deckNameKey(ninja('a', 'Sharingan  eye', [])), deckNameKey(lookup('fx-j-007')!));
});

test('"Nome: X" (e "Name: X" das cartas criadas) vale só em jogo (regra da Vila)', () => {
  assert.deepEqual(getInPlayNames(yukie), ['Yukie Fujikaze', 'Koyuki Kazahana']);
  assert.deepEqual(getInPlayNames(sageNaruto), ['Naruto Uzumaki (Modo Sábio)', 'Naruto Uzumaki']);
});

test('limite de 3 cópias conta a carta (id), não o nome', () => {
  // fx-n-001, fx-n-019 e fx-n-025 são todas "Naruto Uzumaki", mas cartas diferentes.
  assert.equal(cannotAddReason({ 'fx-n-001': 3, 'fx-n-019': 3 }, lookup('fx-n-025')!, lookup), null);
  const s = summarizeDeck({ 'fx-n-001': 30, 'fx-j-007': 20 }, lookup);
  assert.equal(s.total, 50);
  assert.deepEqual(s.issues.map((i) => i.code), ['copies', 'copies']);
});

test('deck vazio é inválido por tamanho', () => {
  const s = summarizeDeck({}, lookup);
  assert.equal(s.total, 0);
  assert.equal(s.isValid, false);
  assert.deepEqual(s.issues.map((i) => i.code), ['size']);
});

test('deck de 50 cartas respeitando as regras é válido; com 40 (regra antiga), não', () => {
  const s = summarizeDeck(VALID, lookup);
  assert.equal(DECK_RULES.size, 50);
  assert.equal(s.total, 50);
  assert.equal(s.byType.ninja, 21);
  assert.equal(s.isValid, true, JSON.stringify(s.issues));
  assert.ok(summarizeDeck({ 'fx-n-002': 3, 'fx-j-001': 3, 'fx-m-001': 3 }, lookup).issues.some((i) => i.code === 'size'));
});

test('sem limite de Ninjas: deck só de Ninjas é válido', () => {
  const deck: DeckCards = {};
  let n = 0;
  for (const c of CARDS) {
    if (c.type !== 'ninja' || deckPartOf(c) !== 'main' || n >= DECK_RULES.size) continue;
    const qty = Math.min(3, DECK_RULES.size - n);
    deck[c.id] = qty;
    n += qty;
  }
  assert.equal(n, DECK_RULES.size);
  const s = summarizeDeck(deck, lookup);
  assert.equal(s.byType.ninja, DECK_RULES.size);
  assert.equal(s.isValid, true, JSON.stringify(s.issues));
});

test(`não deixa passar de ${DECK_RULES.size}`, () => {
  const deck: DeckCards = {};
  let n = 0;
  for (const c of CARDS) {
    if (c.type === 'ninja' || n >= DECK_RULES.size - 1) continue;
    const qty = Math.min(3, DECK_RULES.size - 1 - n);
    deck[c.id] = qty;
    n += qty;
  }
  deck['fx-n-001'] = 1;
  assert.equal(summarizeDeck(deck, lookup).total, DECK_RULES.size);
  assert.match(cannotAddReason(deck, lookup('fx-n-002')!, lookup) ?? '', new RegExp(`${DECK_RULES.size} cartas`));
});

test('filtro por coleção', async () => {
  const { filterCards, INITIAL_FILTERS } = await import('./cardFilters.ts');
  const s01 = filterCards(CARDS, { ...INITIAL_FILTERS, set: 'S01' });
  assert.ok(s01.length > 0);
  assert.ok(s01.every((c) => c.set === 'S01'));
  assert.equal(filterCards(CARDS, INITIAL_FILTERS).length, CARDS.length);
  assert.deepEqual(
    filterCards(CARDS, { ...INITIAL_FILTERS, set: 'S02', types: ['client'] }).map((c) => c.type),
    CARDS.filter((c) => c.set === 'S02' && c.type === 'client').map(() => 'client'),
  );
});

test('Baralho de Reforço: Esquadrões e Ninjas "Reforço" ficam fora do Deck (PT-BR e como impresso)', () => {
  assert.equal(deckPartOf(lookup('fx-q-001')!), 'reinforcement');
  assert.equal(deckPartOf(lookup('fx-r-001')!), 'reinforcement');
  assert.equal(deckPartOf(ninja('t-squad', 'Team 7', ['Squad'])), 'reinforcement');
  assert.equal(deckPartOf(ninja('t-reinf', 'Hidan', ['Reinforcement'])), 'reinforcement');
  assert.equal(deckPartOf(lookup('fx-n-001')!), 'main');

  // As cartas do Reforço não contam nas 50.
  const s = summarizeDeck({ ...VALID, 'fx-q-001': 3, 'fx-r-001': 2 }, lookup);
  assert.equal(s.total, 50);
  assert.equal(s.reinforcement, 5);
  assert.equal(s.byType.ninja, 21);
  assert.equal(s.isValid, true, JSON.stringify(s.issues));
  // Com o Deck cheio, ainda dá para adicionar ao Reforço.
  assert.match(cannotAddReason(VALID, lookup('fx-n-001')!, lookup) ?? '', /50 cartas/);
  assert.equal(cannotAddReason(VALID, lookup('fx-q-001')!, lookup), null);
});

test('Baralho de Reforço: até 15 cartas', () => {
  const fifteen: DeckCards = { 'fx-q-001': 3, 'fx-q-002': 3, 'fx-q-003': 3, 'fx-q-004': 3, 'fx-q-005': 3 };
  assert.match(cannotAddReason(fifteen, lookup('fx-q-006')!, lookup) ?? '', /Baralho de Reforço já tem 15/);
  const sixteen = summarizeDeck({ ...fifteen, 'fx-q-006': 1 }, lookup);
  assert.equal(sixteen.reinforcement, 16);
  assert.ok(sixteen.issues.some((i) => i.code === 'reinforcement-size'));
});

test('limite de 3 cópias de cada carta', () => {
  assert.match(cannotAddReason({ 'fx-n-001': 3 }, lookup('fx-n-001')!, lookup) ?? '', /3 cópias/);
  assert.equal(cannotAddReason({ 'fx-n-001': 2 }, lookup('fx-n-001')!, lookup), null);
  assert.ok(summarizeDeck({ 'fx-n-001': 4 }, lookup).issues.some((i) => i.code === 'copies'));
});

test('Tokens: fora das 50, quantos quiser, 1 cópia de cada', () => {
  const token = (id: string): NinjaCard => ({ ...ninja(id, `Token ${id}`, []), token: true });
  const tokens = new Map(['t-1', 't-2', 't-3', 't-4'].map((id) => [id, token(id)]));
  const look = (id: string) => tokens.get(id) ?? lookup(id);
  assert.equal(deckPartOf(tokens.get('t-1')!), 'token');

  const cards: DeckCards = { 't-1': 1, 't-2': 1, 't-3': 1, 't-4': 1 };
  const s = summarizeDeck(cards, look);
  assert.equal(s.tokens, 4);
  assert.equal(s.total, 0);
  assert.equal(s.reinforcement, 0);
  assert.ok(!s.issues.some((i) => i.code === 'token-copies'));
  assert.match(cannotAddReason(cards, tokens.get('t-1')!, look) ?? '', /Token/);
  assert.ok(summarizeDeck({ 't-1': 2 }, look).issues.some((i) => i.code === 'token-copies'));
  // Com o Deck cheio, ainda dá para adicionar Tokens.
  assert.equal(cannotAddReason(VALID, tokens.get('t-1')!, look), null);
});
