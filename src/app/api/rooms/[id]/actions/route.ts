import { NextRequest, NextResponse } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';
import { isValidShareId } from '@/lib/deckShare';
import { applyAction, parseRoomAction, RoomError, seatOf, toView } from '@/lib/rooms/model';
import { hashToken, readJson, roomEnv, roomErrorResponse, updateRoom } from '@/lib/rooms/store';

const lookup = (id: string) => CARDS_BY_ID.get(id);

/** Ações de quem está na sala: pronto, trocar de deck, sair e jogadas da partida. Exige `X-Player-Token`. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isValidShareId(id)) throw new RoomError(400, 'Código de sala inválido.');
    const token = request.headers.get('x-player-token');
    if (!token) throw new RoomError(401, 'Você não está nesta sala.');
    const tokenHash = hashToken(token);
    const action = parseRoomAction(await readJson(request), lookup);

    const now = new Date();
    const { room, seen } = await updateRoom(id, (r) => {
      const who = seatOf(r, tokenHash);
      if (!who) throw new RoomError(401, 'Você não está nesta sala.');
      return applyAction(r, who, action, now.toISOString(), roomEnv);
    });
    // Sala apagada (o último jogador saiu): não há mais o que mostrar.
    if (!room) return NextResponse.json(null);
    return NextResponse.json(toView(room, seatOf(room, tokenHash), seen, now.getTime(), lookup));
  } catch (e) {
    return roomErrorResponse(e);
  }
}
