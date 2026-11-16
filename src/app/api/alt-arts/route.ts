import { NextRequest, NextResponse } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';
import { addAltArt, listAltArts, removeAltArt } from '@/lib/altArtStore';
import { canEditAltArt, isAltArtId } from '@/lib/altArts';
import { ArtError } from '@/lib/artStore';
import { hashToken } from '@/lib/rooms/store';

/**
 * Artes alternativas das cartas do catálogo (README, "Artes alternativas"). Todo mundo vê as artes de cada carta;
 * enviar e remover exigem `X-Player-Token` (a identidade anônima do jogador, a mesma das salas).
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function optionalTokenHash(request: NextRequest): string | null {
  const token = request.headers.get('x-player-token');
  return token && UUID.test(token) ? hashToken(token) : null;
}

function tokenHashOf(request: NextRequest): string {
  const hash = optionalTokenHash(request);
  if (!hash) throw new ArtError(400, 'Identidade do jogador inválida. Recarregue a página.');
  return hash;
}

function cardIdOf(value: unknown): string {
  if (typeof value !== 'string' || !CARDS_BY_ID.has(value)) throw new ArtError(404, 'Carta não encontrada.');
  return value;
}

async function body(request: NextRequest): Promise<Record<string, unknown>> {
  const json = await request.json().catch(() => null);
  if (typeof json !== 'object' || json === null || Array.isArray(json)) throw new ArtError(400, 'Requisição inválida.');
  return json as Record<string, unknown>;
}

function errorResponse(e: unknown) {
  if (e instanceof ArtError) return NextResponse.json({ message: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ message: 'Erro inesperado nas artes alternativas.' }, { status: 500 });
}

/** `?card=<id>`: as artes alternativas da carta. */
export async function GET(request: NextRequest) {
  try {
    const cardId = cardIdOf(request.nextUrl.searchParams.get('card'));
    const arts = await listAltArts(cardId, optionalTokenHash(request));
    return NextResponse.json({ arts }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return errorResponse(e);
  }
}

/**
 * `{ cardId, src, x, y, zoom, front? }` (as imagens já enviadas por `/api/art`; `front` = a camada da frente, com
 * `src, x, y, zoom`). Só cartas já mapeadas (`canEditAltArt`). Devolve `{ art }`.
 */
export async function POST(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request);
    const data = await body(request);
    const cardId = cardIdOf(data.cardId);
    if (!canEditAltArt(CARDS_BY_ID.get(cardId)!)) {
      throw new ArtError(400, 'A arte desta carta ainda não pode ser trocada: a coleção dela ainda não foi mapeada.');
    }
    const art = await addAltArt(cardId, data, tokenHash);
    return NextResponse.json({ art });
  } catch (e) {
    return errorResponse(e);
  }
}

/** `{ cardId, id }`: remove a arte (só quem enviou). */
export async function DELETE(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request);
    const data = await body(request);
    if (!isAltArtId(data.id)) throw new ArtError(400, 'Arte inválida.');
    await removeAltArt(cardIdOf(data.cardId), data.id, tokenHash);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
