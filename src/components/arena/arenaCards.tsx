'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { CARDS_BY_ID } from '@/data/cards';
import { isCustomCardId } from '@/lib/cardMaker/customIds';
import { customCardToCard } from '@/lib/cardMaker/deckCard';
import type { CustomCard } from '@/lib/cardMaker/model';
import { CustomSourceContext } from '@/lib/useCardCatalog';
import { cardImageUrl, type Card } from '@/models/card';
import { CardFace } from '../CardFace';

type Lookup = (id: string) => Card | undefined;

const catalogLookup: Lookup = (id) => CARDS_BY_ID.get(id);

/** Procura das cartas na arena: o catálogo e, numa sala, as cartas criadas dos dois decks. */
const ArenaCardsContext = createContext<Lookup>(catalogLookup);

export function useArenaLookup(): Lookup {
  return useContext(ArenaCardsContext);
}

/**
 * Cartas criadas da partida (`useRoomCustomCards`) para a arena: as regras da tela (Ninja, Reforço, Poder) e o
 * desenho (as artes vêm do Vercel Blob pelo endereço da carta).
 */
export function ArenaCardsProvider({
  customCards,
  children,
}: {
  customCards: Record<string, CustomCard> | undefined;
  children: React.ReactNode;
}) {
  const converted = useMemo(() => {
    const map = new Map<string, Card>();
    for (const [id, c] of Object.entries(customCards ?? {})) map.set(id, customCardToCard(c));
    return map;
  }, [customCards]);
  const lookup = useCallback<Lookup>((id) => CARDS_BY_ID.get(id) ?? converted.get(id), [converted]);

  const source = useCallback((id: string) => customCards?.[id], [customCards]);

  return (
    <ArenaCardsContext.Provider value={lookup}>
      <CustomSourceContext.Provider value={source}>{children}</CustomSourceContext.Provider>
    </ArenaCardsContext.Provider>
  );
}

/**
 * Imagem da carta na arena: a impressa (catálogo) ou, nas cartas criadas, a carta montada ocupando o mesmo espaço.
 */
export function ArenaCardImage({
  card,
  size,
  alt,
  className,
  lazy = true,
}: {
  card: Card;
  size: 'thumb' | 'full';
  alt: string;
  className?: string;
  lazy?: boolean;
}) {
  if (isCustomCardId(card.id)) {
    return (
      <div role="img" aria-label={alt} className={className} style={{ pointerEvents: 'none', ...(className ? {} : { width: '100%', height: '100%' }) }}>
        <CardFace card={card} size={size} className="h-full" />
      </div>
    );
  }
  return (
    <img
      src={cardImageUrl(card, size)}
      alt={alt}
      className={className}
      draggable={false}
      loading={lazy ? 'lazy' : undefined}
    />
  );
}
