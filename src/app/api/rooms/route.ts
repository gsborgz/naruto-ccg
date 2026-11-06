import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createRoom, parseNickname, RoomError, toView } from '@/lib/rooms/model';
import { insertRoom, parseIdentity, readJson, roomErrorResponse, touchSeen } from '@/lib/rooms/store';

/** Cria uma sala com quem pediu como anfitrião. */
export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const { playerId, tokenHash } = parseIdentity(body);
    const nickname = parseNickname(body.nickname);
    if (!nickname) throw new RoomError(400, 'Escolha um apelido de 1 a 24 caracteres.');

    const now = new Date();
    const room = createRoom(randomUUID(), { playerId, tokenHash, nickname }, now.toISOString());
    await insertRoom(room);
    await touchSeen(room.id, tokenHash, now.getTime());
    return NextResponse.json(toView(room, 'host', { [tokenHash]: now.getTime() }, now.getTime()));
  } catch (e) {
    return roomErrorResponse(e);
  }
}
