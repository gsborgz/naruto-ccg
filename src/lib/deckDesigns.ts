'use client';

import { useMemo } from 'react';
import { withDesign, withoutLayout } from './cardMaker/catalogEdit.ts';
import { isCustomCardId } from './cardMaker/customIds.ts';
import type { CustomCard } from './cardMaker/model.ts';
import { useLibrary } from './cloud/library.ts';
import type { CardLookup } from './deckRules.ts';
import { ORIGINAL_DESIGN } from './decks/types.ts';
import type { Card } from '../models/card.ts';

/**
 * Design de cada carta num deck (`Deck.designs`): o jogador escolhe, carta a carta, a imagem impressa ou uma das versões
 * dela; sem escolha, vale o design padrão da carta (o mesmo para todo mundo). As versões vêm da nuvem (as do jogador e
 * as de outros, carregadas com a biblioteca: `src/lib/cloud/library.ts`).
 */

/** A carta como fica no deck, com o design escolhido. Versão que não existe mais: o design padrão. */
export function designedCard(card: Card, choice: string | undefined, versions: (id: string) => CustomCard | undefined): Card {
  if (!choice || isCustomCardId(card.id)) return card;
  if (choice === ORIGINAL_DESIGN) return withoutLayout(card);
  const version = versions(choice);
  return version ? withDesign(card, version) : card;
}

/** As versões conhecidas (do jogador e de outros), pelo id. */
export function useKnownVersions(): (id: string) => CustomCard | undefined {
  const lib = useLibrary();
  return useMemo(() => {
    const byId = new Map<string, CustomCard>();
    for (const c of lib?.mine ?? []) byId.set(c.id, c);
    for (const [id, o] of lib?.others ?? []) byId.set(id, o.card);
    return (id: string) => byId.get(id);
  }, [lib]);
}

/** `lookup` que devolve as cartas com o design escolhido no deck (para mostrar e imprimir). */
export function useDesignedLookup(lookup: CardLookup, designs: Record<string, string> | undefined): CardLookup {
  const versions = useKnownVersions();
  return useMemo(() => {
    if (!designs || !Object.keys(designs).length) return lookup;
    const cache = new Map<string, Card | undefined>();
    return (id: string) => {
      if (!cache.has(id)) {
        const card = lookup(id);
        cache.set(id, card && designedCard(card, designs[id], versions));
      }
      return cache.get(id);
    };
  }, [lookup, designs, versions]);
}
