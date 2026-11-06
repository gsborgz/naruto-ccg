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
}

const IDENTITY_KEY = 'naruto-ccg:player';

let memoryIdentity: PlayerIdentity | null = null;

export function getIdentity(): PlayerIdentity {
  if (memoryIdentity) return memoryIdentity;
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<PlayerIdentity>) : null;
    if (parsed?.playerId && parsed.token) {
      memoryIdentity = { playerId: parsed.playerId, token: parsed.token, nickname: parsed.nickname ?? '' };
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

export class RoomRequestError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request(url: string, init?: RequestInit): Promise<RoomView> {
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
  const data = (await res.json().catch(() => ({}))) as RoomView & { message?: string };
  if (!res.ok) throw new RoomRequestError(res.status, data.message ?? 'Erro inesperado. Tente de novo.');
  return data;
}

function seatBody(nickname: string) {
  const { playerId, token } = getIdentity();
  return JSON.stringify({ playerId, token, nickname });
}

export const roomApi = {
  create: (nickname: string) => request('/api/rooms', { method: 'POST', body: seatBody(nickname) }),
  get: (id: string, ping: boolean) => request(`/api/rooms/${id}${ping ? '?ping=1' : ''}`),
  join: (id: string, nickname: string) => request(`/api/rooms/${id}/join`, { method: 'POST', body: seatBody(nickname) }),
  act: (id: string, action: RoomAction) =>
    request(`/api/rooms/${id}/actions`, { method: 'POST', body: JSON.stringify(action) }),
};
