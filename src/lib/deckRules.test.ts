import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CARDS, CARDS_BY_ID } from '../data/cards.ts';
import { deckNameKey, getInPlayNames, type Card, type NinjaCard } from '../models/card.ts';
import { cannotAddReason, DECK_RULES, summarizeDeck, type DeckCards } from './deckRules.ts';

const lookup = (id: string) => CARDS_BY_ID.get(id);

// Jutsus com custo impresso "0" (conferido na imagem); qualquer outro custo zerado é esquecimento.
const ZERO_COST_JUTSU = new Set(['s04-j-141', 's08-j-235', 's11-j-350', 's14-j-510', 's14-j-512', 's14-j-515', 's14-j-533', 's14-j-534', 's16-j-619', 's21-j-814', 's24-j-917']);

test('catálogo: ids únicos, imagem = id e custo de Jutsu preenchido', () => {
  const ids = new Set(CARDS.map((c) => c.id));
  assert.equal(ids.size, CARDS.length);
  for (const c of CARDS) {
    assert.equal(c.image, c.id);
    if (c.type !== 'jutsu') continue;
    if (!ZERO_COST_JUTSU.has(c.id)) assert.ok(c.cost.symbols.length > 0 || c.cost.generic !== 0, `${c.id} sem custo`);
    for (const opt of [c.cost, ...(c.cost.alternatives ?? [])]) {
      if (opt.xCount !== undefined) assert.ok(opt.generic === 'X' && opt.xCount >= 2, `${c.id} xCount inválido`);
    }
    for (const alt of c.cost.alternatives ?? [])
      assert.ok(alt.symbols.length > 0 || alt.generic !== 0, `${c.id} alternativa de custo vazia`);
  }
});

// As imagens originais não vão para o Git (.gitignore): num clone sem a pasta cards/, o teste é pulado.
test('catálogo: toda carta tem imagem em cards/<set>/<id>.png', { skip: !existsSync('cards') && 'pasta cards/ ausente' }, () => {
  const missing = CARDS.filter((c) => !existsSync(`cards/${c.set.toLowerCase()}/${c.image}.png`)).map((c) => c.id);
  assert.deepEqual(missing, []);
});

// Cartas de exemplo com "Name: X" (nenhuma carta importada até agora usa essa característica).
const ninja = (id: string, name: string, characteristics: string[]): NinjaCard => ({
  id,
  name,
  type: 'ninja',
  elements: ['lightning'],
  number: '000',
  set: 'TEST',
  text: [],
  image: id,
  entranceCost: 0,
  handCost: 0,
  characteristics,
  healthy: { combat: 1, support: 1 },
  injured: { combat: 0, support: 0 },
  attributes: ['Ninjutsu'],
});
const sageNaruto = ninja('t-sage', 'Naruto Uzumaki (Sage Mode)', ['Leaf', 'Name: Naruto Uzumaki']);
const yukie = ninja('t-yukie', 'Yukie Fujikaze', ['Name: Koyuki Kazahana']);
const koyuki = ninja('t-koyuki', 'Koyuki Kazahana', []);
const fixtures = new Map<string, Card>([sageNaruto, yukie, koyuki].map((c) => [c.id, c]));
const lookupWithFixtures = (id: string) => fixtures.get(id) ?? lookup(id);

test('nome na montagem: nome impresso completo, com parênteses', () => {
  // Rulebook PT-BR p. 43: "Shukaku (Gaara of the Desert)", "Gaara of the Desert" e
  // "Gaara of the Desert (Possessed Mode)" são 3 nomes diferentes.
  assert.notEqual(deckNameKey(sageNaruto), deckNameKey(lookup('s01-n-001')!));
  // Diferenças só de maiúsculas/espaços contam como o mesmo nome.
  assert.equal(deckNameKey(ninja('a', 'Sharingan  eye', [])), deckNameKey(lookup('s01-j-007')!));
});

test('"Name: X" não conta na montagem do deck', () => {
  // Rulebook PT-BR p. 44, (B)-2: 3× Yukie Fujikaze (Name: Koyuki Kazahana) + 3× Koyuki Kazahana é válido.
  assert.equal(cannotAddReason({ 't-yukie': 3 }, koyuki, lookupWithFixtures), null);
  assert.equal(cannotAddReason({ 's01-n-001': 3 }, sageNaruto, lookupWithFixtures), null);
  const s = summarizeDeck({ 't-yukie': 3, 't-koyuki': 3 }, lookupWithFixtures);
  assert.ok(!s.issues.some((i) => i.code === 'copies'));
  // Em jogo, porém, a carta tem os dois nomes (regra da Vila).
  assert.deepEqual(getInPlayNames(yukie), ['Yukie Fujikaze', 'Koyuki Kazahana']);
});

test('cartas diferentes com o mesmo nome impresso contam juntas no limite de 3', () => {
  const s = summarizeDeck({ 's01-n-001': 2, 's01-n-025': 2 }, lookup);
  assert.ok(s.issues.some((i) => i.code === 'copies' && i.message.includes('"Naruto Uzumaki"')));
  assert.notEqual(cannotAddReason({ 's01-n-001': 2, 's01-n-019': 1 }, lookup('s01-n-025')!, lookup), null);
  assert.equal(cannotAddReason({ 's01-n-001': 2 }, lookup('s01-n-025')!, lookup), null);
  // Entre coleções também: "Sharingan Eye" do S01 e do S02.
  assert.notEqual(cannotAddReason({ 's01-j-007': 2, 's02-j-048': 1 }, lookup('s02-j-063')!, lookup), null);
});

test('carta que imprime "as many copies ... as you want" não tem limite de cópias', () => {
  // S26 N-1551 Samurai Warrior.
  const samurai = lookup('s26-n-1551')!;
  assert.equal(cannotAddReason({ 's26-n-1551': 10 }, samurai, lookup), null);
  assert.ok(!summarizeDeck({ 's26-n-1551': 10 }, lookup).issues.some((i) => i.code === 'copies'));
  // As outras cartas continuam limitadas a 3.
  assert.notEqual(cannotAddReason({ 's26-n-1552': 3 }, lookup('s26-n-1552')!, lookup), null);
});

test('deck vazio é inválido por tamanho', () => {
  const s = summarizeDeck({}, lookup);
  assert.equal(s.total, 0);
  assert.equal(s.isValid, false);
  assert.deepEqual(
    s.issues.map((i) => i.code),
    ['size'],
  );
});

test('deck de 50 cartas respeitando as regras é válido', () => {
  // 21 ninjas (7 nomes × 3), 15 jutsus (5 × 3), 14 missões (4 × 3 + 2)
  const deck: DeckCards = {
    's01-n-004': 3,
    's01-n-005': 3,
    's01-n-006': 3,
    's01-n-009': 3,
    's01-n-010': 3,
    's01-n-012': 3,
    's01-n-029': 3,
    's01-j-001': 3,
    's01-j-002': 3,
    's01-j-015': 3,
    's01-j-016': 3,
    's01-j-020': 3,
    's01-m-001': 3,
    's01-m-006': 3,
    's01-m-011': 3,
    's01-m-019': 3,
    's01-m-020': 2,
  };
  const s = summarizeDeck(deck, lookup);
  assert.equal(DECK_RULES.size, 50);
  assert.equal(s.total, 50);
  assert.equal(s.byType.ninja, 21);
  assert.equal(s.isValid, true, JSON.stringify(s.issues));
});

test('deck com 40 cartas (regra antiga) é inválido', () => {
  const s = summarizeDeck({ 's01-n-004': 3, 's01-j-001': 3, 's01-m-001': 3 }, lookup);
  assert.ok(s.issues.some((i) => i.code === 'size'));
});

test('sem limite de Ninjas: deck só de Ninjas é válido', () => {
  // Um Ninja por nome (até 3 cópias), até completar 50.
  const seen = new Set<string>();
  const deck: DeckCards = {};
  let n = 0;
  for (const c of CARDS) {
    if (c.type !== 'ninja' || n >= DECK_RULES.size) continue;
    if (seen.has(deckNameKey(c))) continue;
    seen.add(deckNameKey(c));
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
  // Enche com Jutsus/Missões (até 3 de cada) até faltar 1, e completa com 1 Ninja.
  const deck: DeckCards = {};
  let n = 0;
  for (const c of CARDS) {
    if (c.type === 'ninja' || n >= DECK_RULES.size - 1) continue;
    const qty = Math.min(3, DECK_RULES.size - 1 - n);
    deck[c.id] = qty;
    n += qty;
  }
  deck['s01-n-001'] = 1;
  assert.equal(summarizeDeck(deck, lookup).total, DECK_RULES.size);
  assert.match(cannotAddReason(deck, lookup('s01-n-002')!, lookup) ?? '', new RegExp(`${DECK_RULES.size} cartas`));
});

test('filtro por coleção', async () => {
  const { filterCards, INITIAL_FILTERS } = await import('./cardFilters.ts');
  const s01 = filterCards(CARDS, { ...INITIAL_FILTERS, set: 'S01' });
  assert.ok(s01.length > 0);
  assert.ok(s01.every((c) => c.set === 'S01'));
  assert.equal(filterCards(CARDS, INITIAL_FILTERS).length, CARDS.length);
  const s02Clients = filterCards(CARDS, { ...INITIAL_FILTERS, set: 'S02', types: ['client'] });
  assert.equal(s02Clients.length, 6);
});
