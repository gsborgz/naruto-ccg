import { createHash } from 'node:crypto';
import { del, list, put } from '@vercel/blob';
import { ATTRIBUTE_KANJI } from '../cardMaker/layouts/shared.ts';
import { VILLAGES } from '../cardMaker/model.ts';
import { ArtError, isBlobConfigured } from '../artStore.ts';
import { ASSET_PREFIX, assetPathOf, isAssetPath } from './assets.ts';
import { readAssets, removeAsset as removeAssetEntry, saveAsset } from './store.ts';
import type { ContentSnapshot } from './types.ts';

/**
 * Imagens dos layouts e dos ícones no Vercel Blob (só no servidor). O arquivo é
 * `naruto-ccg/card-layouts/<caminho>-<hash>.<ext>`: cada versão tem um nome próprio, então o cache pode ser eterno.
 *
 * Só fica no Blob o que está em uso (no mapa `naruto-ccg:content:assets`):
 * - ao trocar uma imagem, a anterior é apagada na hora (não há histórico de imagens);
 * - ao tirar uma imagem (voltar para a do deploy), ela é apagada;
 * - se a gravação no Redis falhar depois do envio, a enviada é apagada;
 * - `sweepAssets` apaga o que sobrou na pasta sem estar no mapa (ex.: função interrompida no meio de um envio).
 */

/** Limite de uma imagem de layout ou ícone (as molduras otimizadas têm até ~320 KB). */
export const LAYOUT_ASSET_MAX_BYTES = 2_000_000;

const DATA_URL = /^data:image\/(webp|png);base64,[A-Za-z0-9+/]+=*$/;
const BLOB_DIR = 'naruto-ccg/card-layouts/';

function requireBlob() {
  if (!isBlobConfigured()) throw new ArtError(503, 'O armazenamento de imagens (Vercel Blob) não está configurado no servidor.');
}

async function putAsset(path: string, bytes: Buffer, type: string): Promise<string> {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const ext = type === 'image/png' ? 'png' : 'webp';
  const blob = await put(`${BLOB_DIR}${path.replace(/\.webp$/, '')}-${hash}.${ext}`, bytes, {
    access: 'public',
    contentType: type,
    addRandomSuffix: false,
    allowOverwrite: true, // mesmo nome = mesmo conteúdo
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return blob.url;
}

const isOurs = (u: string) => {
  try {
    return new URL(u).pathname.startsWith(`/${BLOB_DIR}`);
  } catch {
    return false;
  }
};

/** Apaga do Blob imagens desta pasta que saíram de uso. Uma falha fica no log (a varredura apaga depois). */
async function dropFromBlob(urls: (string | null | undefined)[]) {
  const ours = [...new Set(urls.filter((u): u is string => !!u && isOurs(u)))];
  if (ours.length) await del(ours).catch((e) => console.error('Falha ao apagar imagens antigas do Blob', e));
}

/** Apaga do Blob imagens que saíram do mapa (ex.: as de um layout excluído). */
export async function dropAssets(urls: string[]): Promise<void> {
  if (urls.length && isBlobConfigured()) await dropFromBlob(urls);
}

/** Grava a URL do caminho no mapa e apaga a anterior; se a gravação falhar, apaga a que acabou de ser enviada. */
async function swapAsset(path: string, url: string): Promise<number> {
  let saved;
  try {
    saved = await saveAsset(path, url);
  } catch (e) {
    await dropFromBlob([url]);
    throw e;
  }
  // Mesma imagem enviada de novo = mesmo nome no Blob: não apaga.
  if (saved.previous !== url) await dropFromBlob([saved.previous]);
  return saved.version;
}

/** Troca a imagem de um caminho pela enviada (data URL WebP ou PNG). */
export async function uploadAsset(path: unknown, data: unknown): Promise<{ path: string; url: string; version: number }> {
  if (!isAssetPath(path)) throw new ArtError(400, 'Caminho de imagem inválido.');
  if (typeof data !== 'string' || !DATA_URL.test(data)) throw new ArtError(400, 'Envie a imagem em WebP ou PNG.');
  requireBlob();
  const bytes = Buffer.from(data.slice(data.indexOf(',') + 1), 'base64');
  if (bytes.length > LAYOUT_ASSET_MAX_BYTES) throw new ArtError(400, `Imagem acima de ${LAYOUT_ASSET_MAX_BYTES / 1_000_000} MB.`);
  const type = data.startsWith('data:image/png') ? 'image/png' : 'image/webp';
  const url = await putAsset(path, bytes, type);
  return { path, url, version: await swapAsset(path, url) };
}

/** Tira a imagem do Blob de um caminho: ela é apagada e volta a valer a do deploy (public/card-layouts/). */
export async function removeAsset(path: unknown): Promise<{ path: string; version: number }> {
  if (!isAssetPath(path)) throw new ArtError(400, 'Caminho de imagem inválido.');
  requireBlob();
  const { version, previous } = await removeAssetEntry(path);
  await dropFromBlob([previous]);
  return { path, version };
}

/** Envio que pode estar no meio (já no Blob, ainda não no mapa): a varredura não mexe em arquivos mais novos que isso. */
const SWEEP_GRACE_MS = 10 * 60 * 1000;

/** Apaga da pasta das imagens dos layouts e ícones tudo o que não está no mapa. */
export async function sweepAssets(): Promise<{ deleted: number; kept: number }> {
  requireBlob();
  const inUse = new Set(Object.values(await readAssets()));
  const orphans: string[] = [];
  let kept = 0;
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: BLOB_DIR, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      if (inUse.has(blob.url) || Date.now() - new Date(blob.uploadedAt).getTime() < SWEEP_GRACE_MS) kept++;
      else orphans.push(blob.url);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  for (let i = 0; i < orphans.length; i += 100) await del(orphans.slice(i, i + 100));
  return { deleted: orphans.length, kept };
}

/**
 * Todos os caminhos de imagem que o app usa: os da configuração dos layouts e dos ícones (molduras, painéis, ícones) e
 * os montados no código (vilas, kanjis de custo e de atributo, mancha do nome).
 */
export function knownAssetPaths(content: ContentSnapshot): string[] {
  const found = new Set<string>();
  const visit = (node: unknown) => {
    if (typeof node === 'string') {
      const path = assetPathOf(node);
      if (path) found.add(path);
    } else if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === 'object') Object.values(node).forEach(visit);
  };
  visit(content.layouts);
  visit(content.icons);
  for (const v of VILLAGES) {
    found.add(`icons/village/village-${v}.webp`);
    found.add(`icons/village/village-${v}-rogue.webp`);
  }
  for (const el of ['earth', 'fire', 'lightning', 'void', 'water', 'wind']) found.add(`icons/cost/cost-chakra-${el}.webp`);
  for (const slug of ATTRIBUTE_KANJI) found.add(`icons/attributes/${slug}.webp`);
  found.add('icons/banner/name-banner-01.webp');
  return [...found].sort();
}

/**
 * Envia ao Blob as imagens que ainda estão só no deploy (public/card-layouts/), em lotes: busca cada uma no próprio
 * site e grava no mapa. Imagem que não existe no deploy (ex.: vila sem versão "rogue") fica de fora.
 */
export async function migrateAssets(
  origin: string,
  content: ContentSnapshot,
  limit: number,
  skip: ReadonlySet<string> = new Set(),
): Promise<{ migrated: string[]; missing: string[]; remaining: number; version: number | null }> {
  requireBlob();
  // `skip`: as que já faltaram num lote anterior (o navegador manda de volta), para não buscar de novo.
  const pending = knownAssetPaths(content).filter((p) => !content.assets[p] && !skip.has(p));
  const batch = pending.slice(0, limit);
  const migrated: string[] = [];
  const missing: string[] = [];
  let version: number | null = null;
  for (const path of batch) {
    const res = await fetch(new URL(`${ASSET_PREFIX}${path}`, origin));
    if (!res.ok) {
      missing.push(path);
      continue;
    }
    const type = res.headers.get('content-type')?.includes('png') ? 'image/png' : 'image/webp';
    const url = await putAsset(path, Buffer.from(await res.arrayBuffer()), type);
    version = await swapAsset(path, url);
    migrated.push(path);
  }
  return { migrated, missing, remaining: pending.length - batch.length, version };
}
