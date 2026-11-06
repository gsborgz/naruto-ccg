'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { forgetRoom, lastRoomId, roomApi } from '@/lib/rooms/client';
import type { RoomView } from '@/lib/rooms/model';

/**
 * Aviso "Você ainda está numa sala": aparece quando o jogador saiu da sala sem usar o botão Sair
 * (fechou a aba, navegou para outra página, caiu a conexão) e o lugar dele continua lá.
 * Se a sala não existe mais, ou ele não está nela, o aviso some e a sala é esquecida.
 */
export function ReturnToRoom() {
  const [room, setRoom] = useState<RoomView | null>(null);

  useEffect(() => {
    const id = lastRoomId();
    if (!id) return;
    let cancelled = false;
    roomApi
      .get(id, false)
      .then((view) => {
        if (cancelled) return;
        if (view.you) setRoom(view);
        else forgetRoom(id);
      })
      .catch((e: { status?: number }) => {
        if (!cancelled && (e.status === 404 || e.status === 400)) forgetRoom(id);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!room) return null;
  const host = room.players.find((p) => p.seat === 'host');
  const other = room.players.find((p) => p.seat !== room.you);
  const where = room.you === 'host' ? 'na sua sala' : `na sala de ${host?.nickname ?? '…'}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3">
      <p className="text-sm">
        Você ainda está {where}
        {other ? ` com ${other.nickname}` : ', esperando um oponente'}.
      </p>
      <Link
        href={`/salas/${room.id}`}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong"
      >
        Voltar para a sala
      </Link>
    </div>
  );
}
