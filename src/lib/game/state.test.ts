import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyGameAction,
  BATTLEFIELD_MAX_TEAMS,
  createGame,
  deckContents,
  gameView,
  GameError,
  LOG_MAX,
  NINJA_COIN,
  OPENING_HAND,
  PHASES,
  parseGameAction,
  shuffle,
  TEAM_MAX,
  teamGroups,
  TURN_MAX,
  type CardRules,
  type GameState,
  type Rng,
} from './state.ts';
import { BOARD_THEME_IDS, DEFAULT_BOARD_THEME } from './boardThemes.ts';

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

  // Com `bottom`, vai para o fundo do Deck (e o registro diz isso).
  const low = g.players.host.hand[0];
  g = applyGameAction(g, 'host', { type: 'move', uid: low.uid, to: 'deck', bottom: true }, rng);
  assert.equal(g.players.host.deck.at(-1)?.uid, low.uid);
  assert.equal(g.log!.at(-1)!.position, 'bottom');
  assert.deepEqual(parseGameAction({ type: 'move', uid: 'x', to: 'deck', bottom: true }), { type: 'move', uid: 'x', to: 'deck', bottom: true });

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

  // Na ordem do deck, do topo para o fundo.
  assert.deepEqual(deckContents(g, 'host'), g.players.host.deck.map((c) => c.cardId));
});

test('partida: validação das ações e embaralhamento', () => {
  assert.deepEqual(parseGameAction({ type: 'move', uid: 'h1', to: 'chakra' }), { type: 'move', uid: 'h1', to: 'chakra' });
  assert.equal(parseGameAction({ type: 'move', uid: 'h1', to: 'mesa' }), null);
  assert.deepEqual(parseGameAction({ type: 'search', cardId: 'fx-n-001' }), { type: 'search', cardId: 'fx-n-001' });
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

test('Prêmios: devolver manda a última carta da Área de volta ao topo do Deck do dono', () => {
  let g = newGame();
  const rng = seeded(6);
  const first = g.players.host.deck[0];
  g = applyGameAction(g, 'host', { type: 'giveReward' }, rng);
  const mine = g.players.host.hand[0];
  g = applyGameAction(g, 'host', { type: 'giveReward', uid: mine.uid }, rng);
  const deckBefore = g.players.host.deck.length;

  // Quem recebeu devolve: a última (a da mão) volta ao topo do Deck do host.
  g = applyGameAction(g, 'guest', { type: 'returnReward', owner: 'guest' }, rng);
  assert.deepEqual(g.players.guest.rewards.map((c) => c.uid), [first.uid]);
  assert.equal(g.players.host.deck.length, deckBefore + 1);
  assert.equal(g.players.host.deck[0].uid, mine.uid);
  // Quem deu também pode pegar de volta.
  g = applyGameAction(g, 'host', { type: 'returnReward', owner: 'guest' }, rng);
  assert.equal(g.players.guest.rewards.length, 0);
  assert.equal(g.players.host.deck[0].uid, first.uid);
  assert.throws(() => applyGameAction(g, 'host', { type: 'returnReward', owner: 'guest' }, rng), /vazia/);

  // No registro, ninguém vê qual carta voltou.
  assert.equal(gameView(g, 'host').log.at(-1)!.hidden, undefined, 'sem cartas no registro');
  assert.equal(gameView(g, 'host').log.at(-1)!.owner, 'guest');
  assert.deepEqual(parseGameAction({ type: 'returnReward', owner: 'guest' }), { type: 'returnReward', owner: 'guest' });
  assert.equal(parseGameAction({ type: 'returnReward', owner: 'x' }), null);
});

test('Prêmios: olhar um Prêmio mostra a carta só para quem olhou; dá para devolver essa carta', () => {
  let g = newGame();
  const rng = seeded(8);
  const first = g.players.host.deck[0];
  g = applyGameAction(g, 'host', { type: 'giveReward' }, rng);
  const second = g.players.host.deck[0];
  g = applyGameAction(g, 'host', { type: 'giveReward' }, rng);
  const before = JSON.stringify(g.players);

  // O guest olha o primeiro Prêmio da própria Área: a mesa não muda; só ele vê a carta.
  g = applyGameAction(g, 'guest', { type: 'peekReward', owner: 'guest', index: 0 }, rng);
  assert.equal(JSON.stringify(g.players), before, 'olhar não move nada');
  assert.deepEqual(gameView(g, 'guest').peek, { owner: 'guest', index: 0, card: first });
  assert.equal(gameView(g, 'host').peek, undefined, 'o oponente não recebe a carta olhada');
  const seen = gameView(g, 'guest').log.at(-1)!;
  assert.equal(seen.type, 'peekReward');
  assert.deepEqual(seen.cards, [first.cardId]);
  assert.equal(seen.slot, 1);
  const theirs = gameView(g, 'host').log.at(-1)!;
  assert.equal(theirs.cards, undefined, 'o oponente sabe que ele olhou, não o quê');
  assert.equal(theirs.hidden, true);
  assert.throws(() => applyGameAction(g, 'guest', { type: 'peekReward', owner: 'guest', index: 5 }, rng), /não existe/);

  // Devolve a carta olhada (não a última): volta ao topo do Deck de quem a deu.
  g = applyGameAction(g, 'guest', { type: 'returnReward', owner: 'guest', uid: first.uid }, rng);
  assert.deepEqual(g.players.guest.rewards.map((c) => c.uid), [second.uid]);
  assert.equal(g.players.host.deck[0].uid, first.uid);
  assert.equal(gameView(g, 'guest').peek, undefined, 'a carta saiu da Área: some da visão');
  assert.deepEqual(gameView(g, 'guest').log.at(-1)!.cards, [first.cardId], 'quem devolveu vê qual foi');
  assert.equal(gameView(g, 'host').log.at(-1)!.cards, undefined, 'o oponente não');
  assert.throws(() => applyGameAction(g, 'guest', { type: 'returnReward', owner: 'guest', uid: first.uid }, rng), /não está mais/);

  assert.deepEqual(parseGameAction({ type: 'peekReward', owner: 'host', index: 2 }), { type: 'peekReward', owner: 'host', index: 2 });
  assert.equal(parseGameAction({ type: 'peekReward', owner: 'host', index: -1 }), null);
  assert.deepEqual(parseGameAction({ type: 'returnReward', owner: 'host', uid: 'u1' }), { type: 'returnReward', owner: 'host', uid: 'u1' });
  assert.equal(parseGameAction({ type: 'returnReward', owner: 'host', uid: 3 }), null);

  // Recuperar para a mão: a carta olhada vai para a mão de quem a deu.
  const handBefore = g.players.host.hand.length;
  g = applyGameAction(g, 'host', { type: 'peekReward', owner: 'guest', index: 0 }, rng);
  g = applyGameAction(g, 'host', { type: 'returnReward', owner: 'guest', uid: second.uid, to: 'hand' }, rng);
  assert.equal(g.players.guest.rewards.length, 0);
  assert.equal(g.players.host.hand.length, handBefore + 1);
  assert.equal(g.players.host.hand.at(-1)!.uid, second.uid);
  assert.equal(gameView(g, 'host').log.at(-1)!.to, 'hand');
  assert.deepEqual(parseGameAction({ type: 'returnReward', owner: 'host', uid: 'u1', to: 'hand' }), {
    type: 'returnReward',
    owner: 'host',
    uid: 'u1',
    to: 'hand',
  });
  assert.equal(parseGameAction({ type: 'returnReward', owner: 'host', to: 'discard' }), null);
});

test('revelar: cartas do topo ou do fundo do Deck vão para a Vila, à vista dos dois', () => {
  let g = newGame();
  const rng = seeded(8);
  const deck = g.players.host.deck;
  const top = deck.slice(0, 3).map((c) => c.uid);
  const bottom = deck.slice(-2).map((c) => c.uid);

  g = applyGameAction(g, 'host', { type: 'reveal', from: 'top', count: 3 }, rng);
  g = applyGameAction(g, 'host', { type: 'reveal', from: 'bottom', count: 2 }, rng);
  assert.deepEqual(g.players.host.village.map((c) => c.uid), [...top, ...bottom]);
  assert.equal(g.players.host.deck.length, deck.length - 5);
  // O oponente vê as cartas na Vila e no registro.
  assert.equal(gameView(g, 'guest').players.host.village.cards?.length, 5);
  const entry = gameView(g, 'guest').log.at(-1)!;
  assert.equal(entry.type, 'reveal');
  assert.equal(entry.position, 'bottom');
  assert.equal(entry.cards?.length, 2);

  // Pedir mais do que há no Deck revela o que sobrou.
  g = applyGameAction(g, 'host', { type: 'reveal', from: 'top', count: 99 }, rng);
  assert.equal(g.players.host.deck.length, 0);
  assert.throws(() => applyGameAction(g, 'host', { type: 'reveal', from: 'top', count: 1 }, rng), /vazio/);

  assert.deepEqual(parseGameAction({ type: 'reveal', from: 'bottom', count: 4 }), { type: 'reveal', from: 'bottom', count: 4 });
  assert.equal(parseGameAction({ type: 'reveal', from: 'middle', count: 4 }), null);
  assert.equal(parseGameAction({ type: 'reveal', from: 'top', count: 0 }), null);
});

test('Poder: +/− no Time fica no Líder, soma no Time e some fora da Vila/Campo', () => {
  let { g, uids } = villageOfSix();
  const [a, b] = uids.filter((uid) => g.players.host.village.find((x) => x.uid === uid)?.cardId !== 'e');
  const act = (action: Parameters<typeof applyGameAction>[2]) => (g = applyGameAction(g, 'host', action, seeded(), ninjas));
  const find = (uid: string) => g.players.host.village.find((x) => x.uid === uid);

  act({ type: 'joinTeam', uid: b, target: a });
  const logBefore = g.log!.length;
  act({ type: 'adjustPower', uid: b, delta: 1 }); // clicar num Apoio mexe no Líder
  act({ type: 'adjustPower', uid: a, delta: 1 });
  assert.equal(find(a)?.power, 2);
  assert.equal(find(b)?.power, undefined);
  // Cliques seguidos viram uma jogada só no registro.
  assert.equal(g.log!.length, logBefore + 1);
  assert.equal(g.log!.at(-1)!.delta, 2);

  act({ type: 'adjustPower', uid: a, delta: -3 });
  assert.equal(find(a)?.power, -1);
  // Ferir mantém o ajuste; ir para o Campo também.
  act({ type: 'setInjured', uid: a, injured: true });
  act({ type: 'moveTeam', uid: a, to: 'battlefield' });
  assert.equal(g.players.host.battlefield.find((x) => x.uid === a)?.power, -1);
  // Fora da Vila/Campo, o ajuste some.
  act({ type: 'move', uid: a, to: 'hand' });
  assert.equal(g.players.host.hand.find((x) => x.uid === a)?.power, undefined);
  assert.throws(() => act({ type: 'adjustPower', uid: a, delta: 1 }), /Vila ou no Campo/);

  assert.deepEqual(parseGameAction({ type: 'adjustPower', uid: 'h1', delta: -1 }), { type: 'adjustPower', uid: 'h1', delta: -1 });
  assert.equal(parseGameAction({ type: 'adjustPower', uid: 'h1', delta: 0.5 }), null);
});

test('partida: passar turno troca o Atacante e avança o Marcador de quem passou', () => {
  const rng = seeded(3);
  let g = newGame();
  assert.equal(g.turnNumber, 1);
  assert.ok(g.active === 'host' || g.active === 'guest', 'quem começa é sorteado');
  g = { ...g, active: 'host' };

  assert.throws(() => applyGameAction(g, 'guest', { type: 'passTurn' }, rng), GameError, 'só o Atacante passa');

  g = applyGameAction(g, 'host', { type: 'passTurn' }, rng);
  assert.equal(g.active, 'guest');
  assert.equal(g.turnNumber, 2);
  assert.deepEqual(g.turn, { host: 1, guest: 0 });

  g = applyGameAction(g, 'guest', { type: 'passTurn' }, rng);
  assert.equal(g.active, 'host');
  assert.deepEqual(g.turn, { host: 1, guest: 1 });
  assert.equal(gameView(g, 'guest').active, 'host');
  assert.equal(gameView(g, 'guest').turnNumber, 3);
});

test('partida: o Atacante passa o turno com qualquer número de cartas na mão (sem o limite de 6)', () => {
  const rng = seeded(4);
  let g: GameState = { ...newGame(), active: 'host' };
  g = applyGameAction(g, 'host', { type: 'draw' }, rng);
  g = applyGameAction(g, 'host', { type: 'draw' }, rng);
  assert.equal(g.players.host.hand.length, OPENING_HAND + 2);
  assert.equal(applyGameAction(g, 'host', { type: 'passTurn' }, rng).active, 'guest');
});

test('partida: o Marcador de Turnos para na última casa', () => {
  const g: GameState = { ...newGame(), active: 'host', turn: { host: TURN_MAX, guest: 0 } };
  assert.equal(applyGameAction(g, 'host', { type: 'passTurn' }, seeded()).turn.host, TURN_MAX);
});

test('partida: passTurn é uma ação válida', () => {
  assert.deepEqual(parseGameAction({ type: 'passTurn' }), { type: 'passTurn' });
});

test('fases: só o Atacante avança; a última (Batalha) termina passando o turno, que volta para a primeira (Missão)', () => {
  const rng = seeded(5);
  let g: GameState = { ...newGame(), active: 'host' };
  assert.equal(gameView(g, 'guest').phase, 0);
  assert.throws(() => applyGameAction(g, 'guest', { type: 'nextPhase' }, rng), /Atacante/);
  for (let i = 1; i < PHASES.length; i++) g = applyGameAction(g, 'host', { type: 'nextPhase' }, rng);
  assert.equal(g.phase, PHASES.length - 1);
  assert.throws(() => applyGameAction(g, 'host', { type: 'nextPhase' }, rng), /passe o turno/);
  g = applyGameAction(g, 'host', { type: 'passTurn' }, rng);
  assert.equal(g.phase, 0);
  assert.deepEqual(parseGameAction({ type: 'nextPhase' }), { type: 'nextPhase' });
});

test('Ninja Ferido: só Ninjas na Vila ou no Campo; continua ferido no Time e entre Vila e Campo; sai ao deixar o jogo', () => {
  const rng = seeded(6);
  let g = newGame();
  const [a, b] = g.players.host.hand.filter((c) => c.cardId !== 'e');
  assert.ok(a && b);
  assert.throws(() => applyGameAction(g, 'host', { type: 'setInjured', uid: a.uid, injured: true }, rng, ninjas), /Vila/);

  g = applyGameAction(g, 'host', { type: 'move', uid: a.uid, to: 'battlefield' }, rng, ninjas);
  g = applyGameAction(g, 'host', { type: 'setInjured', uid: a.uid, injured: true }, rng, ninjas);
  assert.equal(g.players.host.battlefield[0].injured, true);
  assert.equal(gameView(g, 'guest').players.host.battlefield.cards?.[0].injured, true, 'o oponente vê');

  // Entra num Time ferido e o Time volta inteiro para a Vila sem se curar.
  g = applyGameAction(g, 'host', { type: 'move', uid: b.uid, to: 'battlefield' }, rng, ninjas);
  g = applyGameAction(g, 'host', { type: 'joinTeam', uid: a.uid, target: b.uid }, rng, ninjas);
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: b.uid, to: 'village' }, rng, ninjas);
  assert.equal(g.players.host.village.find((c) => c.uid === a.uid)?.injured, true);

  // Curar.
  const healed = applyGameAction(g, 'host', { type: 'setInjured', uid: a.uid, injured: false }, rng, ninjas);
  assert.equal(healed.players.host.village.find((c) => c.uid === a.uid)?.injured, undefined);

  // Descartado: perde o estado.
  g = applyGameAction(g, 'host', { type: 'move', uid: a.uid, to: 'discard' }, rng, ninjas);
  assert.deepEqual(Object.keys(g.players.host.discard[0]).sort(), ['cardId', 'uid']);
  assert.deepEqual(parseGameAction({ type: 'setInjured', uid: 'x', injured: true }), { type: 'setInjured', uid: 'x', injured: true });
  assert.equal(parseGameAction({ type: 'setInjured', uid: 'x' }), null);
});

test('Times: reordenar no Campo de Batalha (Time inteiro ou carta sozinha) com "before"', () => {
  const rng = seeded(8);
  let g = newGame();
  const [a, b, c, d] = g.players.host.hand.filter((x) => x.cardId !== 'e');
  assert.ok(a && b && c && d);
  // Até 3 Times no Campo: o Time [a b] se forma na Vila e vai inteiro. Times: [a b] [c] [d]
  for (const x of [a, b]) g = applyGameAction(g, 'host', { type: 'move', uid: x.uid, to: 'village' }, rng, ninjas);
  g = applyGameAction(g, 'host', { type: 'joinTeam', uid: b.uid, target: a.uid }, rng, ninjas);
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: a.uid, to: 'battlefield' }, rng, ninjas);
  for (const x of [c, d]) g = applyGameAction(g, 'host', { type: 'move', uid: x.uid, to: 'battlefield' }, rng, ninjas);
  const order = () => g.players.host.battlefield.map((x) => x.uid);
  assert.deepEqual(order(), [a.uid, b.uid, c.uid, d.uid]);

  // O Time [a b] vai para antes de [d] (inteiro, Líder na frente).
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: b.uid, to: 'battlefield', before: d.uid }, rng, ninjas);
  assert.deepEqual(order(), [c.uid, a.uid, b.uid, d.uid]);
  assert.equal(g.players.host.battlefield[1].team, g.players.host.battlefield[2].team, 'continua sendo um Time');

  // Sem "before" na mesma zona: vai para o fim (o Time do meio para a direita).
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: a.uid, to: 'battlefield' }, rng, ninjas);
  assert.deepEqual(order(), [c.uid, d.uid, a.uid, b.uid]);
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: c.uid, to: 'battlefield' }, rng, ninjas);
  assert.deepEqual(order(), [d.uid, a.uid, b.uid, c.uid]);
  g = applyGameAction(g, 'host', { type: 'move', uid: d.uid, to: 'battlefield' }, rng, ninjas);
  assert.deepEqual(order(), [a.uid, b.uid, c.uid, d.uid], 'carta sozinha também vai para o fim');
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: b.uid, to: 'battlefield', before: d.uid }, rng, ninjas);
  assert.deepEqual(order(), [c.uid, a.uid, b.uid, d.uid]);
  // Fora da Vila/Campo, soltar na mesma zona não reordena (ex.: a mão).
  const h = g.players.host.hand[0];
  assert.equal(applyGameAction(g, 'host', { type: 'move', uid: h.uid, to: 'hand' }, rng, ninjas), g);
  // "before" de um membro do próprio Time: nada muda.
  assert.equal(applyGameAction(g, 'host', { type: 'moveTeam', uid: a.uid, to: 'battlefield', before: b.uid }, rng, ninjas), g);

  // Carta sozinha: [d] para antes de [c]; "before" é o Time inteiro, mesmo apontando para o Apoio.
  g = applyGameAction(g, 'host', { type: 'move', uid: d.uid, to: 'battlefield', before: c.uid }, rng, ninjas);
  assert.deepEqual(order(), [d.uid, c.uid, a.uid, b.uid]);
  g = applyGameAction(g, 'host', { type: 'move', uid: d.uid, to: 'battlefield', before: b.uid }, rng, ninjas);
  assert.deepEqual(order(), [c.uid, d.uid, a.uid, b.uid]);

  // Vindo de outra zona, entra na posição.
  const e = g.players.host.hand.find((x) => x.cardId !== 'e')!;
  g = applyGameAction(g, 'host', { type: 'move', uid: e.uid, to: 'village' }, rng, ninjas);
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: c.uid, to: 'village', before: e.uid }, rng, ninjas);
  assert.deepEqual(g.players.host.village.map((x) => x.uid), [c.uid, e.uid]);

  assert.deepEqual(parseGameAction({ type: 'move', uid: 'x', to: 'village', before: 'y' }), { type: 'move', uid: 'x', to: 'village', before: 'y' });
  assert.deepEqual(parseGameAction({ type: 'moveTeam', uid: 'x', to: 'village' }), { type: 'moveTeam', uid: 'x', to: 'village' });
});

test('Campo de Batalha: cada Time numa das 3 colunas ("lane"), trocando com quem estava na coluna', () => {
  const rng = seeded(9);
  let g = newGame();
  const [a, b, c, d] = g.players.host.hand.filter((x) => x.cardId !== 'e');
  assert.ok(a && b && c && d);
  const lanes = () =>
    Object.fromEntries(g.players.host.battlefield.map((x) => [x.uid, x.lane])) as Record<string, number | undefined>;

  // Sem coluna escolhida: o centro primeiro, depois a esquerda e a direita.
  g = applyGameAction(g, 'host', { type: 'move', uid: a.uid, to: 'battlefield' }, rng, ninjas);
  assert.deepEqual(lanes(), { [a.uid]: 1 });
  g = applyGameAction(g, 'host', { type: 'move', uid: b.uid, to: 'battlefield', lane: 2 }, rng, ninjas);
  assert.deepEqual(lanes(), { [a.uid]: 1, [b.uid]: 2 });

  // Mover para uma coluna ocupada troca as duas.
  g = applyGameAction(g, 'host', { type: 'move', uid: b.uid, to: 'battlefield', lane: 1 }, rng, ninjas);
  assert.deepEqual(lanes(), { [a.uid]: 2, [b.uid]: 1 });
  // Na coluna em que já está: nada muda.
  assert.equal(applyGameAction(g, 'host', { type: 'move', uid: b.uid, to: 'battlefield', lane: 1 }, rng, ninjas), g);

  // Vindo de fora para uma coluna ocupada: quem estava vai para a livre.
  g = applyGameAction(g, 'host', { type: 'move', uid: c.uid, to: 'battlefield', lane: 1 }, rng, ninjas);
  assert.deepEqual(lanes(), { [a.uid]: 2, [b.uid]: 0, [c.uid]: 1 });

  // Juntar ao Time: fica na coluna do Líder; o Time inteiro muda de coluna junto.
  g = applyGameAction(g, 'host', { type: 'joinTeam', uid: b.uid, target: a.uid }, rng, ninjas);
  assert.deepEqual(lanes(), { [a.uid]: 2, [b.uid]: 2, [c.uid]: 1 });
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: b.uid, to: 'battlefield', lane: 0 }, rng, ninjas);
  assert.deepEqual(lanes(), { [a.uid]: 0, [b.uid]: 0, [c.uid]: 1 });
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: a.uid, to: 'battlefield', lane: 1 }, rng, ninjas);
  assert.deepEqual(lanes(), { [a.uid]: 1, [b.uid]: 1, [c.uid]: 0 });

  // Cartas que não são Ninja não têm coluna nem tiram um Time da dele.
  g = applyGameAction(g, 'host', { type: 'move', uid: d.uid, to: 'village' }, rng, ninjas);
  const notNinja = g.players.host.hand.find((x) => x.cardId === 'e');
  if (notNinja) {
    g = applyGameAction(g, 'host', { type: 'move', uid: notNinja.uid, to: 'battlefield', lane: 1 }, rng, ninjas);
    assert.equal(lanes()[notNinja.uid], undefined);
    assert.equal(lanes()[a.uid], 1);
  }

  // Saindo do Campo, perde a coluna.
  g = applyGameAction(g, 'host', { type: 'moveTeam', uid: a.uid, to: 'village' }, rng, ninjas);
  assert.ok(g.players.host.village.every((x) => x.lane === undefined));

  assert.deepEqual(parseGameAction({ type: 'moveTeam', uid: 'x', to: 'battlefield', lane: 2 }), {
    type: 'moveTeam',
    uid: 'x',
    to: 'battlefield',
    lane: 2,
  });
  assert.deepEqual(parseGameAction({ type: 'move', uid: 'x', to: 'battlefield', lane: 5 }), { type: 'move', uid: 'x', to: 'battlefield' });
});

test('tema: sorteado na partida (padrão de quem não escolheu); não há jogada para mudar o tema do outro', () => {
  const g = newGame();
  assert.ok(BOARD_THEME_IDS.includes(g.theme!), 'sorteado entre os temas');
  assert.equal(gameView(g, 'host').theme, gameView(g, 'guest').theme);
  // A escolha de cada um fica no navegador dele: o servidor não aceita trocar o tema da partida.
  assert.equal(parseGameAction({ type: 'setTheme', theme: 'bambu' }), null);
  // Partidas antigas, sem tema, abrem no padrão.
  const { theme: _old, ...semTema } = g;
  assert.equal(gameView(semTema as GameState, 'host').theme, DEFAULT_BOARD_THEME);
});

test('registro de jogo: anota cada jogada com a carta e o destino; esconde o que o jogador não pode ver', () => {
  const rng = seeded(10);
  let g: GameState = { ...newGame(), active: 'host' };
  const card = g.players.host.hand[0];
  const top = g.players.host.deck[0];

  g = applyGameAction(g, 'host', { type: 'move', uid: card.uid, to: 'village' }, rng);
  g = applyGameAction(g, 'host', { type: 'draw' }, rng);
  g = applyGameAction(g, 'host', { type: 'nextPhase' }, rng);
  const before = g.log!.length;
  assert.equal(applyGameAction(g, 'host', { type: 'move', uid: card.uid, to: 'village' }, rng).log!.length, before, 'jogada sem efeito não entra');

  const [moved, drew, phase] = g.log!;
  assert.deepEqual(
    { n: moved.n, who: moved.who, type: moved.type, cards: moved.cards, from: moved.from, to: moved.to, turn: moved.turn },
    { n: 1, who: 'host', type: 'move', cards: [card.cardId], from: 'hand', to: 'village', turn: 1 },
  );
  assert.deepEqual(drew.cards, [top.cardId]);
  assert.equal(phase.phase, 1);

  // Mão → Vila: os dois veem. Compra (Deck → Mão): só quem comprou vê qual foi.
  const guestView = gameView(g, 'guest').log;
  assert.deepEqual(guestView[0].cards, [card.cardId]);
  assert.equal(guestView[1].cards, undefined);
  assert.equal(guestView[1].hidden, true);
  assert.deepEqual(gameView(g, 'host').log[1].cards, [top.cardId]);

  // Prêmio do topo do Deck: ninguém vê qual carta foi.
  g = applyGameAction(g, 'host', { type: 'giveReward' }, rng);
  assert.equal(gameView(g, 'host').log.at(-1)!.hidden, true);
  assert.equal(gameView(g, 'guest').log.at(-1)!.hidden, true);

  // Guarda só as últimas LOG_MAX, numeradas sem repetir.
  for (let i = 0; i < LOG_MAX + 5; i++) g = applyGameAction(g, 'host', { type: 'shuffle' }, rng);
  assert.equal(g.log!.length, LOG_MAX);
  assert.equal(g.log!.at(-1)!.n, before + 1 + LOG_MAX + 5);
});

test('devolver a mão ao Deck: todas as cartas voltam e o Deck é embaralhado; o registro mostra quais só ao dono', () => {
  const rng = seeded(11);
  let g = newGame();
  const hand = g.players.host.hand.map((c) => c.cardId);
  const deckSize = g.players.host.deck.length;
  g = applyGameAction(g, 'host', { type: 'returnHand' }, rng);
  assert.equal(g.players.host.hand.length, 0);
  assert.equal(g.players.host.deck.length, deckSize + hand.length);
  assert.throws(() => applyGameAction(g, 'host', { type: 'returnHand' }, rng), /mão está vazia/);

  const mine = gameView(g, 'host').log.at(-1)!;
  assert.equal(mine.type, 'returnHand');
  assert.deepEqual(mine.cards, hand, 'o dono vê as cartas que voltaram');
  const theirs = gameView(g, 'guest').log.at(-1)!;
  assert.equal(theirs.cards, undefined, 'o oponente não vê quais');
  assert.equal(theirs.count, hand.length, 'mas vê quantas');
  assert.deepEqual(parseGameAction({ type: 'returnHand' }), { type: 'returnHand' });
});

test('Moedas: pôr e tirar por tipo, seguem a carta na Vila/Campo e somem fora', () => {
  let { g, uids } = villageOfSix();
  const [a, b] = uids.filter((uid) => g.players.host.village.find((x) => x.uid === uid)?.cardId !== 'e');
  const act = (action: Parameters<typeof applyGameAction>[2]) => (g = applyGameAction(g, 'host', action, seeded(), ninjas));
  const find = (uid: string) => [...g.players.host.village, ...g.players.host.battlefield].find((x) => x.uid === uid);

  const logBefore = g.log!.length;
  act({ type: 'setCoins', uid: a, kind: 'Growth', delta: 1 });
  act({ type: 'setCoins', uid: a, kind: 'Growth', delta: 1 });
  act({ type: 'setCoins', uid: a, kind: ' "Bomb" ', delta: 1 }); // nome arrumado
  assert.deepEqual(find(a)?.coins, { Growth: 2, Bomb: 1 });
  // Cliques seguidos no mesmo tipo viram uma jogada só.
  assert.equal(g.log!.length, logBefore + 2);
  assert.equal(g.log!.at(-2)!.delta, 2);
  assert.equal(g.log!.at(-2)!.coin, 'Growth');

  // Juntar ao Time, ferir, ir para o Campo e trocar o Líder mantêm as moedas.
  act({ type: 'joinTeam', uid: a, target: b });
  act({ type: 'setInjured', uid: a, injured: true });
  act({ type: 'moveTeam', uid: b, to: 'battlefield' });
  act({ type: 'setLeader', uid: a });
  act({ type: 'adjustPower', uid: a, delta: 1 });
  assert.deepEqual(find(a)?.coins, { Growth: 2, Bomb: 1 });

  // Tirar até zerar apaga o tipo; tirar de um tipo que não há não faz nada.
  act({ type: 'setCoins', uid: a, kind: 'Bomb', delta: -5 });
  assert.deepEqual(find(a)?.coins, { Growth: 2 });
  const same = g;
  act({ type: 'setCoins', uid: a, kind: 'Poison', delta: -1 });
  assert.equal(g, same);

  // Fora da Vila/Campo, as moedas somem.
  act({ type: 'move', uid: a, to: 'hand' });
  assert.equal(g.players.host.hand.find((x) => x.uid === a)?.coins, undefined);
  assert.throws(() => act({ type: 'setCoins', uid: a, kind: 'Growth', delta: 1 }), /Vila ou no Campo/);

  assert.deepEqual(parseGameAction({ type: 'setCoins', uid: 'h1', kind: '−1/−1', delta: 2 }), {
    type: 'setCoins',
    uid: 'h1',
    kind: '-1/-1',
    delta: 2,
  });
  assert.equal(parseGameAction({ type: 'setCoins', uid: 'h1', kind: '   ', delta: 1 }), null);
  assert.equal(parseGameAction({ type: 'setCoins', uid: 'h1', kind: 'Growth', delta: 0 }), null);
});

test('Moedas: Missão Permanente (X) entra na Vila com X Moedas Ninja', () => {
  let g = newGame();
  const rules: CardRules = { isNinja: () => false, permanentCoins: (id) => (id === 'a' ? 3 : 0) };
  const mission = g.players.host.hand.find((c) => c.cardId === 'a') ?? g.players.host.deck.find((c) => c.cardId === 'a')!;
  g = applyGameAction(g, 'host', { type: 'move', uid: mission.uid, to: 'chakra' }, seeded(), rules);
  g = applyGameAction(g, 'host', { type: 'move', uid: mission.uid, to: 'village' }, seeded(), rules);
  assert.deepEqual(g.players.host.village.find((c) => c.uid === mission.uid)?.coins, { [NINJA_COIN]: 3 });
  // Reposicionar na Vila não põe as moedas de novo.
  g = applyGameAction(g, 'host', { type: 'setCoins', uid: mission.uid, kind: NINJA_COIN, delta: -1 }, seeded(), rules);
  g = applyGameAction(g, 'host', { type: 'move', uid: mission.uid, to: 'village' }, seeded(), rules);
  assert.deepEqual(g.players.host.village.find((c) => c.uid === mission.uid)?.coins, { [NINJA_COIN]: 2 });
});

test('Moeda Ninja: o servidor sorteia Cara ou Coroa e anota no registro para os dois', () => {
  let g = newGame();
  const before = g.players;
  g = applyGameAction(g, 'guest', { type: 'flip' }, () => 0.1);
  g = applyGameAction(g, 'guest', { type: 'flip' }, () => 0.9);
  assert.equal(g.players, before, 'a mesa não muda');
  assert.deepEqual(
    g.log!.slice(-2).map((e) => [e.who, e.type, e.result]),
    [
      ['guest', 'flip', 'heads'],
      ['guest', 'flip', 'tails'],
    ],
  );
  assert.equal(gameView(g, 'host').log.at(-1)!.result, 'tails');
  assert.deepEqual(parseGameAction({ type: 'flip' }), { type: 'flip' });
});

test('Marcador de Turnos: −/+ só no seu, entre 0 e 10', () => {
  let g = newGame();
  g = applyGameAction(g, 'guest', { type: 'adjustTurn', delta: 1 }, seeded());
  g = applyGameAction(g, 'guest', { type: 'adjustTurn', delta: 1 }, seeded());
  assert.deepEqual(g.turn, { host: 0, guest: 2 });
  assert.equal(g.log!.length, 1, 'cliques seguidos viram uma jogada só');
  assert.equal(g.log!.at(-1)!.delta, 2);
  const same = applyGameAction(g, 'host', { type: 'adjustTurn', delta: -1 }, seeded());
  assert.equal(same, g, 'abaixo de 0 não faz nada');
  g = applyGameAction(g, 'guest', { type: 'adjustTurn', delta: 99 }, seeded());
  assert.equal(g.turn.guest, TURN_MAX);
  assert.deepEqual(parseGameAction({ type: 'adjustTurn', delta: -1 }), { type: 'adjustTurn', delta: -1 });
  assert.equal(parseGameAction({ type: 'adjustTurn', delta: 0 }), null);
});

test('mão para o fundo do Deck: na ordem da mão, sem embaralhar; carta sozinha para o topo ou fundo', () => {
  let g = newGame();
  const deck = g.players.host.deck.map((c) => c.uid);
  const hand = g.players.host.hand.map((c) => c.uid);
  g = applyGameAction(g, 'host', { type: 'returnHand', bottom: true }, seeded(9));
  assert.deepEqual(g.players.host.deck.map((c) => c.uid), [...deck, ...hand], 'o Deck não foi embaralhado');
  assert.equal(g.players.host.hand.length, 0);
  assert.equal(g.log!.at(-1)!.position, 'bottom');
  assert.equal(gameView(g, 'guest').log.at(-1)!.cards, undefined, 'o oponente não vê quais');

  // Uma carta sozinha: topo ou fundo, sem embaralhar o resto.
  g = applyGameAction(g, 'host', { type: 'draw' }, seeded());
  const one = g.players.host.hand[0].uid;
  const rest = g.players.host.deck.map((c) => c.uid);
  g = applyGameAction(g, 'host', { type: 'move', uid: one, to: 'deck', bottom: true }, seeded());
  assert.deepEqual(g.players.host.deck.map((c) => c.uid), [...rest, one]);

  assert.deepEqual(parseGameAction({ type: 'returnHand', bottom: true }), { type: 'returnHand', bottom: true });
  assert.deepEqual(parseGameAction({ type: 'returnHand', bottom: 'x' }), { type: 'returnHand' });
});
