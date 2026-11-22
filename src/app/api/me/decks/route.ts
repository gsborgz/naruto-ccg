import type { NextRequest } from 'next/server';
import { deleteDeck, saveDecks } from '@/lib/decks/store';
import { parseDeck, type Deck } from '@/lib/decks/types';
import { json, PlayerError, playerErrorResponse, playerOf, readBody } from '@/lib/player';

/** Grava decks do jogador (`{ decks }`: novos ou alterados). */
export async function PUT(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const body = await readBody(request);
    const list = Array.isArray(body.decks) ? body.decks : [];
    const decks = list.map(parseDeck);
    if (!list.length || list.length > 500 || decks.some((d) => !d)) throw new PlayerError(400, 'Deck inválido.');
    await saveDecks(owner, decks as Deck[]);
    return json({ ok: true });
  } catch (e) {
    return playerErrorResponse(e);
  }
}

/** Exclui um deck do jogador (`{ id }`). */
export async function DELETE(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const body = await readBody(request);
    if (typeof body.id !== 'string' || body.id.length > 40) throw new PlayerError(400, 'Deck inválido.');
    await deleteDeck(owner, body.id);
    return json({ ok: true });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
