import { removeLegacyAltArts } from '../artStore.ts';
import { hydrateContent } from './hydrate.ts';
import { readContent, readContentVersion } from './store.ts';
import type { ContentSnapshot } from './types.ts';

/**
 * Conteúdo no servidor: lido do Redis e guardado na memória da função. A versão é conferida no Redis no máximo a cada
 * `RECHECK_MS`; só quando ela muda o conteúdo inteiro é lido de novo. Assim cada pedido custa no máximo um GET.
 */
const RECHECK_MS = 15_000;

let cached: { snapshot: ContentSnapshot; checkedAt: number } | null = null;
let loading: Promise<ContentSnapshot> | null = null;

/** Limpeza das artes alternativas removidas do app: uma vez por instância (a marca no Redis evita repetir de verdade). */
let legacyCleanup: Promise<void> | null = null;

async function load(): Promise<ContentSnapshot> {
  legacyCleanup ??= removeLegacyAltArts().catch((e) => {
    console.error('Falha ao apagar as artes alternativas antigas', e);
    legacyCleanup = null;
  });
  await legacyCleanup;
  const version = await readContentVersion();
  if (cached && version === cached.snapshot.version) {
    cached.checkedAt = Date.now();
    return cached.snapshot;
  }
  const snapshot = await readContent();
  hydrateContent(snapshot);
  cached = { snapshot, checkedAt: Date.now() };
  return snapshot;
}

/**
 * Garante o conteúdo carregado (`CARDS`, `LAYOUTS`, ícones) antes de uma rota usar as cartas. Chame no começo de toda
 * rota do servidor que lê o catálogo.
 */
export async function ensureContent(): Promise<ContentSnapshot> {
  if (cached && Date.now() - cached.checkedAt < RECHECK_MS) return cached.snapshot;
  loading ??= load().finally(() => {
    loading = null;
  });
  return loading;
}

/** Depois de gravar uma edição: a próxima leitura confere a versão no Redis. */
export function invalidateContent(): void {
  if (cached) cached.checkedAt = 0;
}
