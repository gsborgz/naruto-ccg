'use client';

import { CARDS_BY_ID } from '@/data/cards';
import type { CustomCard } from '@/lib/cardMaker/model';
import { cloudRequest } from '@/lib/cloud/library';
import { getIdentity } from '@/lib/rooms/client';
import type { Card } from '@/models/card';
import { applyChanges, type ConfigTarget, type ContentChange } from './changes';

/**
 * Gravações do conteúdo feitas pelo navegador (editor de layouts, aba Layout do detalhe da carta). Cada uma devolve a
 * versão nova do conteúdo; avise o `ContentProvider` com `useContent().saved(version)`.
 */

async function post<T>(url: string, body: unknown, method = 'POST'): Promise<T> {
  const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) throw new Error(data.message ?? `Erro ${res.status}`);
  return data;
}

/**
 * Grava uma carta do catálogo editada pelo site (aba Editar): os textos e os números, sem visual (as cartas do catálogo
 * mostram sempre a impressa). Depois, `useContent().reload()` traz a carta nova.
 */
export async function saveCatalogCard(card: Card): Promise<{ version: number }> {
  const { layout: _layout, design: _design, ...data } = card;
  return cloudRequest(`/api/content/cards/${encodeURIComponent(card.id)}`, { method: 'PUT', body: JSON.stringify({ card: data }) });
}

/** Cria um layout novo, cópia de `base`. Depois, `useContent().reload()` traz o layout novo. */
export async function createContentLayout(id: string, label: string, base: string): Promise<{ version: number; id: string }> {
  return post('/api/content/layouts', { id, label, base });
}

/** Exclui um layout criado no editor (nenhuma carta pode usá-lo). Depois, `useContent().reload()`. */
export async function deleteContentLayout(id: string): Promise<{ version: number }> {
  return post('/api/content/layouts', { id }, 'DELETE');
}

/** Cria um ícone cópia de `base` (`<grupo>:<id>`); depois, `useContent().reload()` traz o ícone novo. */
export async function createContentIcon(base: string, name?: string): Promise<{ key: string; version: number }> {
  return post('/api/content/icons', { base, name });
}

/** Exclui um ícone criado no editor (nada pode usá-lo). Depois, `useContent().reload()`. */
export async function deleteContentIcon(key: string): Promise<{ version: number }> {
  return post('/api/content/icons', { key }, 'DELETE');
}

/** Edições da configuração dos layouts e dos ícones (já aplicadas na memória pelo editor). */
export async function saveConfigChanges(
  changes: { target: ConfigTarget; path: string[]; value: ContentChange['value'] }[],
): Promise<{ version: number; written: string[] }> {
  return post('/api/content/config', { changes });
}

/** Troca uma imagem (moldura, painel, ícone) pela do arquivo escolhido (WebP ou PNG, até 2 MB). */
export async function uploadContentAsset(path: string, file: File): Promise<{ path: string; url: string; version: number }> {
  if (file.type !== 'image/webp' && file.type !== 'image/png') throw new Error('Escolha uma imagem WebP ou PNG.');
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsDataURL(file);
  });
  return post('/api/content/assets', { path, data });
}

/** Tira a imagem do Blob (ela é apagada): volta a valer a do deploy. */
export async function removeContentAsset(path: string): Promise<{ path: string; version: number }> {
  return post('/api/content/assets', { path }, 'DELETE');
}

/** Apaga do Blob as imagens dos layouts e ícones que não estão em uso. */
export async function sweepContentAssets(): Promise<{ deleted: number; kept: number }> {
  return post('/api/content/assets/sweep', {});
}

/** Envia ao Blob as imagens que ainda estão só no deploy, em lotes; `onProgress` recebe quantas faltam. */
export async function migrateContentAssets(onProgress: (done: number, remaining: number) => void): Promise<{ migrated: number; missing: string[]; version: number | null }> {
  const missing: string[] = [];
  let migrated = 0;
  let version: number | null = null;
  for (;;) {
    const r = await post<{ migrated: string[]; missing: string[]; remaining: number; version: number | null }>('/api/content/assets/migrate', { skip: missing });
    migrated += r.migrated.length;
    missing.push(...r.missing);
    version = r.version ?? version;
    onProgress(migrated, r.remaining);
    if (r.remaining === 0 || (!r.migrated.length && !r.missing.length)) break;
  }
  return { migrated, missing, version };
}
