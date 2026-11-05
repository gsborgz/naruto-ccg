'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Impede sair da tela com alterações não salvas.
 *
 * - Links internos (cabeçalho, "Voltar"…): a navegação fica pendente até o usuário escolher no diálogo.
 * - Botão "voltar" do navegador: um registro extra no histórico absorve o primeiro "voltar" e abre o diálogo.
 * - Fechar/recarregar a aba: o navegador mostra o aviso padrão dele (não dá para personalizar os botões).
 *
 * Retorna `pending` (há uma saída aguardando decisão), `proceed()` para seguir com ela e `cancel()` para ficar.
 */
export function useLeaveGuard(dirty: boolean) {
  const router = useRouter();
  const [pending, setPending] = useState<(() => void) | null>(null);
  const dirtyRef = useRef(dirty);
  const bypass = useRef(false);
  const hasSentinel = useRef(false);

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  const pushSentinel = useCallback(() => {
    if (hasSentinel.current) return;
    window.history.pushState(null, '', window.location.href);
    hasSentinel.current = true;
  }, []);

  // Fechar/recarregar a aba ou ir para outro site.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (bypass.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  // Cliques em links internos. Na fase de captura do `window`, antes do <Link> do Next tratar o clique.
  useEffect(() => {
    if (!dirty) return;
    const onClick = (e: MouseEvent) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // abrir em nova aba/janela
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return; // site externo: cai no beforeunload
      if (url.pathname === window.location.pathname && url.search === window.location.search) return; // âncora (#deck)
      e.preventDefault();
      e.stopPropagation();
      setPending(() => () => router.push(url.pathname + url.search + url.hash));
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [dirty, router]);

  // Botão "voltar": mantém um registro extra no histórico enquanto houver alterações.
  useEffect(() => {
    if (dirty) pushSentinel();
  }, [dirty, pushSentinel]);

  useEffect(() => {
    const onPopState = () => {
      if (!hasSentinel.current) return;
      hasSentinel.current = false;
      if (bypass.current) return;
      if (dirtyRef.current) setPending(() => () => window.history.back());
      else window.history.back(); // já salvou: completa o "voltar" que o registro extra absorveu
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const proceed = useCallback(() => {
    const action = pending;
    bypass.current = true;
    setPending(null);
    action?.();
  }, [pending]);

  const cancel = useCallback(() => {
    setPending(null);
    if (dirtyRef.current) pushSentinel(); // repõe o registro consumido pelo "voltar"
  }, [pushSentinel]);

  return { pending: pending !== null, proceed, cancel };
}
