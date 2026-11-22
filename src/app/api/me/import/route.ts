import type { NextRequest } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';
import { ensureContent } from '@/lib/content/server';
import { adoptCards } from '@/lib/customCards/store';
import { listDecks, saveDecks } from '@/lib/decks/store';
import { parseDeck, type Deck } from '@/lib/decks/types';
import { json, PlayerError, playerErrorResponse, playerOf, readBody } from '@/lib/player';

/**
 * Leva para a nuvem o que estava só no navegador (os decks e as cartas criadas de antes da nuvem) ou as cartas criadas
 * de um código compartilhado: `{ decks?, cards?, author? }`. As cartas que ainda não existem passam a ser do jogador; os
 * decks com um id que ele já tem ficam como estão.
 */
export async function POST(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const body = await readBody(request);
    const rawCards = Array.isArray(body.cards) ? body.cards : [];
    const rawDecks = Array.isArray(body.decks) ? body.decks : [];
    if (rawCards.length > 500 || rawDecks.length > 500) throw new PlayerError(400, 'Dados demais para importar.');
    await ensureContent();
    const author = typeof body.author === 'string' ? body.author : '';
    const cards = await adoptCards(owner, rawCards, author, (id) => CARDS_BY_ID.has(id));
    const known = new Set((await listDecks(owner)).map((d) => d.id));
    const decks = rawDecks.map(parseDeck).filter((d): d is Deck => !!d && !known.has(d.id));
    await saveDecks(owner, decks);
    return json({ cards, decks: decks.length });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
