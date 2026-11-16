import { NextRequest, NextResponse } from 'next/server';
import { ArtError, deleteArt, saveArt } from '@/lib/artStore';
import { isBlobArt } from '@/lib/cardMaker/sharedCard';
import { hashToken } from '@/lib/rooms/store';

/**
 * Artes das cartas criadas no Vercel Blob (docs/DEPLOY.md, "Artes das cartas criadas"). Exige `X-Player-Token`
 * (a identidade anônima do jogador, a mesma das salas): quem envia primeiro uma imagem é o único que pode apagá-la.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function tokenHashOf(request: NextRequest): string {
  const token = request.headers.get('x-player-token');
  if (!token || !UUID.test(token)) throw new ArtError(400, 'Identidade do jogador inválida. Recarregue a página.');
  return hashToken(token);
}

async function body(request: NextRequest): Promise<Record<string, unknown>> {
  const json = await request.json().catch(() => null);
  if (typeof json !== 'object' || json === null || Array.isArray(json)) throw new ArtError(400, 'Requisição inválida.');
  return json as Record<string, unknown>;
}

function errorResponse(e: unknown) {
  if (e instanceof ArtError) return NextResponse.json({ message: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ message: 'Erro inesperado ao guardar a imagem.' }, { status: 500 });
}

/** Envia uma arte (`{ data }`: data URL já tratado no navegador). Devolve `{ url }`. */
export async function POST(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request);
    const { url } = await saveArt((await body(request)).data, tokenHash);
    return NextResponse.json({ url });
  } catch (e) {
    return errorResponse(e);
  }
}

/** Apaga uma arte (`{ url }`). Só quem a enviou primeiro. */
export async function DELETE(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request);
    const { url } = await body(request);
    if (typeof url !== 'string' || !isBlobArt(url)) throw new ArtError(400, 'Endereço de imagem inválido.');
    await deleteArt(url, tokenHash);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
