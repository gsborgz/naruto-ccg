import type { NextRequest } from 'next/server';
import { readCustomCards } from '@/lib/customCards/store';
import { json, optionalPlayerOf, PlayerError, playerErrorResponse } from '@/lib/player';

/** Cartas do criador pelo id (`?ids=a,b`): qualquer um lê (decks importados, salas, versões das cartas). */
export async function GET(request: NextRequest) {
  try {
    const ids = (request.nextUrl.searchParams.get('ids') ?? '').split(',').filter(Boolean);
    if (!ids.length || ids.length > 200 || !ids.every((id) => /^[A-Za-z0-9-]{1,64}$/.test(id))) {
      throw new PlayerError(400, 'Cartas inválidas.');
    }
    return json({ items: await readCustomCards(ids, optionalPlayerOf(request)) });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
