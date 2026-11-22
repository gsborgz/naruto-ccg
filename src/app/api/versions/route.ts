import type { NextRequest } from 'next/server';
import { CATALOG_CARD_ID } from '@/lib/cardMaker/sharedCard';
import { invalidateContent } from '@/lib/content/server';
import { listVersions, removeVersion } from '@/lib/customCards/store';
import { json, optionalPlayerOf, PlayerError, playerErrorResponse, playerOf, readBody } from '@/lib/player';

/**
 * Versões de uma carta do catálogo (as cartas do criador importadas dela, de todos os jogadores), listadas nas Artes
 * alternativas do detalhe e na escolha de design do montador. `?card=<id>`.
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

/**
 * Tira uma versão da lista (`{ card, id }`): a do jogador e a do sistema são excluídas de vez; a de outro jogador só sai
 * da lista. Se era o design padrão da carta, ela volta para a impressa.
 */
export async function DELETE(request: NextRequest) {
  try {
    const requester = playerOf(request);
    const body = await readBody(request);
    const card = typeof body.card === 'string' ? body.card : '';
    const id = typeof body.id === 'string' ? body.id : '';
    if (!CATALOG_CARD_ID.test(card) || !/^[A-Za-z0-9-]{1,64}$/.test(id)) throw new PlayerError(400, 'Versão inválida.');
    const { contentChanged } = await removeVersion(requester, card, id);
    if (contentChanged) invalidateContent();
    return json({ contentChanged });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
