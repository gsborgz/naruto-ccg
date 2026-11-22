'use client';

import type { SharedDeck } from '../deckShare.ts';
import { hasPendingArt } from './artUpload.ts';
import { customDeckCardId, isCustomCardId } from './customIds.ts';
import { cardVillages, withVillages, type CustomCard } from './model.ts';

/**
 * Deck para levar para fora deste navegador (sala de jogo ou compartilhamento por código): leva junto as cartas
 * criadas que ele usa (docs/SALAS.md, "Cartas criadas"). As artes têm que estar no Vercel Blob (enviadas pelo
 * **Salvar** do criador): se alguma ainda está só neste navegador, lança erro com a mensagem para mostrar na tela.
 */
export async function withCustomCards(
  deck: { name: string; cards: Record<string, number>; designs?: Record<string, string> },
  customCards: CustomCard[],
): Promise<SharedDeck> {
  const custom: Record<string, CustomCard> = {};
  for (const id of Object.keys(deck.cards)) {
    if (!isCustomCardId(id)) continue;
    const source = customCards.find((c) => customDeckCardId(c.id) === id);
    if (!source) throw new Error(`O deck "${deck.name}" tem uma carta criada que foi excluída.`);
    if (hasPendingArt(source)) {
      throw new Error(
        `A arte da carta "${source.name || 'sem nome'}" ainda não foi enviada ao servidor: abra a carta no criador e clique em Salvar.`,
      );
    }
    custom[id] = toSharedCard(source);
  }
  return {
    name: deck.name,
    cards: deck.cards,
    ...(Object.keys(custom).length > 0 && { custom }),
    ...(deck.designs && Object.keys(deck.designs).length > 0 && { designs: deck.designs }),
  };
}

/** Só o que a carta precisa para ser desenhada (sem a imagem de referência do catálogo e no formato novo das vilas). */
function toSharedCard(card: CustomCard): CustomCard {
  const { reference: _reference, ...rest } = withVillages(card, cardVillages(card));
  return rest;
}
