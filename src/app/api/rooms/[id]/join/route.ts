import { NextRequest, NextResponse } from 'next/server';
import { isValidShareId } from '@/lib/deckShare';
import { joinRoom, parseNickname, RoomError, seatOf, toView } from '@/lib/rooms/model';
import { parseIdentity, readJson, roomErrorResponse, touchSeen, updateRoom } from '@/lib/rooms/store';

/** Entra como convidado (ou reconecta, se o token já ocupa um lugar). */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isValidShareId(id)) throw new RoomError(400, 'Código de sala inválido.');
    const body = await readJson(request);
    const { playerId, tokenHash } = parseIdentity(body);
    const nickname = parseNickname(body.nickname);
    if (!nickname) throw new RoomError(400, 'Escolha um apelido de 1 a 24 caracteres.');

    const now = new Date();
    const { room, seen } = await updateRoom(id, (r) =>
      joinRoom(r, { playerId, tokenHash, nickname }, now.toISOString()),
    );
    await touchSeen(id, tokenHash, now.getTime());
    seen[tokenHash] = now.getTime();
    return NextResponse.json(toView(room, seatOf(room, tokenHash), seen, now.getTime()));
  } catch (e) {
    return roomErrorResponse(e);
  }
}
