import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CARDS, CARDS_BY_ID } from '../data/cards.ts';
import { deckNameKey, getInPlayNames, type NinjaCard } from '../models/card.ts';
import { cannotAddReason, DECK_RULES, summarizeDeck, type DeckCards } from './deckRules.ts';

const lookup = (id: string) => CARDS_BY_ID.get(id);

// Jutsus com custo impresso "0" (conferido na imagem); qualquer outro custo zerado é esquecimento.
const ZERO_COST_JUTSU = new Set(['s04-j-141', 's08-j-235', 's11-j-350', 's14-j-510', 's14-j-512', 's14-j-515', 's14-j-533', 's14-j-534', 's16-j-619', 's21-j-814', 's24-j-917', 'tp3-j-838']);

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

test('nome na montagem: nome impresso completo, com parênteses', () => {
  // Rulebook PT-BR p. 43: "Shukaku (Gaara of the Desert)", "Gaara of the Desert" e
  // "Gaara of the Desert (Possessed Mode)" são 3 nomes diferentes.
  assert.notEqual(deckNameKey(sageNaruto), deckNameKey(lookup('s01-n-001')!));
  // Diferenças só de maiúsculas/espaços contam como o mesmo nome.
  assert.equal(deckNameKey(ninja('a', 'Sharingan  eye', [])), deckNameKey(lookup('s01-j-007')!));
});

test('"Name: X" vale só em jogo (regra da Vila)', () => {
  assert.deepEqual(getInPlayNames(yukie), ['Yukie Fujikaze', 'Koyuki Kazahana']);
  assert.deepEqual(getInPlayNames(sageNaruto), ['Naruto Uzumaki (Sage Mode)', 'Naruto Uzumaki']);
});

test('limite de 3 cópias conta a carta (id), não o nome', () => {
  // s01-n-001, s01-n-019 e s01-n-025 são todas "Naruto Uzumaki", mas cartas diferentes.
  assert.equal(cannotAddReason({ 's01-n-001': 3, 's01-n-019': 3 }, lookup('s01-n-025')!, lookup), null);
  assert.equal(cannotAddReason({ 's15-n-684': 3, 's17-n-816': 3 }, lookup('s24-n-1394')!, lookup), null);
  const s = summarizeDeck({ 's01-n-001': 30, 's01-j-007': 20 }, lookup);
  assert.equal(s.total, 50);
  assert.deepEqual(s.issues.map((i) => i.code), ['copies', 'copies']);
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

test('Baralho de Reforço: Esquadrões e Ninjas "Reinforcement" ficam fora do Deck', async () => {
  const { deckPartOf } = await import('./deckRules.ts');
  assert.equal(deckPartOf(lookup('s13-n-549')!), 'reinforcement'); // Squad: Neji Hyuga & Hinata Hyuga
  assert.equal(deckPartOf(lookup('s17-n-784')!), 'reinforcement'); // Reinforcement: Hidan (Curse Mode)
  assert.equal(deckPartOf(lookup('s01-n-001')!), 'main');

  // Deck válido de 50 + Reforço: as cartas do Reforço não contam nas 50.
  const base: DeckCards = {
    's01-n-004': 3, 's01-n-005': 3, 's01-n-006': 3, 's01-n-009': 3, 's01-n-010': 3, 's01-n-012': 3, 's01-n-029': 3,
    's01-j-001': 3, 's01-j-002': 3, 's01-j-015': 3, 's01-j-016': 3, 's01-j-020': 3,
    's01-m-001': 3, 's01-m-006': 3, 's01-m-011': 3, 's01-m-019': 3, 's01-m-020': 2,
  };
  const s = summarizeDeck({ ...base, 's13-n-549': 3, 's17-n-784': 2 }, lookup);
  assert.equal(s.total, 50);
  assert.equal(s.reinforcement, 5);
  assert.equal(s.byType.ninja, 21);
  assert.equal(s.isValid, true, JSON.stringify(s.issues));

  // Com o Deck cheio, ainda dá para adicionar ao Reforço.
  assert.match(cannotAddReason(base, lookup('s01-n-001')!, lookup) ?? '', /50 cartas/);
  assert.equal(cannotAddReason(base, lookup('s13-n-549')!, lookup), null);
});

test('Baralho de Reforço: até 15 cartas', () => {
  // 15 cartas no Reforço (5 nomes × 3): cheio. Com mais uma, fica inválido.
  const fifteen: DeckCards = { 's13-n-549': 3, 's13-n-550': 3, 's13-n-551': 3, 's13-n-552': 3, 's13-n-572': 3 };
  assert.match(cannotAddReason(fifteen, lookup('s13-n-573')!, lookup) ?? '', /Baralho de Reforço já tem 15/);
  const sixteen = summarizeDeck({ ...fifteen, 's13-n-573': 1 }, lookup);
  assert.equal(sixteen.reinforcement, 16);
  assert.ok(sixteen.issues.some((i) => i.code === 'reinforcement-size'));
});

test('limite de 3 cópias de cada carta', () => {
  const three: DeckCards = { 's01-n-001': 3 };
  assert.match(cannotAddReason(three, lookup('s01-n-001')!, lookup) ?? '', /3 cópias/);
  assert.equal(cannotAddReason({ 's01-n-001': 2 }, lookup('s01-n-001')!, lookup), null);
  const four = summarizeDeck({ 's01-n-001': 4 }, lookup);
  assert.ok(four.issues.some((i) => i.code === 'copies'));
});

test('Tokens: fora das 50, quantos quiser, 1 cópia de cada', async () => {
  const { deckPartOf } = await import('./deckRules.ts');
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
  // Segunda cópia do mesmo Token: bloqueada e inválida.
  assert.match(cannotAddReason(cards, tokens.get('t-1')!, look) ?? '', /Token/);
  assert.ok(summarizeDeck({ 't-1': 2 }, look).issues.some((i) => i.code === 'token-copies'));
  // Com o Deck cheio, ainda dá para adicionar Tokens.
  const full: DeckCards = {};
  let n = 0;
  for (const c of CARDS) {
    if (n >= DECK_RULES.size) break;
    if (c.type !== 'jutsu') continue;
    full[c.id] = 1;
    n++;
  }
  assert.equal(cannotAddReason(full, tokens.get('t-1')!, look), null);
});
