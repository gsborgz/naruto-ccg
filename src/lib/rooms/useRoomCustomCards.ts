'use client';

import { useEffect, useState } from 'react';
import { roomApi, type RoomCards } from './client';
import type { RoomView } from './model';

/**
 * Cartas criadas dos dois decks da partida (docs/SALAS.md, "Cartas criadas") e as artes alternativas que cada jogador
 * levou: buscadas uma vez (e de novo só se a lista mudar, ex.: outra partida na mesma sala). As artes vêm direto do
 * Vercel Blob pelo endereço. `undefined` enquanto carregam ou sem cartas criadas nem artes.
 */
export function useRoomCustomCards(view: RoomView | null): RoomCards | undefined {
  const roomId = view?.id;
  const key = [view?.customCardIds?.join() ?? '', view?.artKeys?.join() ?? ''].join('|');
  const empty = key === '|';
  const [loaded, setLoaded] = useState<{ key: string; data: RoomCards } | null>(null);
  useEffect(() => {
    if (!roomId || empty) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () =>
      roomApi
        .customCards(roomId)
        .then((data) => !cancelled && setLoaded({ key, data }))
        .catch(() => {
          if (!cancelled) timer = setTimeout(load, 3000); // tenta de novo
        });
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [roomId, key, empty]);
  return !empty && loaded?.key === key ? loaded.data : undefined;
}
