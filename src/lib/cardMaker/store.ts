'use client';

import { useSyncExternalStore } from 'react';
import type { CustomCard } from './model.ts';

/** Cartas do criador, no localStorage (a arte vai junto, como data URL reduzida). */
interface StoredData {
  version: 1;
  cards: CustomCard[];
}

const STORAGE_KEY = 'naruto-ccg:custom-cards';

let cache: CustomCard[] | null = null;
const listeners = new Set<() => void>();

function read(): CustomCard[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredData) : null;
    cache = parsed?.version === 1 && Array.isArray(parsed.cards) ? parsed.cards : [];
  } catch {
    cache = [];
  }
  return cache;
}

/** Grava e avisa quem está ouvindo. Retorna false se o navegador recusou (ex.: storage cheio). */
function write(cards: CustomCard[]): boolean {
  cache = cards;
  let ok = true;
  try {
    const data: StoredData = { version: 1, cards };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    ok = false; // Mantém em memória nesta sessão.
  }
  listeners.forEach((l) => l());
  return ok;
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

/** Cartas criadas, sincronizadas entre abas. `null` durante o SSR. */
export function useCustomCards(): CustomCard[] | null {
  return useSyncExternalStore<CustomCard[] | null>(subscribe, read, () => null);
}

export const customCardActions = {
  /** Cria ou atualiza. Retorna false se não coube no armazenamento do navegador. */
  save(card: CustomCard): boolean {
    const cards = read();
    const updated = { ...card, updatedAt: new Date().toISOString() };
    const exists = cards.some((c) => c.id === card.id);
    return write(exists ? cards.map((c) => (c.id === card.id ? updated : c)) : [updated, ...cards]);
  },
  remove(id: string) {
    write(read().filter((c) => c.id !== id));
  },
};
