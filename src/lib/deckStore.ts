'use client';

import { useSyncExternalStore } from 'react';
import type { DeckCards } from './deckRules.ts';

export interface Deck {
  id: string;
  name: string;
  cards: DeckCards;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formato salvo no localStorage. O campo `version` permite migrar no futuro
 * (e é o mesmo payload que irá para o "código de backup" na próxima etapa).
 */
interface StoredData {
  version: 1;
  decks: Deck[];
}

const STORAGE_KEY = 'naruto-ccg:decks';

let cache: Deck[] | null = null;
const listeners = new Set<() => void>();

function read(): Deck[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredData) : null;
    cache = parsed?.version === 1 && Array.isArray(parsed.decks) ? parsed.decks : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(decks: Deck[]) {
  cache = decks;
  try {
    const data: StoredData = { version: 1, decks };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage cheio ou bloqueado: mantém em memória nesta sessão.
  }
  listeners.forEach((l) => l());
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

/** Lista de decks, sincronizada entre abas. Retorna `null` durante o SSR. */
export function useDecks(): Deck[] | null {
  return useSyncExternalStore<Deck[] | null>(subscribe, read, () => null);
}

export function useDeck(id: string): Deck | null | undefined {
  const decks = useDecks();
  if (decks === null) return undefined; // ainda carregando
  return decks.find((d) => d.id === id) ?? null;
}

function now() {
  return new Date().toISOString();
}

export const deckActions = {
  create(name = 'Novo deck', cards: DeckCards = {}): Deck {
    const deck: Deck = { id: crypto.randomUUID(), name, cards, createdAt: now(), updatedAt: now() };
    write([deck, ...read()]);
    return deck;
  },

  /**
   * Grava as alterações do montador. O montador edita um rascunho em memória e só chama isto
   * no botão "Salvar" (ou ao confirmar "Salvar" ao sair da tela).
   */
  save(id: string, changes: Pick<Deck, 'name' | 'cards'>) {
    const name = changes.name.trim() || 'Deck sem nome';
    write(read().map((d) => (d.id === id ? { ...d, name, cards: { ...changes.cards }, updatedAt: now() } : d)));
  },

  /** Adiciona decks importados (de um código compartilhado) como decks novos, no topo da lista. */
  importDecks(decks: Pick<Deck, 'name' | 'cards'>[]): Deck[] {
    const created = decks.map(
      (d): Deck => ({ id: crypto.randomUUID(), name: d.name, cards: { ...d.cards }, createdAt: now(), updatedAt: now() }),
    );
    write([...created, ...read()]);
    return created;
  },

  duplicate(id: string): Deck | null {
    const src = read().find((d) => d.id === id);
    if (!src) return null;
    return deckActions.create(`${src.name} (cópia)`, { ...src.cards });
  },

  remove(id: string) {
    write(read().filter((d) => d.id !== id));
  },
};
