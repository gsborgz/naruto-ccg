'use client';

import { useSyncExternalStore } from 'react';
import { acceptsAltArt, parseAltArtPlacement, placementOf, type AltArtPlacement, type AltArtView } from './altArts.ts';
import type { DeckCards } from './deckRules.ts';
import { getIdentity } from './rooms/client.ts';

/**
 * Artes alternativas no navegador (README, "Artes alternativas"): a API (todo mundo vê as artes de cada carta) e a
 * escolha deste navegador de qual arte usar em cada carta (localStorage `naruto-ccg:art-choices`). A escolha guarda
 * a imagem e o enquadramento, então a listagem não precisa consultar o servidor.
 */

export type ArtChoice = AltArtPlacement & { id: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', 'X-Player-Token': getIdentity().token },
    });
  } catch {
    throw new Error('Sem conexão com o servidor.');
  }
  const body = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!res.ok) throw new Error(body?.message ?? 'Erro nas artes alternativas.');
  return body as T;
}

export const altArtApi = {
  list: async (cardId: string) =>
    (await request<{ arts: AltArtView[] }>(`/api/alt-arts?card=${encodeURIComponent(cardId)}`)).arts,
  add: async (cardId: string, placement: AltArtPlacement) =>
    (await request<{ art: AltArtView }>('/api/alt-arts', { method: 'POST', body: JSON.stringify({ cardId, ...placement }) }))
      .art,
  remove: (cardId: string, id: string) =>
    request('/api/alt-arts', { method: 'DELETE', body: JSON.stringify({ cardId, id }) }),
};

// --- Escolha deste navegador ---

const STORAGE_KEY = 'naruto-ccg:art-choices';
const EMPTY: Record<string, ArtChoice> = {};

let cache: Record<string, ArtChoice> | null = null;
const listeners = new Set<() => void>();

function read(): Record<string, ArtChoice> {
  if (cache) return cache;
  cache = {};
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, unknown>;
    for (const [cardId, value] of Object.entries(raw ?? {})) {
      const placement = parseAltArtPlacement(value);
      const id = (value as { id?: unknown } | null)?.id;
      if (placement && typeof id === 'string') cache[cardId] = { ...placement, id };
    }
  } catch {
    // Sem localStorage (ou dado corrompido): nenhuma escolha.
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Todas as escolhas deste navegador (carta → arte). No servidor, nenhuma. */
export function useArtChoices(): Record<string, ArtChoice> {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** A arte escolhida para a carta, ou `undefined` para a original. */
export function useChosenArt(cardId: string): ArtChoice | undefined {
  return useArtChoices()[cardId];
}

/** Escolhe a arte da carta (`null` volta para a original). */
export function chooseArt(cardId: string, art: ArtChoice | null) {
  if (!acceptsAltArt(cardId)) return;
  const next = { ...read() };
  if (art) next[cardId] = { id: art.id, ...placementOf(art) };
  else delete next[cardId];
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem persistência: vale até recarregar a página.
  }
  listeners.forEach((l) => l());
}

/** As artes escolhidas para as cartas do deck, para levar para a sala (`SharedDeck.arts`). */
export function chosenArtsFor(cards: DeckCards): Record<string, AltArtPlacement> | undefined {
  const choices = read();
  const arts: Record<string, AltArtPlacement> = {};
  for (const cardId of Object.keys(cards)) {
    const c = choices[cardId];
    if (c) arts[cardId] = placementOf(c);
  }
  return Object.keys(arts).length > 0 ? arts : undefined;
}
