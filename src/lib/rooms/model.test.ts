import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../../data/cards.ts';
import { deckNameKey, isReinforcementCard } from '../../models/card.ts';
import type { SharedDeck } from '../deckShare.ts';
import {
  applyAction,
  createRoom,
  joinRoom,
  parseNickname,
  parseRoomAction,
  parseRoomDeck,
  RoomError,
  seatOf,
  toView,
  type Joiner,
  type Room,
  type RoomAction,
  type SeatName,
} from './model.ts';

const lookup = (id: string) => CARDS_BY_ID.get(id);
const NOW = '2026-11-06T12:00:00.000Z';

/** Deck válido: 50 cartas com nomes diferentes, 1 cópia de cada (sem cartas do Baralho de Reforço). */
function validDeck(name: string, offset = 0): SharedDeck {
  const seen = new Set<string>();
  const cards: Record<string, number> = {};
  for (const c of CARDS.slice(offset)) {
    if (isReinforcementCard(c)) continue;
    const key = deckNameKey(c);
    if (seen.has(key)) continue;
    seen.add(key);
    cards[c.id] = 1;
    if (seen.size === 50) break;
  }
  return { name, cards };
}

/** `applyAction` para ações que nunca apagam a sala. */
function act(room: Room, who: SeatName, action: RoomAction): Room {
  const next = applyAction(room, who, action, NOW);
  assert.ok(next, 'a sala não deveria ter sido apagada');
  return next;
}

const host: Joiner = { playerId: 'p-host', tokenHash: 'h-host', nickname: 'Naruto' };
const guest: Joiner = { playerId: 'p-guest', tokenHash: 'h-guest', nickname: 'Sasuke' };

/** Sala com os dois jogadores já com deck escolhido. */
function lobbyWithDecks() {
  let room = joinRoom(createRoom('r1', host, NOW), guest, NOW);
  room = act(room, 'host', { type: 'changeDeck', deck: validDeck('Konoha') });
  return act(room, 'guest', { type: 'changeDeck', deck: validDeck('Uchiha', 500) });
}

function expectRoomError(fn: () => unknown, status: number) {
  assert.throws(fn, (e) => e instanceof RoomError && e.status === status);
}

test('salas: criar, entrar e reconectar', () => {
  const room = createRoom('r1', host, NOW);
  assert.equal(room.status, 'waiting');
  assert.equal(seatOf(room, 'h-host'), 'host');

  const joined = joinRoom(room, guest, NOW);
  assert.equal(joined.status, 'lobby');
  assert.equal(joined.rev, room.rev + 1);
  assert.equal(seatOf(joined, 'h-guest'), 'guest');

  // Mesmo token entrando de novo (recarregou a página): nada muda. O anfitrião não vira convidado.
  assert.equal(joinRoom(joined, guest, NOW), joined);
  assert.equal(joinRoom(room, host, NOW), room);

  expectRoomError(() => joinRoom(joined, { ...guest, tokenHash: 'h-outro' }, NOW), 409);
});

test('salas: o deck é escolhido dentro da sala e é exigido para marcar Pronto', () => {
  const room = joinRoom(createRoom('r1', host, NOW), guest, NOW);
  assert.equal(room.host.deck, null);
  assert.equal(room.guest?.deck, null);
  expectRoomError(() => act(room, 'host', { type: 'setReady', ready: true }), 409);

  // O anfitrião pode escolher o deck antes de o oponente chegar.
  const waiting = act(createRoom('r2', host, NOW), 'host', { type: 'changeDeck', deck: validDeck('Konoha') });
  assert.equal(waiting.host.deck?.name, 'Konoha');
  assert.equal(waiting.status, 'waiting');
});

test('salas: os dois prontos iniciam; trocar de deck desmarca o pronto', () => {
  let room = lobbyWithDecks();
  room = act(room, 'host', { type: 'setReady', ready: true });
  assert.equal(room.status, 'lobby');

  const changed = act(room, 'host', { type: 'changeDeck', deck: validDeck('Outro', 1000) });
  assert.equal(changed.host.ready, false);
  assert.equal(changed.host.deck?.name, 'Outro');

  room = act(room, 'guest', { type: 'setReady', ready: true });
  assert.equal(room.status, 'starting');
  expectRoomError(() => act(room, 'guest', { type: 'setReady', ready: false }), 409);
});

test('salas: quem sai libera a vaga; quem fica vira anfitrião; o último a sair apaga a sala', () => {
  let room = lobbyWithDecks();
  room = act(room, 'host', { type: 'setReady', ready: true });

  // Convidado sai: a vaga fica livre e o anfitrião volta a esperar (sem Pronto).
  const guestLeft = act(room, 'guest', { type: 'leave' });
  assert.equal(guestLeft.status, 'waiting');
  assert.equal(guestLeft.guest, null);
  assert.equal(guestLeft.host.ready, false);
  assert.equal(joinRoom(guestLeft, { ...guest, tokenHash: 'h-novo' }, NOW).status, 'lobby');

  // Anfitrião sai com o convidado na sala: o convidado vira anfitrião (a sala continua).
  const hostLeft = act(room, 'host', { type: 'leave' });
  assert.equal(hostLeft.status, 'waiting');
  assert.equal(hostLeft.host.nickname, 'Sasuke');
  assert.equal(hostLeft.host.deck?.name, 'Uchiha');
  assert.equal(hostLeft.guest, null);
  assert.equal(seatOf(hostLeft, 'h-guest'), 'host');
  assert.equal(seatOf(hostLeft, 'h-host'), null);

  // O último jogador sai: a sala deve ser apagada.
  assert.equal(applyAction(hostLeft, 'host', { type: 'leave' }, NOW), null);
  assert.equal(applyAction(createRoom('r3', host, NOW), 'host', { type: 'leave' }, NOW), null);
});

test('salas: a visão esconde tokens e o deck do oponente', () => {
  const nowMs = Date.parse(NOW);
  const noDeck = toView(joinRoom(createRoom('r1', host, NOW), guest, NOW), 'host', {}, nowMs, lookup);
  assert.deepEqual(noDeck.players.map((p) => [p.deckName, p.deckSize]), [[null, 0], [null, 0]]);
  assert.equal(noDeck.yourDeck, null);

  const room = lobbyWithDecks();
  const view = toView(room, 'guest', { 'h-host': nowMs - 1000 }, nowMs, lookup);

  assert.equal(view.you, 'guest');
  assert.equal(view.yourDeck?.name, 'Uchiha');
  assert.deepEqual(
    view.players.map((p) => [p.seat, p.nickname, p.deckName, p.deckSize, p.online]),
    [
      ['host', 'Naruto', 'Konoha', 50, true],
      ['guest', 'Sasuke', 'Uchiha', 50, false],
    ],
  );
  // O Baralho de Reforço não conta nas 50, mas o tamanho dele é público.
  assert.deepEqual(view.players.map((p) => p.reinforcementSize), [0, 0]);
  const withSquad = act(
    room,
    'host',
    { type: 'changeDeck', deck: { name: 'Konoha', cards: { ...validDeck('Konoha').cards, 's13-n-549': 2 } } },
  );
  const hostView = toView(withSquad, 'guest', {}, nowMs, lookup).players[0];
  assert.deepEqual([hostView.deckSize, hostView.reinforcementSize], [50, 2]);

  const json = JSON.stringify(toView(room, null, {}, nowMs, lookup));
  assert.ok(!json.includes('h-host') && !json.includes('p-host') && !json.includes('"cards"'));
});

test('salas: validação de apelido, deck e ação', () => {
  assert.equal(parseNickname('  Rock   Lee '), 'Rock Lee');
  assert.equal(parseNickname(''), null);
  assert.equal(parseNickname('x'.repeat(25)), null);

  assert.equal(parseRoomDeck(validDeck('Ok'), lookup).name, 'Ok');
  const short = { name: 'Curto', cards: { [CARDS[0].id]: 1 } };
  expectRoomError(() => parseRoomDeck(short, lookup), 400);
  expectRoomError(() => parseRoomDeck({ name: 'X', cards: { inexistente: 1 } }, lookup), 400);

  assert.deepEqual(parseRoomAction({ type: 'setReady', ready: true }, lookup), { type: 'setReady', ready: true });
  expectRoomError(() => parseRoomAction({ type: 'hack' }, lookup), 400);
});

test('salas: a partida começa com os decks carregados, aceita jogadas e pode ser encerrada', () => {
  let room = lobbyWithDecks();
  room = act(room, 'host', { type: 'setReady', ready: true });
  expectRoomError(() => act(room, 'host', { type: 'game', action: { type: 'draw' } }), 409); // antes de começar
  room = act(room, 'guest', { type: 'setReady', ready: true });

  assert.equal(room.status, 'starting');
  assert.ok(room.game);
  assert.equal(room.game.players.host.hand.length, 6);
  assert.equal(room.game.players.host.deck.length, 44);

  const uid = room.game.players.host.hand[0].uid;
  room = act(room, 'host', { type: 'game', action: { type: 'move', uid, to: 'village' } });
  room = act(room, 'host', { type: 'game', action: { type: 'draw' } });
  assert.equal(room.game?.players.host.village[0].uid, uid);
  assert.equal(room.game?.players.host.hand.length, 6);

  // Cada um vê a própria mão e só a contagem da mão do outro.
  const asGuest = toView(room, 'guest', {}, Date.parse(NOW), lookup).game!;
  assert.equal(asGuest.players.host.hand.cards, undefined);
  assert.equal(asGuest.players.host.village.cards?.[0].uid, uid);
  assert.equal(asGuest.players.guest.hand.cards?.length, 6);

  // Mexer em carta do oponente é recusado.
  const theirs = room.game!.players.guest.hand[0].uid;
  expectRoomError(() => act(room, 'host', { type: 'game', action: { type: 'move', uid: theirs, to: 'discard' } }), 409);

  // Encerrar volta para a escolha de decks.
  const ended = act(room, 'guest', { type: 'endGame' });
  assert.equal(ended.status, 'lobby');
  assert.equal(ended.game, null);
  assert.equal(ended.host.ready || ended.guest?.ready, false);
  assert.equal(toView(ended, 'host', {}, Date.parse(NOW), lookup).game, undefined);

  // Sair no meio da partida também a encerra.
  const left = act(room, 'guest', { type: 'leave' });
  assert.equal(left.game, null);
  assert.equal(left.status, 'waiting');
});
