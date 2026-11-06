import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../../data/cards.ts';
import { deckNameKey } from '../../models/card.ts';
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
} from './model.ts';

const lookup = (id: string) => CARDS_BY_ID.get(id);
const NOW = '2026-11-06T12:00:00.000Z';

/** Deck válido: 50 cartas com nomes diferentes, 1 cópia de cada. */
function validDeck(name: string, offset = 0): SharedDeck {
  const seen = new Set<string>();
  const cards: Record<string, number> = {};
  for (const c of CARDS.slice(offset)) {
    const key = deckNameKey(c);
    if (seen.has(key)) continue;
    seen.add(key);
    cards[c.id] = 1;
    if (seen.size === 50) break;
  }
  return { name, cards };
}

const host: Joiner = { playerId: 'p-host', tokenHash: 'h-host', nickname: 'Naruto' };
const guest: Joiner = { playerId: 'p-guest', tokenHash: 'h-guest', nickname: 'Sasuke' };

/** Sala com os dois jogadores já com deck escolhido. */
function lobbyWithDecks() {
  let room = joinRoom(createRoom('r1', host, NOW), guest, NOW);
  room = applyAction(room, 'host', { type: 'changeDeck', deck: validDeck('Konoha') }, NOW);
  return applyAction(room, 'guest', { type: 'changeDeck', deck: validDeck('Uchiha', 500) }, NOW);
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
  expectRoomError(() => applyAction(room, 'host', { type: 'setReady', ready: true }, NOW), 409);

  // O anfitrião pode escolher o deck antes de o oponente chegar.
  const waiting = applyAction(createRoom('r2', host, NOW), 'host', { type: 'changeDeck', deck: validDeck('Konoha') }, NOW);
  assert.equal(waiting.host.deck?.name, 'Konoha');
  assert.equal(waiting.status, 'waiting');
});

test('salas: os dois prontos iniciam; trocar de deck desmarca o pronto', () => {
  let room = lobbyWithDecks();
  room = applyAction(room, 'host', { type: 'setReady', ready: true }, NOW);
  assert.equal(room.status, 'lobby');

  const changed = applyAction(room, 'host', { type: 'changeDeck', deck: validDeck('Outro', 1000) }, NOW);
  assert.equal(changed.host.ready, false);
  assert.equal(changed.host.deck?.name, 'Outro');

  room = applyAction(room, 'guest', { type: 'setReady', ready: true }, NOW);
  assert.equal(room.status, 'starting');
  expectRoomError(() => applyAction(room, 'guest', { type: 'setReady', ready: false }, NOW), 409);
});

test('salas: convidado sai libera a vaga; anfitrião sai encerra', () => {
  let room = lobbyWithDecks();
  room = applyAction(room, 'host', { type: 'setReady', ready: true }, NOW);

  const left = applyAction(room, 'guest', { type: 'leave' }, NOW);
  assert.equal(left.status, 'waiting');
  assert.equal(left.guest, null);
  assert.equal(left.host.ready, false);
  assert.equal(joinRoom(left, { ...guest, tokenHash: 'h-novo' }, NOW).status, 'lobby');

  const closed = applyAction(room, 'host', { type: 'leave' }, NOW);
  assert.equal(closed.status, 'closed');
  assert.equal(closed.closedReason, 'host-left');
  expectRoomError(() => joinRoom(closed, { ...guest, tokenHash: 'h-novo' }, NOW), 409);
  expectRoomError(() => applyAction(closed, 'guest', { type: 'setReady', ready: true }, NOW), 409);
});

test('salas: a visão esconde tokens e o deck do oponente', () => {
  const nowMs = Date.parse(NOW);
  const noDeck = toView(joinRoom(createRoom('r1', host, NOW), guest, NOW), 'host', {}, nowMs);
  assert.deepEqual(noDeck.players.map((p) => [p.deckName, p.deckSize]), [[null, 0], [null, 0]]);
  assert.equal(noDeck.yourDeck, null);

  const room = lobbyWithDecks();
  const view = toView(room, 'guest', { 'h-host': nowMs - 1000 }, nowMs);

  assert.equal(view.you, 'guest');
  assert.equal(view.yourDeck?.name, 'Uchiha');
  assert.deepEqual(
    view.players.map((p) => [p.seat, p.nickname, p.deckName, p.deckSize, p.online]),
    [
      ['host', 'Naruto', 'Konoha', 50, true],
      ['guest', 'Sasuke', 'Uchiha', 50, false],
    ],
  );
  const json = JSON.stringify(toView(room, null, {}, nowMs));
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
