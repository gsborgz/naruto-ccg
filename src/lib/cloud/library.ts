'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { CustomCard } from '../cardMaker/model.ts';
import { migrateCustomCard } from '../cardMaker/model.ts';
import { ORIGINAL_DESIGN, type Deck } from '../decks/types.ts';
import { getIdentity } from '../rooms/client.ts';

/**
 * O que o jogador tem na nuvem, do lado do navegador: os decks e as cartas do criador (as dele e as de outros
 * jogadores que os decks usam). Nada disso fica no navegador: só a identidade anônima (`naruto-ccg:player`), que diz
 * de quem são os dados (o "código da conta", ver `switchAccount`).
 *
 * Carrega uma vez (`GET /api/me`) quando alguma tela pede; as gravações atualizam a memória na hora e vão para o
 * servidor em seguida (`cloudRequest`). Se uma gravação falhar, avisa e recarrega da nuvem.
 *
 * Antes da nuvem, os decks e as cartas ficavam no localStorage (`naruto-ccg:decks`, `naruto-ccg:custom-cards`): na
 * primeira carga, eles são enviados (`/api/me/import`) e apagados do navegador.
 */

export interface OtherCard {
  card: CustomCard;
  author: string;
}

export interface Library {
  decks: Deck[];
  /** As cartas do criador deste jogador, da mais nova para a mais antiga. */
  mine: CustomCard[];
  /** Cartas de outros jogadores que os decks usam ou escolheram como design. */
  others: Map<string, OtherCard>;
}

export class CloudError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Pedido ao servidor com a identidade do jogador. */
export async function cloudRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Player-Token': getIdentity().token, ...init.headers },
    });
  } catch {
    throw new CloudError(0, 'Sem conexão com o servidor.');
  }
  const body = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!res.ok) throw new CloudError(res.status, body?.message ?? `Erro ${res.status} no servidor.`);
  return body as T;
}

let state: Library | null = null;
let loading: Promise<void> | null = null;
let failed: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function set(next: Library) {
  state = next;
  emit();
}

const LEGACY = {
  decks: 'naruto-ccg:decks',
  cards: 'naruto-ccg:custom-cards',
  /** Chaves antigas sem uso: apagadas junto. */
  stale: ['naruto-ccg:art-refs-synced', 'naruto-ccg:card-design', 'naruto-ccg:art-choices'],
} as const;

function readLegacy(): { decks: Deck[]; cards: CustomCard[] } | null {
  try {
    const decks = JSON.parse(localStorage.getItem(LEGACY.decks) ?? 'null') as { decks?: Deck[] } | null;
    const cards = JSON.parse(localStorage.getItem(LEGACY.cards) ?? 'null') as { cards?: CustomCard[] } | null;
    for (const k of LEGACY.stale) localStorage.removeItem(k);
    if (!decks && !cards) return null;
    return {
      decks: Array.isArray(decks?.decks) ? decks.decks : [],
      cards: Array.isArray(cards?.cards) ? cards.cards.map(migrateCustomCard) : [],
    };
  } catch {
    return null;
  }
}

/** Envia para a nuvem os decks e as cartas que estavam só no navegador; só apaga do navegador se deu certo. */
async function migrateLegacy(): Promise<void> {
  const legacy = readLegacy();
  if (!legacy) return;
  // As artes que ainda estavam só no navegador (data URL) vão para o Blob antes.
  const { uploadCardArt } = await import('../cardMaker/artUpload.ts');
  const cards: CustomCard[] = [];
  for (const c of legacy.cards) cards.push(await uploadCardArt(c).catch(() => c));
  await cloudRequest('/api/me/import', {
    method: 'POST',
    body: JSON.stringify({ decks: legacy.decks, cards, author: getIdentity().nickname }),
  });
  try {
    localStorage.removeItem(LEGACY.decks);
    localStorage.removeItem(LEGACY.cards);
  } catch {
    // nada a fazer
  }
}

async function fetchLibrary(): Promise<void> {
  await migrateLegacy().catch((e) => console.error('Falha ao levar os dados do navegador para a nuvem', e));
  const data = await cloudRequest<{ decks: Deck[]; cards: CustomCard[]; others: OtherCard[] }>('/api/me');
  failed = null;
  set({
    decks: data.decks,
    mine: data.cards.map(migrateCustomCard),
    others: new Map(data.others.map((o) => [o.card.id, { ...o, card: migrateCustomCard(o.card) }])),
  });
}

/** Carrega (ou recarrega) da nuvem. */
export function reloadLibrary(): Promise<void> {
  loading ??= fetchLibrary()
    .catch((e: Error) => {
      failed = e.message;
      emit();
    })
    .finally(() => {
      loading = null;
    });
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A biblioteca do jogador (`null` enquanto carrega e no servidor). Pede a carga na primeira vez. */
export function useLibrary(): Library | null {
  const lib = useSyncExternalStore(subscribe, () => state, () => null);
  useEffect(() => {
    if (!state && !loading) void reloadLibrary();
  }, []);
  return lib;
}

/** Mensagem do erro da última carga (sem conexão etc.), ou null. */
export function useLibraryError(): string | null {
  return useSyncExternalStore(subscribe, () => failed, () => null);
}

/** A biblioteca agora (fora do React); vazia antes de carregar. */
export function currentLibrary(): Library {
  return state ?? { decks: [], mine: [], others: new Map() };
}

/**
 * Muda a biblioteca na memória e grava no servidor. Se a gravação falhar, avisa e recarrega da nuvem (a mudança some).
 */
export function updateLibrary(change: (lib: Library) => Library, persist: () => Promise<unknown>): Promise<boolean> {
  set(change(currentLibrary()));
  return persist().then(
    () => true,
    (e: Error) => {
      alert(`Não foi possível salvar na nuvem: ${e.message}`);
      void reloadLibrary();
      return false;
    },
  );
}

/** Busca na nuvem cartas de outros jogadores que ainda não estão na memória (ex.: de um deck importado). */
export async function fetchOtherCards(ids: string[]): Promise<void> {
  const lib = currentLibrary();
  const missing = [...new Set(ids)].filter(
    (id) => id !== ORIGINAL_DESIGN && !lib.others.has(id) && !lib.mine.some((c) => c.id === id),
  );
  if (!missing.length) return;
  const { items } = await cloudRequest<{ items: (OtherCard & { owner: string })[] }>(
    `/api/custom-cards?ids=${missing.map(encodeURIComponent).join(',')}`,
  );
  const others = new Map(currentLibrary().others);
  const mine = [...currentLibrary().mine];
  for (const i of items) {
    const card = migrateCustomCard(i.card);
    // As do jogador (ex.: cartas de um código compartilhado que acabaram de passar a ser dele) vão para as dele.
    if (i.owner === 'mine') mine.unshift(card);
    else others.set(card.id, { card, author: i.author });
  }
  set({ ...currentLibrary(), mine, others });
}

/** Guarda na memória cartas de outros jogadores já buscadas (ex.: as versões escolhidas no montador). */
export function rememberOtherCards(items: { card: CustomCard; author: string; owner: string }[]): void {
  const lib = currentLibrary();
  const others = new Map(lib.others);
  let changed = false;
  for (const i of items) {
    if (i.owner === 'mine' || others.has(i.card.id)) continue;
    others.set(i.card.id, { card: i.card, author: i.author });
    changed = true;
  }
  if (changed) set({ ...lib, others });
}

/**
 * Código da conta: o token da identidade anônima. Mostrado para o jogador abrir os mesmos decks e cartas em outro
 * navegador; usar o código de outro navegador troca a identidade deste e recarrega da nuvem.
 */
export function accountCode(): string {
  return getIdentity().token;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function switchAccount(code: string): Promise<void> {
  const token = code.trim().toLowerCase();
  if (!UUID.test(token)) throw new Error('Código inválido: são 36 caracteres, como 1234abcd-…');
  const { setIdentityToken } = await import('../rooms/client.ts');
  setIdentityToken(token);
  state = null;
  emit();
  await reloadLibrary();
}
