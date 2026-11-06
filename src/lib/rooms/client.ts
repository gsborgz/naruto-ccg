'use client';

import type { RoomAction, RoomView } from './model';

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

/** Lembra o último apelido usado, para preencher o campo da próxima vez. */
export function rememberNickname(nickname: string) {
  getIdentity().nickname = nickname;
  saveIdentity();
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
  /** Conteúdo do seu deck (quantidade por carta, sem a ordem) para buscar uma carta. */
  deck: (id: string) => request<{ cards: Record<string, number> }>(`/api/rooms/${id}/deck`),
};
