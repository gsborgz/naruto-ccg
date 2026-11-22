'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { CARDS_BY_ID } from '@/data/cards';
import { isCustomCardId } from '@/lib/cardMaker/customIds';
import { customCardToCard } from '@/lib/cardMaker/deckCard';
import { designedCard } from '@/lib/deckDesigns';
import type { Side } from '@/lib/game/state';
import type { RoomCards } from '@/lib/rooms/client';
import { CustomSourceContext } from '@/lib/useCardCatalog';
import { cardImageUrl, type Card } from '@/models/card';
import { CardFace } from '../CardFace';

/**
 * Procura uma carta (catálogo ou carta criada da partida). `owner`: o dono da carta na partida; com ele, a carta do
 * catálogo vem com o design escolhido no deck desse jogador (`Deck.designs`).
 */
type Lookup = (id: string, owner?: Side) => Card | undefined;

/** Dono de uma carta da partida pelo `uid` (`h1`, `g7`…; ver `createGame`). */
export function ownerOfUid(uid: string): Side {
  return uid.startsWith('h') ? 'host' : 'guest';
}

const catalogLookup: Lookup = (id) => CARDS_BY_ID.get(id);

/** Procura das cartas na arena: o catálogo e, numa sala, as cartas criadas dos dois decks. */
const ArenaCardsContext = createContext<Lookup>(catalogLookup);

export function useArenaLookup(): Lookup {
  return useContext(ArenaCardsContext);
}

/**
 * Cartas criadas da partida (`useRoomCustomCards`) para a arena: as regras da tela (Ninja, Reforço, Poder) e o desenho
 * (as artes vêm do Vercel Blob pelo endereço).
 */
export function ArenaCardsProvider({ roomCards, children }: { roomCards: RoomCards | undefined; children: React.ReactNode }) {
  const customCards = roomCards?.cards;
  const converted = useMemo(() => {
    const map = new Map<string, Card>();
    for (const [id, c] of Object.entries(customCards ?? {})) map.set(id, customCardToCard(c));
    return map;
  }, [customCards]);
  const designs = roomCards?.designs;
  const versions = roomCards?.versions;
  const lookup = useCallback<Lookup>(
    (id, owner) => {
      const card = CARDS_BY_ID.get(id);
      if (!card) return converted.get(id);
      const choice = owner ? designs?.[owner]?.[id] : undefined;
      return choice ? designedCard(card, choice, (v) => versions?.[v]) : card;
    },
    [converted, designs, versions],
  );

  const source = useCallback((id: string) => customCards?.[id], [customCards]);

  return (
    <ArenaCardsContext.Provider value={lookup}>
      <CustomSourceContext.Provider value={source}>{children}</CustomSourceContext.Provider>
    </ArenaCardsContext.Provider>
  );
}

/**
 * Imagem da carta na arena: a impressa (catálogo) ou a carta montada ocupando o mesmo espaço (cartas criadas e cartas do
 * catálogo com design: o padrão delas ou o escolhido no deck).
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
  if (isCustomCardId(card.id) || card.layout) {
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
