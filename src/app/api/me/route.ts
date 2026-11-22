import type { NextRequest } from 'next/server';
import { isCustomCardId, customSourceId } from '@/lib/cardMaker/customIds';
import { listOwnCards, readCustomCards } from '@/lib/customCards/store';
import { listDecks } from '@/lib/decks/store';
import { ORIGINAL_DESIGN } from '@/lib/decks/types';
import { json, playerErrorResponse, playerOf } from '@/lib/player';

/**
 * Tudo o que o jogador tem na nuvem: os decks, as cartas criadas dele e as de outros jogadores que os decks usam (decks
 * importados por código) ou que eles escolheram como design (`Deck.designs`).
 */
export async function GET(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const [decks, cards] = await Promise.all([listDecks(owner), listOwnCards(owner)]);
    const mine = new Set(cards.map((c) => c.id));
    const wanted = new Set<string>();
    for (const d of decks) {
      for (const id of Object.keys(d.cards)) if (isCustomCardId(id)) wanted.add(customSourceId(id));
      for (const v of Object.values(d.designs ?? {})) if (v !== ORIGINAL_DESIGN) wanted.add(v);
    }
    const others = await readCustomCards([...wanted].filter((id) => !mine.has(id)), owner);
    return json({ decks, cards, others });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
