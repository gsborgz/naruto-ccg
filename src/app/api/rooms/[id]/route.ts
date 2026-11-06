import { NextRequest, NextResponse } from 'next/server';
import { isValidShareId } from '@/lib/deckShare';
import { RoomError, seatOf, toView } from '@/lib/rooms/model';
import { hashToken, readRoom, roomErrorResponse, touchSeen } from '@/lib/rooms/store';

/**
 * Estado da sala para quem consulta. Com `X-Player-Token`, mostra o lado do jogador;
 * com `?ping=1`, também marca o jogador como online (o navegador manda a cada poucos segundos).
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isValidShareId(id)) throw new RoomError(400, 'Código de sala inválido.');

    const token = request.headers.get('x-player-token');
    const tokenHash = token ? hashToken(token) : null;
    const nowMs = Date.now();

    const { room, seen } = await readRoom(id);
    if (!room) throw new RoomError(404, 'Sala não encontrada. Ela pode ter expirado.');

    const you = seatOf(room, tokenHash);
    if (you && tokenHash && request.nextUrl.searchParams.get('ping') === '1') {
      await touchSeen(id, tokenHash, nowMs);
      seen[tokenHash] = nowMs;
    }
    return NextResponse.json(toView(room, you, seen, nowMs), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return roomErrorResponse(e);
  }
}
