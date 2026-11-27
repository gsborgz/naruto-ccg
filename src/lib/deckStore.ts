'use client';

import { cloudRequest, currentLibrary, updateLibrary, useLibrary } from './cloud/library.ts';
import type { DeckCards } from './deckRules.ts';
import type { Deck } from './decks/types.ts';

export type { Deck };

/**
 * Decks do jogador, na nuvem (`src/lib/decks/store.ts`; nada fica no navegador). As telas usam estes hooks e ações; a
 * memória muda na hora e a gravação vai para o servidor em seguida (`src/lib/cloud/library.ts`).
 */

/** Lista de decks. `null` enquanto carrega (e no servidor). */
export function useDecks(): Deck[] | null {
  return useLibrary()?.decks ?? null;
}

export function useDeck(id: string): Deck | null | undefined {
  const decks = useDecks();
  if (decks === null) return undefined; // ainda carregando
  return decks.find((d) => d.id === id) ?? null;
}

function now() {
  return new Date().toISOString();
}

const putDecks = (decks: Deck[]) => () => cloudRequest('/api/me/decks', { method: 'PUT', body: JSON.stringify({ decks }) });

function add(created: Deck[]) {
  void updateLibrary((lib) => ({ ...lib, decks: [...created, ...lib.decks] }), putDecks(created));
}

function replace(changed: Deck[]) {
  const byId = new Map(changed.map((d) => [d.id, d]));
  return updateLibrary((lib) => ({ ...lib, decks: lib.decks.map((d) => byId.get(d.id) ?? d) }), putDecks(changed));
}

export const deckActions = {
  create(name = 'Novo deck', cards: DeckCards = {}, designs?: Record<string, string>, sleeve?: string): Deck {
    const deck: Deck = {
      id: crypto.randomUUID(),
      name,
      cards,
      ...(designs && { designs }),
      ...(sleeve && { sleeve }),
      createdAt: now(),
      updatedAt: now(),
    };
    add([deck]);
    return deck;
  },

  /**
   * Grava as alterações do montador. O montador edita um rascunho em memória e só chama isto no botão "Salvar" (ou ao
   * confirmar "Salvar" ao sair da tela). Resolve `false` se a gravação na nuvem falhou.
   */
  save(id: string, changes: Pick<Deck, 'name' | 'cards' | 'designs' | 'sleeve'>): Promise<boolean> {
    const current = currentLibrary().decks.find((d) => d.id === id);
    if (!current) return Promise.resolve(false);
    const name = changes.name.trim() || 'Deck sem nome';
    const designs = changes.designs && Object.keys(changes.designs).length ? { ...changes.designs } : undefined;
    const { designs: _old, sleeve: _oldSleeve, ...rest } = current;
    return replace([
      {
        ...rest,
        name,
        cards: { ...changes.cards },
        ...(designs && { designs }),
        ...(changes.sleeve && { sleeve: changes.sleeve }),
        updatedAt: now(),
      },
    ]);
  },

  /** Adiciona decks importados (de um código compartilhado) como decks novos, no topo da lista. */
  importDecks(decks: (Pick<Deck, 'name' | 'cards' | 'designs'> & { sleeve?: { id: string } })[]): Deck[] {
    const created = decks.map(
      (d): Deck => ({
        id: crypto.randomUUID(),
        name: d.name,
        cards: { ...d.cards },
        ...(d.designs && Object.keys(d.designs).length > 0 && { designs: { ...d.designs } }),
        // O sleeve fica pelo id (o catálogo é de todos); se foi excluído, o deck usa o verso padrão.
        ...(d.sleeve && { sleeve: d.sleeve.id }),
        createdAt: now(),
        updatedAt: now(),
      }),
    );
    add(created);
    return created;
  },

  duplicate(id: string): Deck | null {
    const src = currentLibrary().decks.find((d) => d.id === id);
    if (!src) return null;
    return deckActions.create(`${src.name} (cópia)`, { ...src.cards }, src.designs && { ...src.designs }, src.sleeve);
  },

  remove(id: string) {
    void updateLibrary(
      (lib) => ({ ...lib, decks: lib.decks.filter((d) => d.id !== id) }),
      () => cloudRequest('/api/me/decks', { method: 'DELETE', body: JSON.stringify({ id }) }),
    );
  },

  /** Tira a carta de todos os decks só na memória (o servidor já tirou: carta criada excluída). */
  forgetCardEverywhere(cardId: string) {
    const lib = currentLibrary();
    if (!lib.decks.some((d) => cardId in d.cards)) return;
    void updateLibrary(
      (l) => ({
        ...l,
        decks: l.decks.map((d) => {
          if (!(cardId in d.cards)) return d;
          const { [cardId]: _removed, ...cards } = d.cards;
          return { ...d, cards };
        }),
      }),
      async () => undefined,
    );
  },
};
