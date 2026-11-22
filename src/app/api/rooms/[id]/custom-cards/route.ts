import { NextRequest, NextResponse } from 'next/server';
import { readCustomCards } from '@/lib/customCards/store';
import { isValidShareId } from '@/lib/deckShare';
import { ORIGINAL_DESIGN } from '@/lib/decks/types';
import { roomCustom, roomDesigns, RoomError, seatOf } from '@/lib/rooms/model';
import { hashToken, readRoom, roomErrorResponse } from '@/lib/rooms/store';

/**
 * Cartas criadas dos dois decks da partida, para desenhá-las (as artes vêm do Vercel Blob pelo endereço), e o design
 * escolhido em cada deck (`designs`: lado → carta → versão), com as versões (`versions`, da nuvem). Só para quem
 * joga, e só durante a partida. Exige `X-Player-Token`.
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
    const designs = roomDesigns(room);
    const ids = [...new Set([...Object.values(designs.host), ...Object.values(designs.guest)])].filter((v) => v !== ORIGINAL_DESIGN);
    const versions = Object.fromEntries((await readCustomCards(ids)).map((v) => [v.card.id, v.card]));
    return NextResponse.json({ cards: roomCustom(room), designs, versions }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return roomErrorResponse(e);
  }
}
