'use client';

import { cloudRequest } from '../cloud/library.ts';
import type { CardOwnership } from '../customCards/store.ts';
import { migrateCustomCard, type CustomCard } from './model.ts';

/**
 * Alters das cartas do catálogo, do lado do navegador (`src/lib/customCards/`): as cartas do criador ligadas a uma
 * carta do catálogo (`CustomCard.source`), de todos os jogadores. O montador as usa na escolha de design de cada carta
 * do deck.
 */

export interface VersionView {
  card: CustomCard;
  author: string;
  /** De quem é: do jogador (`mine`) ou de outro jogador. */
  owner: CardOwnership;
}

/** As alters de uma carta do catálogo, da mais nova para a mais antiga. */
export async function fetchVersions(catalogId: string): Promise<VersionView[]> {
  const { items } = await cloudRequest<{ items: VersionView[] }>(`/api/versions?card=${encodeURIComponent(catalogId)}`);
  return items.map((v) => ({ ...v, card: migrateCustomCard(v.card) }));
}
