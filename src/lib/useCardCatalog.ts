'use client';

import { useMemo } from 'react';
import { CARDS, CARDS_BY_ID } from '@/data/cards';
import { customDeckCardId } from '@/lib/cardMaker/customIds';
import { customCardToCard } from '@/lib/cardMaker/deckCard';
import type { CustomCard } from '@/lib/cardMaker/model';
import { useCustomCards } from '@/lib/cardMaker/store';
import type { Card } from '@/models/card';

export interface CardCatalog {
  /** Cartas disponíveis no montador: as criadas (`/criar`) primeiro, depois as do catálogo. */
  cards: Card[];
  /** Procura no catálogo e nas cartas criadas (estável enquanto as cartas criadas não mudam). */
  lookup: (id: string) => Card | undefined;
  /** Quantas cartas criadas existem. */
  customCount: number;
}

const catalogOnly: CardCatalog = { cards: CARDS, lookup: (id) => CARDS_BY_ID.get(id), customCount: 0 };

/** Catálogo + cartas do criador deste navegador. Durante o SSR, só o catálogo. */
export function useCardCatalog(): CardCatalog {
  const custom = useCustomCards();
  return useMemo(() => {
    if (!custom?.length) return catalogOnly;
    const converted = custom.map(customCardToCard);
    const byId = new Map(converted.map((c) => [c.id, c]));
    return {
      cards: [...converted, ...CARDS],
      lookup: (id) => CARDS_BY_ID.get(id) ?? byId.get(id),
      customCount: converted.length,
    };
  }, [custom]);
}

/** A carta do criador por trás de uma carta `custom-<uuid>` do montador (para desenhá-la). */
export function useCustomSource(cardId: string): CustomCard | undefined {
  const custom = useCustomCards();
  return useMemo(() => custom?.find((c) => customDeckCardId(c.id) === cardId), [custom, cardId]);
}
