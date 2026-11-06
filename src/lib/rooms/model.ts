import type { Card } from '../../models/card.ts';
import { summarizeDeck } from '../deckRules.ts';
import { parseSharedDeck, type SharedDeck } from '../deckShare.ts';
import {
  applyGameAction,
  createGame,
  GameError,
  gameView,
  parseGameAction,
  type GameAction,
  type GameState,
  type GameView,
  type Rng,
} from '../game/state.ts';

/**
 * Regras das salas de jogo (docs/SALAS.md) em funções puras: sem rede nem Redis.
 * As rotas da API leem a sala, chamam estas funções e gravam o resultado.
 *
 * Ciclo de uma sala: os jogadores entram → cada um escolhe o deck dentro da sala → os dois marcam Pronto →
 * partida (MVP 4) → fim de jogo → voltam a escolher deck. O deck não é escolhido para criar/entrar.
 */

export type SeatName = 'host' | 'guest';
export type RoomStatus = 'waiting' | 'lobby' | 'starting';

export interface Seat {
  playerId: string;
  /** SHA-256 do token do jogador; nunca sai do servidor. */
  tokenHash: string;
  nickname: string;
  /** Cópia validada do deck escolhido na sala, ou `null` enquanto não escolheu (editar o deck depois não muda a sala). */
  deck: SharedDeck | null;
  ready: boolean;
  joinedAt: string;
}

export interface Room {
  version: 1;
  id: string;
  status: RoomStatus;
  /** +1 a cada mudança: sincronização e compare-and-set no Redis. */
  rev: number;
  createdAt: string;
  updatedAt: string;
  host: Seat;
  guest: Seat | null;
  /** Estado da partida enquanto `status === 'starting'` (os dois prontos); `null`/ausente fora dela. */
  game?: GameState | null;
}

export interface PlayerView {
  seat: SeatName;
  nickname: string;
  /** `null` enquanto o jogador não escolheu o deck. */
  deckName: string | null;
  /** Cartas do Deck (sem o Baralho de Reforço). */
  deckSize: number;
  /** Cartas no Baralho de Reforço: ficam viradas para baixo, mas qualquer jogador pode contá-las (docs/REGRAS.md 4.17). */
  reinforcementSize: number;
  ready: boolean;
  online: boolean;
}

/** O que cada jogador recebe: sem tokens e sem a lista de cartas do oponente. */
export interface RoomView {
  id: string;
  status: RoomStatus;
  rev: number;
  you: SeatName | null;
  players: PlayerView[];
  yourDeck?: SharedDeck | null;
  /** A partida como este jogador a vê (cartas escondidas viram só contagem). */
  game?: GameView;
}

export type RoomAction =
  | { type: 'setReady'; ready: boolean }
  | { type: 'changeDeck'; deck: SharedDeck }
  | { type: 'leave' }
  /** Jogada na partida (mover carta, comprar, embaralhar, buscar). */
  | { type: 'game'; action: GameAction }
  /** Encerra a partida e volta para a escolha de decks. */
  | { type: 'endGame' };

/** Dependências de quem aplica as ações: sorteio (embaralhar) e quais cartas vão para o Reforço. */
export interface RoomEnv {
  rng: Rng;
  isReinforcement: (cardId: string) => boolean;
  /** Só Ninjas formam Times. */
  isNinja: (cardId: string) => boolean;
}

const DEFAULT_ENV: RoomEnv = { rng: Math.random, isReinforcement: () => false, isNinja: () => true };

export interface Joiner {
  playerId: string;
  tokenHash: string;
  nickname: string;
}

/** Erro com status HTTP e mensagem em português, pronta para mostrar na tela. */
export class RoomError extends Error {
  readonly status: 400 | 401 | 404 | 409;
  constructor(status: 400 | 401 | 404 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

/** A sala some depois deste tempo sem nenhuma escrita (renovado a cada ação). */
export const ROOM_TTL_SECONDS = 6 * 60 * 60;
/** Um jogador conta como online se consultou a sala há menos que isto. */
export const ONLINE_WINDOW_MS = 15_000;
export const NICKNAME_MAX = 24;

type CardLookup = (id: string) => Card | undefined;

export function parseNickname(x: unknown): string | null {
  if (typeof x !== 'string') return null;
  const name = x.trim().replace(/\s+/g, ' ');
  return name.length >= 1 && name.length <= NICKNAME_MAX ? name : null;
}

/** Deck vindo do navegador: formato válido e dentro das regras de montagem. */
export function parseRoomDeck(x: unknown, lookup: CardLookup): SharedDeck {
  const deck = parseSharedDeck(x, (id) => lookup(id) !== undefined);
  if (!deck) throw new RoomError(400, 'Deck inválido.');
  if (!summarizeDeck(deck.cards, lookup).isValid) {
    throw new RoomError(
      400,
      `O deck "${deck.name}" não segue as regras de montagem (50 cartas, até 3 por nome; Baralho de Reforço com até 15).`,
    );
  }
  return deck;
}

export function parseRoomAction(x: unknown, lookup: CardLookup): RoomAction {
  const a = (typeof x === 'object' && x !== null ? x : {}) as Record<string, unknown>;
  if (a.type === 'setReady' && typeof a.ready === 'boolean') return { type: 'setReady', ready: a.ready };
  if (a.type === 'changeDeck') return { type: 'changeDeck', deck: parseRoomDeck(a.deck, lookup) };
  if (a.type === 'leave') return { type: 'leave' };
  if (a.type === 'endGame') return { type: 'endGame' };
  if (a.type === 'game') {
    const action = parseGameAction(a.action);
    if (action) return { type: 'game', action };
  }
  throw new RoomError(400, 'Ação inválida.');
}


function seat(j: Joiner, now: string): Seat {
  return { playerId: j.playerId, tokenHash: j.tokenHash, nickname: j.nickname, deck: null, ready: false, joinedAt: now };
}

function bump(room: Room, changes: Partial<Room>, now: string): Room {
  return { ...room, ...changes, rev: room.rev + 1, updatedAt: now };
}

export function createRoom(id: string, host: Joiner, now: string): Room {
  return { version: 1, id, status: 'waiting', rev: 1, createdAt: now, updatedAt: now, host: seat(host, now), guest: null };
}

/** Lugar ocupado pelo dono deste token, ou `null` (visitante). */
export function seatOf(room: Room, tokenHash: string | null): SeatName | null {
  if (!tokenHash) return null;
  if (room.host.tokenHash === tokenHash) return 'host';
  if (room.guest?.tokenHash === tokenHash) return 'guest';
  return null;
}

/** Entrar como convidado. Quem já está na sala (mesmo token) só reconecta: a sala não muda. */
export function joinRoom(room: Room, joiner: Joiner, now: string): Room {
  if (seatOf(room, joiner.tokenHash)) return room;
  if (room.guest) throw new RoomError(409, 'Sala cheia: já tem dois jogadores.');
  return bump(room, { guest: seat(joiner, now), status: 'lobby' }, now);
}

/**
 * Aplica a ação de um jogador. Retorna `null` quando a sala deve ser **apagada**
 * (o último jogador saiu pelo botão Sair).
 */
export function applyAction(
  room: Room,
  who: SeatName,
  action: RoomAction,
  now: string,
  env: RoomEnv = DEFAULT_ENV,
): Room | null {
  const me = who === 'host' ? room.host : room.guest;
  if (!me) throw new RoomError(401, 'Você não está nesta sala.');

  if (action.type === 'leave') {
    // Quem fica (se alguém) vira o anfitrião e volta a esperar um oponente; sem ninguém, a sala some.
    const other = who === 'host' ? room.guest : room.host;
    if (!other) return null;
    // Sair no meio da partida a encerra.
    return bump(room, { host: { ...other, ready: false }, guest: null, status: 'waiting', game: null }, now);
  }

  if (action.type === 'game') {
    if (room.status !== 'starting' || !room.game) throw new RoomError(409, 'A partida ainda não começou.');
    try {
      return bump(room, { game: applyGameAction(room.game, who, action.action, env.rng, env) }, now);
    } catch (e) {
      if (e instanceof GameError) throw new RoomError(409, e.message);
      throw e;
    }
  }

  if (action.type === 'endGame') {
    if (room.status !== 'starting') throw new RoomError(409, 'Não há partida em andamento.');
    // Volta para a escolha de decks: os decks continuam escolhidos, ninguém pronto.
    return bump(
      room,
      {
        status: 'lobby',
        game: null,
        host: { ...room.host, ready: false },
        guest: room.guest ? { ...room.guest, ready: false } : null,
      },
      now,
    );
  }

  if (room.status === 'starting') throw new RoomError(409, 'A partida já começou.');

  const update = (s: Seat): Partial<Room> => (who === 'host' ? { host: s } : { guest: s });

  if (action.type === 'changeDeck') {
    return bump(room, update({ ...me, deck: action.deck, ready: false }), now);
  }

  // setReady
  if (action.ready && !me.deck) throw new RoomError(409, 'Escolha um deck antes de marcar Pronto.');
  if (me.ready === action.ready) return room;
  const next = bump(room, update({ ...me, ready: action.ready }), now);
  const bothReady = next.host.ready && next.guest?.ready === true;
  if (!bothReady || !next.host.deck || !next.guest?.deck) return next;
  // Os dois prontos: a partida começa com os decks embaralhados e a mão inicial comprada.
  const game = createGame({ host: next.host.deck.cards, guest: next.guest.deck.cards }, env.isReinforcement, env.rng);
  return { ...next, status: 'starting', game };
}

/** Horário (ms) da última consulta de cada jogador, por hash do token. */
export type SeenMap = Record<string, number>;

export function toView(
  room: Room,
  you: SeatName | null,
  seen: SeenMap,
  nowMs: number,
  lookup: CardLookup,
): RoomView {
  const player = (name: SeatName, s: Seat): PlayerView => {
    const summary = s.deck ? summarizeDeck(s.deck.cards, lookup) : null;
    return {
      seat: name,
      nickname: s.nickname,
      deckName: s.deck?.name ?? null,
      deckSize: summary?.total ?? 0,
      reinforcementSize: summary?.reinforcement ?? 0,
      ready: s.ready,
      online: nowMs - (seen[s.tokenHash] ?? 0) < ONLINE_WINDOW_MS,
    };
  };
  const players = [player('host', room.host)];
  if (room.guest) players.push(player('guest', room.guest));
  const mine = you === 'host' ? room.host : you === 'guest' ? room.guest : null;
  return {
    id: room.id,
    status: room.status,
    rev: room.rev,
    you,
    players,
    ...(mine ? { yourDeck: mine.deck } : {}),
    ...(room.status === 'starting' && room.game ? { game: gameView(room.game, you) } : {}),
  };
}
