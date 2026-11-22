'use client';

import { CARDS } from '../../data/cards.ts';
import { cardImageUrl } from '../../models/card.ts';
import { cloudRequest } from '../cloud/library.ts';
import type { CardOwnership } from '../customCards/store.ts';
import { migrateCustomCard, type CustomCard } from './model.ts';

/**
 * Versões das cartas do catálogo, do lado do navegador (`src/lib/customCards/`): as cartas do criador importadas de uma
 * carta do catálogo (`CustomCard.source`), de todos os jogadores. O detalhe da carta lista as versões (Artes
 * alternativas) e o montador as usa na escolha de design de cada carta do deck.
 */

export interface VersionView {
  card: CustomCard;
  author: string;
  /** De quem é: do jogador (`mine`), do sistema (feita do layout antigo da carta) ou de outro jogador. */
  owner: CardOwnership;
}

/**
 * Carta do catálogo de onde a carta criada foi importada: `source` ou, nas cartas importadas antes desse campo, a da
 * imagem de comparação (`reference`).
 */
export function customCardSource(card: CustomCard): string | undefined {
  if (card.source) return card.source;
  if (!card.reference) return undefined;
  return CARDS.find((c) => cardImageUrl(c) === card.reference)?.id;
}

/** As versões de uma carta do catálogo, da mais nova para a mais antiga. */
export async function fetchVersions(catalogId: string): Promise<VersionView[]> {
  const { items } = await cloudRequest<{ items: VersionView[] }>(`/api/versions?card=${encodeURIComponent(catalogId)}`);
  return items.map((v) => ({ ...v, card: migrateCustomCard(v.card) }));
}

/**
 * Tira a versão da lista: a do jogador e a do sistema são excluídas de vez; a de outro jogador só sai da lista. Diz se o
 * conteúdo do jogo mudou (era o design padrão da carta).
 */
export async function removeVersion(catalogId: string, id: string): Promise<boolean> {
  const { contentChanged } = await cloudRequest<{ contentChanged: boolean }>('/api/versions', {
    method: 'DELETE',
    body: JSON.stringify({ card: catalogId, id }),
  });
  return contentChanged;
}
