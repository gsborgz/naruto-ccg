import { NextRequest, NextResponse } from 'next/server';
import { AltCardError, listAltCards, publishAltCard, unpublishAltCard } from '@/lib/altCards';
import { CATALOG_CARD_ID, parseSharedCustomCard } from '@/lib/cardMaker/sharedCard';
import { ensureContent } from '@/lib/content/server';
import { hashToken } from '@/lib/rooms/store';

/**
 * Artes alternativas das cartas do catálogo (`src/lib/altCards.ts`): as cartas do criador importadas de uma carta do
 * catálogo. `X-Player-Token` (a identidade anônima do jogador, a mesma das salas) diz de quem é cada uma.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CUSTOM_ID = /^[A-Za-z0-9-]{1,64}$/;

function tokenHashOf(request: NextRequest, required: true): string;
function tokenHashOf(request: NextRequest, required: false): string | undefined;
function tokenHashOf(request: NextRequest, required: boolean): string | undefined {
  const token = request.headers.get('x-player-token');
  if (token && UUID.test(token)) return hashToken(token);
  if (required) throw new AltCardError(400, 'Identidade do jogador inválida. Recarregue a página.');
  return undefined;
}

async function body(request: NextRequest): Promise<Record<string, unknown>> {
  const json = await request.json().catch(() => null);
  if (typeof json !== 'object' || json === null || Array.isArray(json)) throw new AltCardError(400, 'Requisição inválida.');
  return json as Record<string, unknown>;
}

function errorResponse(e: unknown) {
  if (e instanceof AltCardError) return NextResponse.json({ message: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ message: 'Erro inesperado nas artes alternativas.' }, { status: 500 });
}

/** `?card=<id da carta do catálogo>`: as artes alternativas dela (`{ items }`). */
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('card') ?? '';
    if (!CATALOG_CARD_ID.test(id)) throw new AltCardError(400, 'Carta inválida.');
    const items = await listAltCards(id, tokenHashOf(request, false));
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return errorResponse(e);
  }
}

/** Publica ou atualiza uma carta criada (`{ card, author }`) como arte alternativa da carta de origem dela. */
export async function PUT(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request, true);
    const json = await body(request);
    const card = parseSharedCustomCard(json.card);
    if (!card) throw new AltCardError(400, 'Carta inválida (a arte precisa estar enviada ao servidor).');
    const content = await ensureContent();
    if (!card.source || !content.cards.some((c) => c.id === card.source)) throw new AltCardError(404, 'Carta de origem não encontrada.');
    await publishAltCard(tokenHash, card, typeof json.author === 'string' ? json.author : '');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

/** Tira uma carta criada deste jogador (`{ cardId }`) da lista de artes alternativas. */
export async function DELETE(request: NextRequest) {
  try {
    const tokenHash = tokenHashOf(request, true);
    const json = await body(request);
    if (typeof json.cardId !== 'string' || !CUSTOM_ID.test(json.cardId)) throw new AltCardError(400, 'Carta inválida.');
    await unpublishAltCard(tokenHash, json.cardId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
