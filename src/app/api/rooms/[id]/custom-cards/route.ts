import { NextRequest, NextResponse } from 'next/server';
import { isValidShareId } from '@/lib/deckShare';
import { roomCustom, RoomError, seatOf } from '@/lib/rooms/model';
import { hashToken, readRoom, roomErrorResponse } from '@/lib/rooms/store';

/**
 * Cartas criadas dos dois decks da partida, para desenhá-las (as artes enviadas pelo jogador vêm como
 * `art:<hash>`; ver `/api/rooms/<id>/art`). Só para quem joga, e só durante a partida. Exige `X-Player-Token`.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isValidShareId(id)) throw new RoomError(400, 'Código de sala inválido.');
    const token = request.headers.get('x-player-token');
    const { room } = await readRoom(id);
    if (!room) throw new RoomError(404, 'Sala não encontrada. Ela pode ter expirado.');
    if (!seatOf(room, token ? hashToken(token) : null)) throw new RoomError(401, 'Você não está nesta sala.');
    if (room.status !== 'starting' || !room.game) throw new RoomError(409, 'A partida ainda não começou.');
    return NextResponse.json({ cards: roomCustom(room) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return roomErrorResponse(e);
  }
}
