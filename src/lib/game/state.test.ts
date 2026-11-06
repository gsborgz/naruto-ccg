import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyGameAction,
  BATTLEFIELD_MAX_TEAMS,
  createGame,
  deckContents,
  gameView,
  GameError,
  OPENING_HAND,
  parseGameAction,
  shuffle,
  TEAM_MAX,
  teamGroups,
  type CardRules,
  type GameState,
  type Rng,
} from './state.ts';

/** Gerador previsível (LCG) para os testes. */
function seeded(seed = 42): Rng {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

const decks = {
  host: { a: 10, b: 10, c: 10, d: 10, e: 10, squad: 2 },
  guest: { x: 25, y: 25 },
};
const isReinforcement = (id: string) => id === 'squad';

function newGame(): GameState {
  return createGame(decks, isReinforcement, seeded());
}

test('partida: preparação embaralha, separa o Reforço e compra a mão inicial', () => {
  const g = newGame();
  const host = g.players.host;
  assert.equal(host.hand.length, OPENING_HAND);
  assert.equal(host.deck.length, 50 - OPENING_HAND);
  assert.deepEqual(host.reinforcement.map((c) => c.cardId), ['squad', 'squad']);
  assert.equal(g.players.guest.hand.length + g.players.guest.deck.length, 50);

  const all = [...host.deck, ...host.hand, ...host.reinforcement].map((c) => c.uid);
  assert.equal(new Set(all).size, 52, 'uids únicos');
  // Embaralhado: a ordem não é a de inserção.
  const ordered = [...host.hand, ...host.deck].map((c) => c.cardId).join('');
  assert.notEqual(ordered, 'a'.repeat(10) + 'b'.repeat(10) + 'c'.repeat(10) + 'd'.repeat(10) + 'e'.repeat(10));
});

test('partida: mover, comprar, embaralhar', () => {
  const rng = seeded(7);
  let g = newGame();
  const card = g.players.host.hand[0];

  g = applyGameAction(g, 'host', { type: 'move', uid: card.uid, to: 'village' }, rng);
  assert.equal(g.players.host.village[0].uid, card.uid);
  assert.equal(g.players.host.hand.length, OPENING_HAND - 1);

  // Devolver ao deck coloca no topo; comprar pega o topo.
  g = applyGameAction(g, 'host', { type: 'move', uid: card.uid, to: 'deck' }, rng);
  assert.equal(g.players.host.deck[0].uid, card.uid);
  g = applyGameAction(g, 'host', { type: 'draw' }, rng);
  assert.equal(g.players.host.hand.at(-1)?.uid, card.uid);

  const before = g.players.host.deck.map((c) => c.uid);
  g = applyGameAction(g, 'host', { type: 'shuffle' }, rng);
  assert.deepEqual([...g.players.host.deck.map((c) => c.uid)].sort(), [...before].sort());
  assert.notDeepEqual(g.players.host.deck.map((c) => c.uid), before);

  // Não dá para mexer nas cartas do oponente.
  const theirs = g.players.guest.hand[0].uid;
  assert.throws(() => applyGameAction(g, 'host', { type: 'move', uid: theirs, to: 'discard' }, rng), GameError);
});

test('partida: buscar leva a carta do deck para a mão e embaralha', () => {
  const g = newGame();
  const wanted = g.players.host.deck.at(-1)!.cardId; // uma carta do fundo do deck
  const deckBefore = g.players.host.deck.map((c) => c.uid);
  const next = applyGameAction(g, 'host', { type: 'search', cardId: wanted }, seeded(3));

  assert.equal(next.players.host.hand.length, OPENING_HAND + 1);
  assert.equal(next.players.host.hand.at(-1)?.cardId, wanted);
  assert.equal(next.players.host.deck.length, deckBefore.length - 1);
  assert.notDeepEqual(
    next.players.host.deck.map((c) => c.uid),
    deckBefore.filter((uid) => uid !== next.players.host.hand.at(-1)?.uid),
    'o deck foi embaralhado depois da busca',
  );
  assert.throws(() => applyGameAction(g, 'host', { type: 'search', cardId: 'nao-existe' }, seeded()), GameError);
});

test('partida: cada jogador só vê o que as regras permitem', () => {
  let g = newGame();
  const rng = seeded(9);
  g = applyGameAction(g, 'host', { type: 'move', uid: g.players.host.hand[0].uid, to: 'village' }, rng);
  g = applyGameAction(g, 'guest', { type: 'giveReward' }, rng); // Prêmio do host vem do deck do guest

  const asHost = gameView(g, 'host').players;
  const asGuest = gameView(g, 'guest').players;

  assert.equal(asHost.host.hand.cards?.length, OPENING_HAND - 1); // a própria mão
  assert.equal(asGuest.host.hand.cards, undefined); // a mão do oponente: só a contagem
  assert.equal(asGuest.host.hand.count, OPENING_HAND - 1);
  assert.equal(asGuest.host.village.cards?.length, 1); // Vila é pública
  assert.equal(asHost.host.deck.cards, undefined); // Deck: ninguém vê, nem o dono
  assert.equal(asHost.host.rewards.cards, undefined); // Prêmios: ninguém vê
  assert.equal(asHost.host.reinforcement.cards?.length, 2); // Reforço: o dono vê
  assert.equal(asGuest.host.reinforcement.cards, undefined);

  const contents = deckContents(g, 'host');
  assert.equal(Object.values(contents).reduce((s, n) => s + n, 0), g.players.host.deck.length);
});

test('partida: validação das ações e embaralhamento', () => {
  assert.deepEqual(parseGameAction({ type: 'move', uid: 'h1', to: 'chakra' }), { type: 'move', uid: 'h1', to: 'chakra' });
  assert.equal(parseGameAction({ type: 'move', uid: 'h1', to: 'mesa' }), null);
  assert.deepEqual(parseGameAction({ type: 'search', cardId: 's01-n-001' }), { type: 'search', cardId: 's01-n-001' });
  assert.equal(parseGameAction({ type: 'hack' }), null);
  assert.deepEqual([...shuffle([1, 2, 3, 4, 5], seeded())].sort(), [1, 2, 3, 4, 5]);
});

/** Coloca as 6 cartas da mão do host na Vila e devolve os uids (todas tratadas como Ninja, exceto 'e'). */
function villageOfSix(): { g: GameState; uids: string[] } {
  let g = newGame();
  const uids = g.players.host.hand.map((c) => c.uid);
  for (const uid of uids) g = applyGameAction(g, 'host', { type: 'move', uid, to: 'village' }, seeded());
  return { g, uids };
}

const ninjas: CardRules = { isNinja: (id) => id !== 'e' };

test('Times: arrastar um Ninja sobre outro forma o Time; o primeiro é o Líder; máximo de 3', () => {
  let { g, uids } = villageOfSix();
  const [a, b, c, d] = uids.filter((uid) => g.players.host.village.find((x) => x.uid === uid)?.cardId !== 'e');
  const act = (action: Parameters<typeof applyGameAction>[2]) => (g = applyGameAction(g, 'host', action, seeded(), ninjas));

  act({ type: 'joinTeam', uid: b, target: a });
  act({ type: 'joinTeam', uid: c, target: a });
  const team = teamGroups(g.players.host.village).find((t) => t.length > 1)!;
  assert.deepEqual(team.map((x) => x.uid), [a, b, c], 'o alvo continua Líder; os outros entram atrás');
  assert.equal(TEAM_MAX, 3);
  assert.throws(() => act({ type: 'joinTeam', uid: d, target: b }), /no máximo 3/);

  // Tornar outro Ninja o Líder.
  act({ type: 'setLeader', uid: c });
  assert.deepEqual(teamGroups(g.players.host.village).find((t) => t.length > 1)!.map((x) => x.uid), [c, a, b]);

  // Arrastar um membro para a própria Vila o tira do Time; com 1 sobrando, o Time some.
  act({ type: 'move', uid: a, to: 'village' });
  act({ type: 'move', uid: b, to: 'village' });
  assert.ok(g.players.host.village.every((x) => !x.team));
});

test('Times: o Time vai inteiro para o Campo de Batalha, até 3 Times', () => {
  let { g, uids } = villageOfSix();
  const ok = uids.filter((uid) => g.players.host.village.find((x) => x.uid === uid)?.cardId !== 'e');
  const act = (action: Parameters<typeof applyGameAction>[2]) => (g = applyGameAction(g, 'host', action, seeded(), ninjas));

  act({ type: 'joinTeam', uid: ok[1], target: ok[0] });
  act({ type: 'moveTeam', uid: ok[1], to: 'battlefield' });
  assert.deepEqual(g.players.host.battlefield.map((x) => x.uid), [ok[0], ok[1]]);
  assert.equal(teamGroups(g.players.host.battlefield).length, 1);

  act({ type: 'moveTeam', uid: ok[2], to: 'battlefield' });
  act({ type: 'moveTeam', uid: ok[3], to: 'battlefield' });
  assert.equal(teamGroups(g.players.host.battlefield).length, BATTLEFIELD_MAX_TEAMS);
  const extra = g.players.host.village[0].uid;
  assert.throws(() => act({ type: 'moveTeam', uid: extra, to: 'battlefield' }), /No máximo 3 Times/);
  assert.throws(() => act({ type: 'move', uid: extra, to: 'battlefield' }), /No máximo 3 Times/);

  // Voltar o Time para a Vila mantém o Time; mandar para o Descarte desfaz.
  act({ type: 'moveTeam', uid: ok[0], to: 'village' });
  assert.equal(g.players.host.village.filter((x) => x.team).length, 2);
  act({ type: 'moveTeam', uid: ok[0], to: 'discard' });
  assert.ok(g.players.host.discard.every((x) => !x.team));
});

test('Times: só Ninjas, e só na Vila ou no Campo de Batalha', () => {
  const { g } = villageOfSix();
  const notNinja = g.players.host.village.find((x) => x.cardId === 'e');
  const ninja = g.players.host.village.find((x) => x.cardId !== 'e')!;
  if (notNinja) {
    assert.throws(() => applyGameAction(g, 'host', { type: 'joinTeam', uid: notNinja.uid, target: ninja.uid }, seeded(), ninjas), /Só Ninjas/);
  }
  const inDeck = g.players.host.deck[0].uid;
  assert.throws(() => applyGameAction(g, 'host', { type: 'joinTeam', uid: ninja.uid, target: inDeck }, seeded(), ninjas), /Vila e no Campo/);
});

test('Prêmios: não vão para a sua própria área; você manda uma carta sua para os Prêmios do oponente', () => {
  let g = newGame();
  const rng = seeded(5);
  const mine = g.players.host.hand[0].uid;
  assert.throws(() => applyGameAction(g, 'host', { type: 'move', uid: mine, to: 'rewards' }, rng), /Deck do oponente/);

  // Sem uid: a carta do topo do seu Deck vai para os Prêmios do oponente, face para baixo.
  const top = g.players.host.deck[0];
  g = applyGameAction(g, 'host', { type: 'giveReward' }, rng);
  assert.equal(g.players.host.deck.length, 50 - OPENING_HAND - 1); // as 2 do Reforço nunca entram no deck
  assert.deepEqual(g.players.guest.rewards.map((c) => c.uid), [top.uid]);
  assert.equal(gameView(g, 'guest').players.guest.rewards.cards, undefined, 'ninguém vê os Prêmios');

  // Com uid: uma carta específica sua.
  g = applyGameAction(g, 'host', { type: 'giveReward', uid: mine }, rng);
  assert.equal(g.players.guest.rewards.length, 2);

  // Quem recebeu não consegue tirar os Prêmios de lá.
  assert.throws(() => applyGameAction(g, 'guest', { type: 'move', uid: top.uid, to: 'hand' }, rng), /ficam lá/);
  assert.deepEqual(parseGameAction({ type: 'giveReward' }), { type: 'giveReward' });
});
