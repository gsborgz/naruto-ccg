'use client';

import type { SharedDeck } from '../deckShare.ts';
import { ensureCardArtUploaded } from './artUpload.ts';
import { customDeckCardId, isCustomCardId } from './customIds.ts';
import { cardVillages, withVillages, type CustomCard } from './model.ts';

/**
 * Deck para levar para fora deste navegador (sala de jogo ou compartilhamento por código): leva junto as cartas
 * criadas que ele usa (docs/SALAS.md, "Cartas criadas"). As artes que ainda estão só aqui são enviadas antes para o
 * Vercel Blob; se o envio falhar, lança erro com a mensagem para mostrar na tela.
 */
export async function withCustomCards(
  deck: { name: string; cards: Record<string, number> },
  customCards: CustomCard[],
): Promise<SharedDeck> {
  const custom: Record<string, CustomCard> = {};
  for (const id of Object.keys(deck.cards)) {
    if (!isCustomCardId(id)) continue;
    const source = customCards.find((c) => customDeckCardId(c.id) === id);
    if (!source) throw new Error(`O deck "${deck.name}" tem uma carta criada que não está mais neste navegador.`);
    let uploaded: CustomCard;
    try {
      uploaded = await ensureCardArtUploaded(source);
    } catch (e) {
      throw new Error(`Não foi possível enviar a arte da carta "${source.name || 'sem nome'}": ${(e as Error).message}`);
    }
    custom[id] = toSharedCard(uploaded);
  }
  return { name: deck.name, cards: deck.cards, ...(Object.keys(custom).length > 0 && { custom }) };
}

/** Só o que a carta precisa para ser desenhada (sem a imagem de referência do catálogo e no formato novo das vilas). */
function toSharedCard(card: CustomCard): CustomCard {
  const { reference: _reference, ...rest } = withVillages(card, cardVillages(card));
  return rest;
}
