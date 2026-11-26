'use client';

import { cloudRequest, currentLibrary, updateLibrary, useLibrary, type ThemeItem } from '../cloud/library.ts';
import { compressImage, WALLPAPER_LIMITS } from '../images/compressImage.ts';
import { getIdentity } from '../rooms/client.ts';
import type { BoardTheme } from './types.ts';

export type { ThemeItem };

/**
 * Temas da arena, do lado do navegador (na nuvem, `src/lib/themes/store.ts`; nada fica no navegador). Os temas são de
 * todos os jogadores; só quem criou edita e exclui. O tema em uso é de cada um. A memória muda na hora e a gravação vai
 * para o servidor em seguida (`src/lib/cloud/library.ts`).
 */

/** Todos os temas. `null` enquanto carrega (e no servidor). */
export function useThemes(): ThemeItem[] | null {
  return useLibrary()?.themes ?? null;
}

/** O tema em uso na arena por este jogador; `null` = o fundo padrão (ou ainda carregando). */
export function useActiveTheme(): BoardTheme | null {
  const lib = useLibrary();
  return lib?.themes.find((t) => t.theme.id === lib.activeTheme)?.theme ?? null;
}

/** Id do tema em uso (`null` = o padrão). */
export function useActiveThemeId(): string | null {
  return useLibrary()?.activeTheme ?? null;
}

const request = (method: 'PUT' | 'PATCH' | 'DELETE', body: unknown) => () =>
  cloudRequest('/api/me/themes', { method, body: JSON.stringify(body) });

export const themeActions = {
  /**
   * Grava (cria ou troca) um tema deste jogador. O primeiro tema que ele cria já fica em uso, se ele não usava nenhum.
   * Resolve `false` se a gravação falhou.
   */
  async save(theme: BoardTheme): Promise<boolean> {
    const saved = { ...theme, updatedAt: new Date().toISOString() };
    const lib = currentLibrary();
    const isNew = !lib.themes.some((t) => t.theme.id === theme.id);
    const author = getIdentity().nickname;
    const ok = await updateLibrary(
      (l) => ({
        ...l,
        themes: isNew
          ? [{ theme: saved, author, mine: true }, ...l.themes]
          : l.themes.map((t) => (t.theme.id === saved.id ? { ...t, theme: saved } : t)),
      }),
      request('PUT', { theme: saved, author }),
    );
    if (ok && isNew && !lib.activeTheme && !lib.themes.some((t) => t.mine)) await themeActions.use(saved.id);
    return ok;
  },

  /** Exclui um tema deste jogador (e a imagem dele, se nada mais a usa). Quem o usava volta ao fundo padrão. */
  remove(id: string): Promise<boolean> {
    return updateLibrary(
      (lib) => ({
        ...lib,
        themes: lib.themes.filter((t) => t.theme.id !== id),
        activeTheme: lib.activeTheme === id ? null : lib.activeTheme,
      }),
      request('DELETE', { id }),
    );
  },

  /** Usa o tema (de qualquer jogador) na arena deste jogador (`null` = o fundo padrão). O oponente vê o dele. */
  use(id: string | null): Promise<boolean> {
    if (currentLibrary().activeTheme === id) return Promise.resolve(true);
    return updateLibrary((lib) => ({ ...lib, activeTheme: id }), request('PATCH', { active: id }));
  },
};

/** Trata a imagem escolhida para o fundo (até Full HD, WebP). Lança `ImageTooLargeError` se não couber. */
export function prepareWallpaper(file: Blob): Promise<string> {
  return compressImage(file, WALLPAPER_LIMITS);
}

/**
 * Envia a imagem de fundo (data URL já tratado) para o Blob e devolve o endereço. Ela fica pendente até o tema ser
 * gravado (`saveTheme` registra o uso); se o tema não for salvo, é apagada em um dia.
 */
export async function uploadWallpaper(dataUrl: string): Promise<string> {
  const { url } = await cloudRequest<{ url: string }>('/api/art', { method: 'POST', body: JSON.stringify({ data: dataUrl }) });
  return url;
}
