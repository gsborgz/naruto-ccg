'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { CARDS_BY_ID } from '@/data/cards';
import { hasFixedArt, withFixedArt } from '@/lib/altArts';
import { isCustomCardId } from '@/lib/cardMaker/customIds';
import { customCardToCard } from '@/lib/cardMaker/deckCard';
import type { Side } from '@/lib/game/state';
import type { RoomCards } from '@/lib/rooms/client';
import { CustomSourceContext } from '@/lib/useCardCatalog';
import { cardImageUrl, type Card } from '@/models/card';
import { CardFace } from '../CardFace';

/**
 * Procura uma carta. Com `owner` (o dono da carta na partida), ela vem com a arte alternativa que ele levou no deck
 * (ou a original), para desenhar; sem `owner`, só os dados (tipo, regras).
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
 * Cartas criadas e artes alternativas da partida (`useRoomCustomCards`) para a arena: as regras da tela (Ninja,
 * Reforço, Poder) e o desenho (as artes vêm do Vercel Blob pelo endereço). Cada carta aparece com a arte escolhida
 * pelo dono dela, para os dois jogadores.
 */
export function ArenaCardsProvider({ roomCards, children }: { roomCards: RoomCards | undefined; children: React.ReactNode }) {
  const customCards = roomCards?.cards;
  const arts = roomCards?.arts;
  const converted = useMemo(() => {
    const map = new Map<string, Card>();
    for (const [id, c] of Object.entries(customCards ?? {})) map.set(id, customCardToCard(c));
    return map;
  }, [customCards]);
  // Cartas com a arte do dono, guardadas para a referência não mudar a cada renderização.
  const withArt = useMemo(() => new Map<string, Card>(), [converted, arts]); // eslint-disable-line react-hooks/exhaustive-deps
  const lookup = useCallback<Lookup>(
    (id, owner) => {
      const card = CARDS_BY_ID.get(id) ?? converted.get(id);
      if (!card || !owner || isCustomCardId(id)) return card;
      const key = `${owner}:${id}`;
      let shown = withArt.get(key);
      if (!shown) {
        shown = withFixedArt(card, arts?.[owner]?.[id] ?? null);
        withArt.set(key, shown);
      }
      return shown;
    },
    [converted, arts, withArt],
  );

  const source = useCallback((id: string) => customCards?.[id], [customCards]);

  return (
    <ArenaCardsContext.Provider value={lookup}>
      <CustomSourceContext.Provider value={source}>{children}</CustomSourceContext.Provider>
    </ArenaCardsContext.Provider>
  );
}

/**
 * Imagem da carta na arena: a impressa (catálogo) ou, nas cartas criadas e nas com arte alternativa (do dono, ver
 * `Lookup`), a carta montada ocupando o mesmo espaço.
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
  if (isCustomCardId(card.id) || (hasFixedArt(card) && card.altArt)) {
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
