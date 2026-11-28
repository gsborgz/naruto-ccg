import type { NextRequest } from 'next/server';
import { isCustomCardId, customSourceId } from '@/lib/cardMaker/customIds';
import { listOthersCards, listOwnCards, readCustomCards } from '@/lib/customCards/store';
import { listDecks } from '@/lib/decks/store';
import { ORIGINAL_DESIGN } from '@/lib/decks/types';
import { json, playerErrorResponse, playerOf } from '@/lib/player';
import { activeTheme, listThemes } from '@/lib/themes/store';
import { listSleeves } from '@/lib/sleeves/store';
import { getNickname } from '@/lib/profile/store';

/**
 * Tudo o que o jogador tem na nuvem: os decks, as cartas criadas dele, as de outros jogadores (todas as que não são
 * alters, para o catálogo e o montador) e as alters que os decks escolheram como design (`Deck.designs`), os temas da arena (todos, com o tema em uso deste jogador) e os sleeves (todos).
 */
export async function GET(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const [decks, cards, shared, themes, active, sleeves, nickname] = await Promise.all([
      listDecks(owner),
      listOwnCards(owner),
      listOthersCards(owner),
      listThemes(owner),
      activeTheme(owner),
      listSleeves(owner),
      getNickname(owner),
    ]);
    const mine = new Set(cards.map((c) => c.id));
    const wanted = new Set<string>();
    for (const d of decks) {
      for (const id of Object.keys(d.cards)) if (isCustomCardId(id)) wanted.add(customSourceId(id));
      for (const v of Object.values(d.designs ?? {})) if (v !== ORIGINAL_DESIGN) wanted.add(v);
    }
    const known = new Set([...mine, ...shared.map((o) => o.card.id)]);
    const others = [...shared, ...(await readCustomCards([...wanted].filter((id) => !known.has(id)), owner))];
    return json({
      decks,
      cards,
      others,
      themes,
      sleeves,
      activeTheme: themes.some((t) => t.theme.id === active) ? active : null,
      nickname,
    });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
