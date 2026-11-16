'use client';

import { useEffect, useState } from 'react';
import type { CustomCard } from '@/lib/cardMaker/model';
import { roomApi } from './client';
import type { RoomView } from './model';

/**
 * Cartas criadas dos dois decks da partida (docs/SALAS.md, "Cartas criadas"): buscadas uma vez (e de novo só se a
 * lista de ids mudar, ex.: outra partida na mesma sala). As artes vêm direto do Vercel Blob pelo endereço que a carta
 * traz. `undefined` enquanto carregam ou sem cartas criadas.
 */
export function useRoomCustomCards(view: RoomView | null): Record<string, CustomCard> | undefined {
  const roomId = view?.id;
  const key = view?.customCardIds?.join() ?? '';
  const [loaded, setLoaded] = useState<{ key: string; cards: Record<string, CustomCard> } | null>(null);
  useEffect(() => {
    if (!roomId || !key) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () =>
      roomApi
        .customCards(roomId)
        .then(({ cards }) => !cancelled && setLoaded({ key, cards }))
        .catch(() => {
          if (!cancelled) timer = setTimeout(load, 3000); // tenta de novo
        });
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [roomId, key]);
  return key && loaded?.key === key ? loaded.cards : undefined;
}
