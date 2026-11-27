'use client';

import { useSyncExternalStore } from 'react';
import type { CustomCard } from '@/lib/cardMaker/model';
import type { RoomAction, RoomView } from './model';

/** Cartas criadas dos dois decks da partida e o design escolhido nos decks (`Deck.designs`). */
export interface RoomCards {
  cards: Record<string, CustomCard>;
  /** Lado → carta do catálogo → id da versão (ou `original`). */
  designs?: { host: Record<string, string>; guest: Record<string, string> };
  /** As versões escolhidas, pelo id. */
  versions?: Record<string, CustomCard>;
}

/**
 * Identidade anônima do jogador (docs/SALAS.md): gerada uma vez e guardada no localStorage.
 * O `token` prova quem é o jogador; o servidor guarda só o hash dele.
 */
interface PlayerIdentity {
  playerId: string;
  token: string;
  nickname: string;
  /** Última sala em que o jogador está (para "Voltar para a sala" se ele saiu sem querer). */
  lastRoomId?: string;
}

const IDENTITY_KEY = 'naruto-ccg:player';

let memoryIdentity: PlayerIdentity | null = null;

export function getIdentity(): PlayerIdentity {
  if (memoryIdentity) return memoryIdentity;
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<PlayerIdentity>) : null;
    if (parsed?.playerId && parsed.token) {
      memoryIdentity = {
        playerId: parsed.playerId,
        token: parsed.token,
        nickname: parsed.nickname ?? '',
        ...(parsed.lastRoomId ? { lastRoomId: parsed.lastRoomId } : {}),
      };
      return memoryIdentity;
    }
  } catch {
    // storage bloqueado: segue só em memória
  }
  memoryIdentity = { playerId: crypto.randomUUID(), token: crypto.randomUUID(), nickname: '' };
  saveIdentity();
  return memoryIdentity;
}

function saveIdentity() {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(memoryIdentity));
  } catch {
    // idem
  }
}

/**
 * Troca o token da identidade (o "código da conta" de outro navegador): os decks e as cartas na nuvem passam a ser os
 * daquela conta. A sala em que estava fica esquecida (o lugar nela é do token antigo).
 */
export function setIdentityToken(token: string) {
  const identity = getIdentity();
  identity.token = token;
  delete identity.lastRoomId;
  saveIdentity();
}

const nicknameListeners = new Set<() => void>();

/** Guarda o apelido neste navegador e avisa quem mostra (o campo do cabeçalho, as salas). */
export function rememberNickname(nickname: string) {
  if (getIdentity().nickname === nickname) return;
  getIdentity().nickname = nickname;
  saveIdentity();
  nicknameListeners.forEach((l) => l());
}

/** O apelido atual (vazio no servidor e enquanto o jogador não escolheu um). */
export function useNickname(): string {
  return useSyncExternalStore(
    (listener) => {
      nicknameListeners.add(listener);
      return () => nicknameListeners.delete(listener);
    },
    () => getIdentity().nickname,
    () => '',
  );
}

/**
 * Grava o apelido na conta (`/api/me/nickname`: vale como criador dos temas, sleeves e cartas e nas salas novas) e
 * troca o da sala em que o jogador está (jogada `rename`), para a arena mostrar o novo na hora.
 */
export async function saveNickname(nickname: string): Promise<void> {
  rememberNickname(nickname);
  await request<{ nickname: string }>('/api/me/nickname', { method: 'PUT', body: JSON.stringify({ nickname }) });
  const room = lastRoomId();
  if (room) await roomApi.act(room, { type: 'rename', nickname }).catch(() => undefined);
}

/**
 * Acerta o apelido entre o navegador e a conta: o da conta vale (outro navegador com o mesmo código da conta pode ter
 * trocado); a conta sem apelido recebe o deste navegador (o informado ao entrar, em `/entrar`, ou o que ele usava nas
 * salas antes do apelido na conta).
 */
export async function syncNickname(): Promise<void> {
  const { nickname } = await request<{ nickname: string }>('/api/me/nickname');
  if (nickname) rememberNickname(nickname);
  else if (getIdentity().nickname) await saveNickname(getIdentity().nickname);
}

/** Guarda a sala em que o jogador está agora. */
export function rememberRoom(id: string) {
  const identity = getIdentity();
  if (identity.lastRoomId === id) return;
  identity.lastRoomId = id;
  saveIdentity();
}

/** Esquece a sala (saiu pelo botão Sair, ou ela não existe mais). */
export function forgetRoom(id: string) {
  const identity = getIdentity();
  if (identity.lastRoomId !== id) return;
  delete identity.lastRoomId;
  saveIdentity();
}

export function lastRoomId(): string | null {
  return getIdentity().lastRoomId ?? null;
}

export class RoomRequestError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T = RoomView>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Player-Token': getIdentity().token, ...init?.headers },
    });
  } catch {
    throw new RoomRequestError(0, 'Sem conexão com o servidor. Verifique a internet.');
  }
  const data = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!res.ok) throw new RoomRequestError(res.status, data?.message ?? 'Erro inesperado. Tente de novo.');
  return data as T;
}

function seatBody(nickname: string) {
  const { playerId, token } = getIdentity();
  return JSON.stringify({ playerId, token, nickname });
}

export const roomApi = {
  create: (nickname: string) => request('/api/rooms', { method: 'POST', body: seatBody(nickname) }),
  get: (id: string, ping: boolean) => request(`/api/rooms/${id}${ping ? '?ping=1' : ''}`),
  join: (id: string, nickname: string) => request(`/api/rooms/${id}/join`, { method: 'POST', body: seatBody(nickname) }),
  /** `null` quando a ação apagou a sala (o último jogador saiu). */
  act: (id: string, action: RoomAction) =>
    request<RoomView | null>(`/api/rooms/${id}/actions`, { method: 'POST', body: JSON.stringify(action) }),
  /** Conteúdo do seu deck (ids na ordem do deck, do topo para o fundo) para buscar uma carta. */
  deck: (id: string) => request<{ cards: string[] }>(`/api/rooms/${id}/deck`),
  /** Cartas criadas dos dois decks da partida (id no deck → carta). */
  customCards: (id: string) => request<RoomCards>(`/api/rooms/${id}/custom-cards`),
};
