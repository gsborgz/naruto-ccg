/**
 * Imagens dos layouts e dos ícones (molduras, painéis, ícones, kanjis, vilas). A configuração guarda sempre o caminho
 * "lógico" da imagem, como `/card-layouts/layout-02/jutsu-frame.webp`; o mapa de imagens do conteúdo (Redis,
 * `naruto-ccg:content:assets`) diz onde cada uma está de fato no Vercel Blob. Sem entrada no mapa, vale o arquivo de
 * public/card-layouts/ (o que vem no deploy).
 *
 * Assim, trocar a imagem de uma moldura é só gravar a URL nova no mapa: todas as cartas que usam aquela moldura mudam
 * juntas, sem mexer na configuração dos layouts.
 */

export const ASSET_PREFIX = '/card-layouts/';

/** Caminho (sem o prefixo, ex.: `layout-02/jutsu-frame.webp`) → URL no Blob. */
export type AssetMap = Record<string, string>;

const assets = new Map<string, string>();

/** Troca o mapa de imagens em uso (chamado por `hydrateContent` e depois de enviar uma imagem). */
export function installAssets(map: AssetMap): void {
  assets.clear();
  for (const [path, url] of Object.entries(map)) assets.set(path, url);
}

/** Uma imagem do mapa mudou (envio pelo editor de layouts); `null` = tirada do Blob (volta a do deploy). */
export function installAsset(path: string, url: string | null): void {
  if (url) assets.set(path, url);
  else assets.delete(path);
}

export function currentAssets(): AssetMap {
  return Object.fromEntries(assets);
}

/** URL de verdade de uma imagem da configuração (`/card-layouts/...` → Blob, se ela foi enviada). */
export function assetUrl(url: string): string;
export function assetUrl(url: string | undefined): string | undefined;
export function assetUrl(url: string | undefined): string | undefined {
  if (!url?.startsWith(ASSET_PREFIX)) return url;
  return assets.get(url.slice(ASSET_PREFIX.length)) ?? url;
}

/** Caminho válido de imagem do mapa: pastas e nomes simples, terminando em .webp (sem `..`). */
export function isAssetPath(path: unknown): path is string {
  return typeof path === 'string' && path.length <= 200 && /^[a-z0-9][a-z0-9_-]*(\/[a-z0-9][a-z0-9_-]*)*\.webp$/.test(path);
}

/** Caminho do mapa a partir da URL lógica (`/card-layouts/icons/x.webp` → `icons/x.webp`). */
export function assetPathOf(url: string): string | null {
  if (!url.startsWith(ASSET_PREFIX)) return null;
  const path = url.slice(ASSET_PREFIX.length);
  return isAssetPath(path) ? path : null;
}
