'use client';

import { useMemo } from 'react';
import { cloudRequest, currentLibrary, updateLibrary, useLibrary } from '../cloud/library.ts';
import { getIdentity } from '../rooms/client.ts';
import type { CustomCard } from './model.ts';

/**
 * Cartas do criador, na nuvem (`src/lib/customCards/`; nada fica no navegador). As do jogador são gravadas pelo botão
 * **Salvar** do criador, com as artes já no Vercel Blob; as de outros jogadores (de decks importados ou escolhidas como
 * design num deck) vêm junto para serem desenhadas, mas não são editadas aqui.
 */

/** Todas as cartas do criador conhecidas: as do jogador e as de outros que os decks usam. `null` enquanto carrega. */
export function useCustomCards(): CustomCard[] | null {
  const lib = useLibrary();
  return useMemo(() => (lib ? [...lib.mine, ...[...lib.others.values()].map((o) => o.card)] : null), [lib]);
}

/** Só as cartas do jogador (as que ele edita no criador). `null` enquanto carrega. */
export function useOwnCustomCards(): CustomCard[] | null {
  return useLibrary()?.mine ?? null;
}

/** Cartas conhecidas agora (fora do React). */
export function readCustomCards(): CustomCard[] {
  const lib = currentLibrary();
  return [...lib.mine, ...[...lib.others.values()].map((o) => o.card)];
}

/** A carta é do jogador (dá para abrir e editar no criador)? */
export function isOwnCustomCard(id: string): boolean {
  return currentLibrary().mine.some((c) => c.id === id);
}

export const customCardActions = {
  /**
   * Cria ou atualiza uma carta do jogador na nuvem. As artes precisam estar no Blob (`uploadCardArt`). Resolve `false`
   * se a gravação falhou (já avisado na tela).
   */
  save(card: CustomCard): Promise<boolean> {
    const updated = { ...card, updatedAt: new Date().toISOString() };
    const { reference: _reference, ...sent } = updated;
    return updateLibrary(
      (lib) => {
        const exists = lib.mine.some((c) => c.id === card.id);
        return { ...lib, mine: exists ? lib.mine.map((c) => (c.id === card.id ? updated : c)) : [updated, ...lib.mine] };
      },
      async () => {
        const res = await cloudRequest<{ contentChanged: boolean }>('/api/me/cards', {
          method: 'PUT',
          body: JSON.stringify({ card: sent, author: getIdentity().nickname }),
        });
        // A carta é o design padrão de uma carta do catálogo: o conteúdo do jogo mudou.
        if (res.contentChanged) window.dispatchEvent(new Event('naruto-ccg:content-changed'));
      },
    );
  },

  /** Exclui de vez: sai dos decks do jogador, e a arte sai do Blob se nada mais a usa. */
  remove(id: string): Promise<boolean> {
    return updateLibrary(
      (lib) => ({ ...lib, mine: lib.mine.filter((c) => c.id !== id) }),
      async () => {
        const res = await cloudRequest<{ contentChanged: boolean }>('/api/me/cards', { method: 'DELETE', body: JSON.stringify({ id }) });
        if (res.contentChanged) window.dispatchEvent(new Event('naruto-ccg:content-changed'));
      },
    );
  },
};
