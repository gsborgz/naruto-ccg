'use client';

import { useSyncExternalStore } from 'react';
import { BOARD_THEME_IDS } from './game/boardThemes';

/**
 * Tema da arena escolhido por ESTE jogador (seletor 🎨): preferência por navegador, que vale só para quem
 * escolheu e para as próximas partidas. Sem escolha, a arena usa o tema sorteado na partida
 * (`GameState.theme`). Mesmo padrão de `cardDesign.ts`.
 */
const STORAGE_KEY = 'naruto-ccg:arena-theme';

/** `undefined` = ainda não lido; `null` = sem escolha. */
let cache: string | null | undefined;
const listeners = new Set<() => void>();

function read(): string | null {
  if (cache !== undefined) return cache;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    cache = value && BOARD_THEME_IDS.includes(value) ? value : null;
  } catch {
    cache = null;
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = undefined;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Tema escolhido neste navegador (sincronizado entre abas), ou `null` se nunca escolheu. */
export function useArenaTheme(): string | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function setArenaTheme(theme: string) {
  if (!BOARD_THEME_IDS.includes(theme)) return;
  cache = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Sem persistência: vale até recarregar a página.
  }
  listeners.forEach((l) => l());
}
