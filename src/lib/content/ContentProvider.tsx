'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { installAsset } from './assets';
import { contentVersion, hydrateContent, markContentVersion } from './hydrate';
import type { ContentSnapshot } from './types';

/**
 * Carrega o conteúdo do jogo (cartas, layouts, ícones e imagens, do Redis) antes de mostrar as telas: busca a versão
 * atual em `/api/content` e o conteúdo em `/api/content/<versão>`, que o navegador guarda em cache. Enquanto isso, mostra
 * "Carregando cartas…".
 *
 * Sem a senha do site (401), mostra a tela mesmo assim: é a de login, que não precisa das cartas.
 */

interface ContentState {
  /** Versão do conteúdo em uso. */
  version: number;
  /** Uma edição foi gravada (o servidor devolveu a versão nova); a memória já tem a edição. */
  saved: (version: number) => void;
  /** Uma imagem foi trocada: usa a URL nova e redesenha quem depende dela. */
  assetChanged: (path: string, url: string | null, version: number) => void;
  /** Busca o conteúdo de novo (ex.: depois de restaurar uma versão do histórico). */
  reload: () => Promise<void>;
}

const ContentContext = createContext<ContentState | null>(null);

/** O erro com a mensagem do servidor, se ele mandou uma. */
async function responseError(res: Response): Promise<Error> {
  const body = (await res.json().catch(() => null)) as { message?: unknown } | null;
  return new Error(typeof body?.message === 'string' ? `Erro ${res.status}: ${body.message}` : `Erro ${res.status}`);
}

async function fetchContent(): Promise<number> {
  const res = await fetch('/api/content', { cache: 'no-store' });
  if (res.status === 401) throw new Unauthorized();
  if (!res.ok) throw await responseError(res);
  const { version } = (await res.json()) as { version: number };
  if (version === contentVersion()) return version;
  // `?p=`: formato da resposta (2 = com `namesEn`); muda o endereço para não usar a resposta antiga do cache.
  const snapshot = await fetch(`/api/content/${version}?p=2`);
  if (!snapshot.ok) throw await responseError(snapshot);
  const content = (await snapshot.json()) as ContentSnapshot;
  hydrateContent(content);
  return content.version;
}

class Unauthorized extends Error {}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ version: number; tick: number } | 'locked' | { error: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const version = await fetchContent();
      setState((s) => ({ version, tick: (s && typeof s === 'object' && 'tick' in s ? s.tick : 0) + 1 }));
    } catch (e) {
      setState(e instanceof Unauthorized ? 'locked' : { error: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  useEffect(() => {
    void load();
    // Uma carta do criador gravada é o design padrão de uma carta do catálogo: o conteúdo mudou de versão.
    const onChanged = () => void load();
    window.addEventListener('naruto-ccg:content-changed', onChanged);
    return () => window.removeEventListener('naruto-ccg:content-changed', onChanged);
  }, [load]);

  const value = useMemo<ContentState | null>(() => {
    if (!state || typeof state !== 'object' || !('version' in state)) return null;
    return {
      version: state.version,
      saved: (version) => {
        markContentVersion(version);
        setState((s) => (s && typeof s === 'object' && 'tick' in s ? { version, tick: s.tick + 1 } : s));
      },
      assetChanged: (path, url, version) => {
        installAsset(path, url);
        markContentVersion(version);
        setState((s) => (s && typeof s === 'object' && 'tick' in s ? { version, tick: s.tick + 1 } : s));
      },
      reload: load,
    };
    // `tick` muda a cada atualização: quem usa o contexto redesenha.
  }, [state, load]);

  if (state === 'locked') return <>{children}</>;
  if (state && typeof state === 'object' && 'error' in state) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-lg font-semibold">Não foi possível carregar as cartas.</p>
        <p className="mt-2 text-sm text-muted">{state.error}</p>
        <button type="button" className="mt-4 rounded-md bg-accent px-4 py-2 font-semibold text-bg" onClick={() => void load()}>
          Tentar de novo
        </button>
      </div>
    );
  }
  if (!value) return <p className="py-16 text-center text-muted">Carregando cartas…</p>;
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** Estado do conteúdo (versão e avisos de gravação). Só dentro do `ContentProvider`. */
export function useContent(): ContentState {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent fora do ContentProvider');
  return ctx;
}

/** Igual a `useContent`, mas sem erro fora do provedor (componentes usados também em testes/prévias). */
export function useOptionalContent(): ContentState | null {
  return useContext(ContentContext);
}
