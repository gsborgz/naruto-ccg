'use client';

import { useSyncExternalStore } from 'react';
import { migrateCustomCard, type CustomCard } from './model.ts';

/**
 * Cartas do criador, no localStorage. A arte é o endereço dela no Vercel Blob; enquanto não foi enviada (sem conexão),
 * fica como data URL tratada (`compressImage`) e é enviada depois (`migrateStoredArt`).
 */
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
    cache = parsed?.version === 1 && Array.isArray(parsed.cards) ? parsed.cards.map(migrateCustomCard) : [];
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

/** Cartas criadas agora (fora do React). */
export function readCustomCards(): CustomCard[] {
  return read();
}

let artMigrationScheduled = false;

/** Uma vez por carregamento: trata e envia as artes que ainda estão só no localStorage (em segundo plano). */
function scheduleArtMigration() {
  if (artMigrationScheduled) return;
  artMigrationScheduled = true;
  setTimeout(() => {
    import('./artUpload.ts').then((m) => m.migrateStoredArt()).catch(() => {});
  }, 2000);
}

function subscribe(listener: () => void) {
  scheduleArtMigration();
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
  /**
   * Cartas criadas que vieram de um deck importado (código compartilhado): entram no criador as que ainda não
   * existem aqui. Uma carta com o mesmo id já existente fica como está (pode ter sido editada neste navegador).
   */
  addMissing(incoming: CustomCard[]): boolean {
    const cards = read();
    const known = new Set(cards.map((c) => c.id));
    const added = incoming.filter((c) => !known.has(c.id));
    return added.length === 0 || write([...added, ...cards]);
  },
  remove(id: string) {
    write(read().filter((c) => c.id !== id));
  },
};
