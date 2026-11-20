import { NextRequest, NextResponse } from 'next/server';
import { ArtError, saveArt, setArtRefs } from '@/lib/artStore';
import { isBlobArt } from '@/lib/cardMaker/sharedCard';
import { hashToken } from '@/lib/rooms/store';

/**
 * Artes das cartas criadas no Vercel Blob (docs/DEPLOY.md, "Artes das cartas criadas"). Exige `X-Player-Token`
 * (a identidade anônima do jogador, a mesma das salas). Cada carta criada registra o uso das suas artes
 * (`custom:<hash do token>:<id da carta>`, em `artStore.ts`): a imagem só sai do Blob quando nada mais a usa.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CARD_ID = /^[\w-]{1,80}$/;

/** O uso das artes de uma carta criada deste jogador. */
function customRef(tokenHash: string, cardId: unknown): string {
  if (typeof cardId !== 'string' || !CARD_ID.test(cardId)) throw new ArtError(400, 'Carta inválida.');
  return `custom:${tokenHash}:${cardId}`;
}

const blobArts = (x: unknown): string[] => {
  if (!Array.isArray(x) || x.length > 4 || !x.every((u) => typeof u === 'string' && isBlobArt(u))) {
    throw new ArtError(400, 'Endereço de imagem inválido.');
  }
  return x as string[];
};

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

/**
 * Envia uma arte (`{ data, cardId? }`: data URL já tratado no navegador). Devolve `{ url }`. Com `cardId` (carta
 * criada), a arte já fica como usada por ela; sem (arte de uma carta do catálogo, na aba Editar), fica pendente até a
 * carta ser salva.
 */
export async function POST(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request);
    const json = await body(request);
    const ref = json.cardId === undefined ? undefined : customRef(tokenHash, json.cardId);
    const { url } = await saveArt(json.data, tokenHash, ref);
    return NextResponse.json({ url });
  } catch (e) {
    return errorResponse(e);
  }
}

/**
 * As artes que uma carta criada deste jogador usa agora (`{ cardId, urls, previous? }`; `urls: []` = a carta foi
 * excluída). As que saíram e que nada mais usa são apagadas do Blob. `previous` = as que a carta usava, para as
 * cartas salvas antes das referências.
 */
export async function PUT(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request);
    const json = await body(request);
    const previous = json.previous === undefined ? [] : blobArts(json.previous);
    await setArtRefs(customRef(tokenHash, json.cardId), blobArts(json.urls), { previous, tokenHash });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
