'use client';

import { useSyncExternalStore } from 'react';

/**
 * Como as cartas aparecem nas listagens e no detalhe: `original` = a imagem impressa (padrão);
 * `rendered` = a carta montada em tempo real (layout + ícones + textos), nas cartas já escaneadas.
 * Preferência por navegador, escolhida no toggle da listagem.
 */
export type CardDesign = 'original' | 'rendered';

const STORAGE_KEY = 'naruto-ccg:card-design';

let cache: CardDesign | null = null;
const listeners = new Set<() => void>();

function read(): CardDesign {
  if (cache) return cache;
  try {
    cache = localStorage.getItem(STORAGE_KEY) === 'rendered' ? 'rendered' : 'original';
  } catch {
    cache = 'original';
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

/** Design escolhido, sincronizado entre abas. No servidor (e na primeira renderização), o original. */
export function useCardDesign(): CardDesign {
  return useSyncExternalStore(subscribe, read, () => 'original');
}

export function setCardDesign(design: CardDesign) {
  cache = design;
  try {
    localStorage.setItem(STORAGE_KEY, design);
  } catch {
    // Sem persistência: vale até recarregar a página.
  }
  listeners.forEach((l) => l());
}
