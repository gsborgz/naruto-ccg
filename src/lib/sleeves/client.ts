'use client';

import { cloudRequest, currentLibrary, updateLibrary, useLibrary, type SleeveItem } from '../cloud/library.ts';
import { compressImage } from '../images/compressImage.ts';
import { getIdentity } from '../rooms/client.ts';
import { frameRect, type SleeveFrame } from './frame.ts';
import { SLEEVE_SIZE, type Sleeve } from './types.ts';

export type { SleeveItem };

/**
 * Sleeves, do lado do navegador (na nuvem, `src/lib/sleeves/store.ts`). São de todos os jogadores; só quem criou edita
 * e exclui. A memória muda na hora e a gravação vai para o servidor em seguida (`src/lib/cloud/library.ts`).
 */

/** Todos os sleeves. `null` enquanto carrega (e no servidor). */
export function useSleeves(): SleeveItem[] | null {
  return useLibrary()?.sleeves ?? null;
}

/** O sleeve com esse id (`undefined` se não existe mais ou ainda carrega). */
export function findSleeve(sleeves: SleeveItem[] | null | undefined, id: string | undefined): Sleeve | undefined {
  return id ? sleeves?.find((s) => s.sleeve.id === id)?.sleeve : undefined;
}

const request = (method: 'PUT' | 'DELETE', body: unknown) => () =>
  cloudRequest('/api/me/sleeves', { method, body: JSON.stringify(body) });

export const sleeveActions = {
  /** Grava (cria ou troca) um sleeve deste jogador. Resolve `false` se a gravação falhou. */
  save(sleeve: Sleeve): Promise<boolean> {
    const saved = { ...sleeve, updatedAt: new Date().toISOString() };
    const isNew = !currentLibrary().sleeves.some((s) => s.sleeve.id === sleeve.id);
    const author = getIdentity().nickname;
    return updateLibrary(
      (lib) => ({
        ...lib,
        sleeves: isNew
          ? [{ sleeve: saved, author, mine: true }, ...lib.sleeves]
          : lib.sleeves.map((s) => (s.sleeve.id === saved.id ? { ...s, sleeve: saved } : s)),
      }),
      request('PUT', { sleeve: saved, author }),
    );
  },

  /** Exclui um sleeve deste jogador (e a imagem, se nada mais a usa). Os decks que o usam voltam ao verso padrão. */
  remove(id: string): Promise<boolean> {
    return updateLibrary((lib) => ({ ...lib, sleeves: lib.sleeves.filter((s) => s.sleeve.id !== id) }), request('DELETE', { id }));
  },
};

/**
 * Recorta a imagem do sleeve no enquadramento escolhido (`src/lib/sleeves/frame.ts`), em 750×1050 (proporção da
 * carta), e comprime em WebP. `source` é o arquivo escolhido ou o endereço da imagem atual (Blob, com CORS). Lança
 * `ImageTooLargeError` se não couber.
 */
export async function renderSleeveImage(source: Blob | string, frame: SleeveFrame): Promise<string> {
  const blob = typeof source === 'string' ? await (await fetch(source)).blob() : source;
  const bitmap = await createImageBitmap(blob);
  try {
    const { w, h } = SLEEVE_SIZE;
    const r = frameRect(bitmap.width, bitmap.height, frame);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    // Fundo opaco: uma imagem com transparência deixaria o verso padrão (a camada de baixo, na arena) aparecer.
    ctx.fillStyle = '#26262c';
    ctx.fillRect(0, 0, w, h);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, r.left, r.top, r.width, r.height);
    return await compressImage(canvas.toDataURL('image/png'));
  } finally {
    bitmap.close();
  }
}

/**
 * Envia a imagem (data URL já tratado) para o Blob e devolve o endereço. Fica pendente até o sleeve ser gravado
 * (`saveSleeve` registra o uso); se não for salvo, é apagada em um dia.
 */
export async function uploadSleeveImage(dataUrl: string): Promise<string> {
  const { url } = await cloudRequest<{ url: string }>('/api/art', { method: 'POST', body: JSON.stringify({ data: dataUrl }) });
  return url;
}
