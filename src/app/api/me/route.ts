import type { NextRequest } from 'next/server';
import { isCustomCardId, customSourceId } from '@/lib/cardMaker/customIds';
import { listOwnCards, readCustomCards } from '@/lib/customCards/store';
import { listDecks } from '@/lib/decks/store';
import { ORIGINAL_DESIGN } from '@/lib/decks/types';
import { json, playerErrorResponse, playerOf } from '@/lib/player';
import { activeTheme, listThemes } from '@/lib/themes/store';

/**
 * Tudo o que o jogador tem na nuvem: os decks, as cartas criadas dele e as de outros jogadores que os decks usam (decks
 * importados por código) ou que eles escolheram como design (`Deck.designs`), e os temas da arena (todos, com o tema em uso deste jogador).
 */
export async function GET(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const [decks, cards, themes, active] = await Promise.all([listDecks(owner), listOwnCards(owner), listThemes(owner), activeTheme(owner)]);
    const mine = new Set(cards.map((c) => c.id));
    const wanted = new Set<string>();
    for (const d of decks) {
      for (const id of Object.keys(d.cards)) if (isCustomCardId(id)) wanted.add(customSourceId(id));
      for (const v of Object.values(d.designs ?? {})) if (v !== ORIGINAL_DESIGN) wanted.add(v);
    }
    const others = await readCustomCards([...wanted].filter((id) => !mine.has(id)), owner);
    return json({ decks, cards, others, themes, activeTheme: themes.some((t) => t.theme.id === active) ? active : null });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
