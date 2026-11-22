import type { NextRequest } from 'next/server';
import { CATALOG_CARD_ID } from '@/lib/cardMaker/sharedCard';
import { listVersions } from '@/lib/customCards/store';
import { json, optionalPlayerOf, PlayerError, playerErrorResponse } from '@/lib/player';

/**
 * Alters de uma carta do catálogo (as cartas do criador ligadas a ela, de todos os jogadores), para a escolha de design
 * de cada carta no montador. `?card=<id>`.
 */
export async function GET(request: NextRequest) {
  try {
    const card = request.nextUrl.searchParams.get('card') ?? '';
    if (!CATALOG_CARD_ID.test(card)) throw new PlayerError(400, 'Carta inválida.');
    return json({ items: await listVersions(card, optionalPlayerOf(request)) });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
