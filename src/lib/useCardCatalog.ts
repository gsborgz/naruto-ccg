'use client';

import { createContext, useContext, useMemo } from 'react';
import { CARDS, CARDS_BY_ID } from '@/data/cards';
import { customDeckCardId } from '@/lib/cardMaker/customIds';
import { customCardToCard } from '@/lib/cardMaker/deckCard';
import type { CustomCard } from '@/lib/cardMaker/model';
import { useCustomCards, useOwnCustomCards } from '@/lib/cardMaker/store';
import { useOptionalContent } from '@/lib/content/ContentProvider';
import type { Card } from '@/models/card';

export interface CardCatalog {
  /** Cartas disponíveis no montador: as criadas (`/criar`) primeiro, depois as do catálogo. */
  cards: Card[];
  /** Procura no catálogo e nas cartas criadas (estável enquanto as cartas criadas não mudam). */
  lookup: (id: string) => Card | undefined;
  /** Quantas cartas criadas existem. */
  customCount: number;
}

const lookupCatalog = (id: string) => CARDS_BY_ID.get(id);

/**
 * Catálogo + cartas do criador (as do jogador e as de outros que os decks dele usam). Durante o SSR, só o catálogo. A lista é refeita a cada versão do
 * conteúdo (uma carta editada pelo site entra no lugar da antiga).
 */
export function useCardCatalog(): CardCatalog {
  const custom = useCustomCards();
  const version = useOptionalContent()?.version;
  return useMemo(() => {
    if (!custom?.length) return { cards: [...CARDS], lookup: lookupCatalog, customCount: 0 };
    const converted = custom.map(customCardToCard);
    const byId = new Map(converted.map((c) => [c.id, c]));
    return {
      cards: [...converted, ...CARDS],
      lookup: (id) => CARDS_BY_ID.get(id) ?? byId.get(id),
      customCount: converted.length,
    };
    // `version`: o conteúdo mudou (CARDS foi atualizado no lugar).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [custom, version]);
}

/**
 * Cartas criadas vindas de fora deste navegador (a partida numa sala: as do oponente e a cópia enviada das suas,
 * com as artes já baixadas). Tem prioridade sobre as cartas do criador deste navegador.
 */
export const CustomSourceContext = createContext<((cardId: string) => CustomCard | undefined) | null>(null);

/** A carta do criador por trás de uma carta `custom-<uuid>` do montador ou da partida (para desenhá-la). */
export function useCustomSource(cardId: string): CustomCard | undefined {
  const external = useContext(CustomSourceContext);
  const custom = useCustomCards();
  return useMemo(
    () => external?.(cardId) ?? custom?.find((c) => customDeckCardId(c.id) === cardId),
    [external, custom, cardId],
  );
}

/** A carta criada é do jogador (dá para abrir e editar no `/criar`)? */
export function useIsLocalCustomCard(cardId: string): boolean {
  const custom = useOwnCustomCards();
  return useMemo(() => !!custom?.some((c) => customDeckCardId(c.id) === cardId), [custom, cardId]);
}
