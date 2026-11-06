'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { forgetRoom, rememberRoom, RoomRequestError, roomApi } from './client';
import type { RoomAction, RoomView } from './model';

/** Intervalo de consulta com a aba visível / em segundo plano, e de aviso de "online". */
const POLL_VISIBLE_MS = 1000;
const POLL_HIDDEN_MS = 5000;
const PING_EVERY_MS = 5000;

export interface UseRoom {
  view: RoomView | null;
  /** Erro ao carregar a sala (ex.: 404); a tela mostra no lugar da sala. */
  loadError: RoomRequestError | null;
  /** Erro da última ação (entrar, pronto…); a tela mostra junto aos botões. */
  actionError: string | null;
  busy: boolean;
  join: (nickname: string) => Promise<boolean>;
  act: (action: RoomAction) => Promise<boolean>;
}

/**
 * Toda a comunicação de uma sala passa por aqui (docs/SALAS.md, "Sincronização"):
 * consulta periódica + ações. Para trocar o transporte (ex.: WebSocket), só este hook muda.
 */
export function useRoom(id: string): UseRoom {
  const [view, setView] = useState<RoomView | null>(null);
  const [loadError, setLoadError] = useState<RoomRequestError | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const lastJson = useRef('');
  const stopped = useRef(false);

  /** Só re-renderiza se algo mudou de verdade. Lembra a sala enquanto o jogador está nela. */
  const apply = useCallback(
    (next: RoomView | null) => {
      if (!next) return;
      if (next.you) rememberRoom(id);
      const json = JSON.stringify(next);
      if (json === lastJson.current) return;
      lastJson.current = json;
      setView(next);
    },
    [id],
  );

  useEffect(() => {
    stopped.current = false;
    lastJson.current = '';
    setView(null);
    setLoadError(null);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastPing = 0;

    const tick = async () => {
      if (stopped.current) return;
      const now = Date.now();
      const ping = now - lastPing >= PING_EVERY_MS;
      try {
        const next = await roomApi.get(id, ping);
        if (ping) lastPing = now;
        if (stopped.current) return;
        apply(next);
        setLoadError(null);
      } catch (e) {
        if (stopped.current) return;
        const err = e as RoomRequestError;
        setLoadError(err);
        if (err.status === 404 || err.status === 400) {
          forgetRoom(id); // a sala não existe mais
          return; // não adianta insistir
        }
      }
      timer = setTimeout(tick, document.visibilityState === 'visible' ? POLL_VISIBLE_MS : POLL_HIDDEN_MS);
    };

    // Ao voltar para a aba, atualiza na hora em vez de esperar o intervalo longo.
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || stopped.current) return;
      clearTimeout(timer);
      tick();
    };

    tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped.current = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [id, apply]);

  const run = useCallback(
    async (call: () => Promise<RoomView | null>) => {
      setBusy(true);
      setActionError(null);
      try {
        apply(await call());
        return true;
      } catch (e) {
        setActionError((e as Error).message);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [apply],
  );

  const join = useCallback((nickname: string) => run(() => roomApi.join(id, nickname)), [id, run]);
  const act = useCallback(
    async (action: RoomAction) => {
      const ok = await run(() => roomApi.act(id, action));
      if (ok && action.type === 'leave') {
        stopped.current = true; // saiu de propósito: para de consultar e esquece a sala
        forgetRoom(id);
      }
      return ok;
    },
    [id, run],
  );

  return { view, loadError, actionError, busy, join, act };
}
