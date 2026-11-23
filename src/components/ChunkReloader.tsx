'use client';

import { useEffect } from 'react';

/** Quando foi a última recarga por este motivo (evita recarregar sem parar se o erro for outro). */
const KEY = 'naruto-ccg:chunk-reload';
const MIN_INTERVAL_MS = 30_000;

/** Erro de um pedaço do código que não existe mais no servidor. */
function isChunkError(reason: unknown): boolean {
  if (!reason || typeof reason !== 'object') return false;
  const { name, message } = reason as { name?: unknown; message?: unknown };
  return (
    name === 'ChunkLoadError' ||
    (typeof message === 'string' && /Loading (CSS )?chunk [\w-]+ failed|Failed to fetch dynamically imported module/i.test(message))
  );
}

/**
 * Depois de um deploy novo, uma aba aberta antes dele ainda roda o código antigo e, ao abrir uma tela, pede pedaços do
 * código que não existem mais no servidor (`ChunkLoadError`, ex.: `/_next/static/chunks/8077.undefined.js`). Nesse
 * caso a página recarrega uma vez, já com a versão nova (no máximo uma vez a cada 30 s).
 */
export function ChunkReloader() {
  useEffect(() => {
    const recover = (reason: unknown) => {
      if (!isChunkError(reason)) return;
      try {
        const last = Number(sessionStorage.getItem(KEY)) || 0;
        if (Date.now() - last < MIN_INTERVAL_MS) return;
        sessionStorage.setItem(KEY, String(Date.now()));
      } catch {
        // Sem sessionStorage: recarrega mesmo assim (o erro não tem outra saída).
      }
      window.location.reload();
    };
    const onError = (e: ErrorEvent) => recover(e.error);
    const onRejection = (e: PromiseRejectionEvent) => recover(e.reason);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);
  return null;
}
