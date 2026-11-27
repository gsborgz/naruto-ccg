'use client';

import { useEffect, useRef, useState } from 'react';
import { NICKNAME_MAX, parseNickname } from '@/lib/rooms/model';
import { saveNickname, syncNickname, useNickname } from '@/lib/rooms/client';

/** Espera depois da última tecla antes de gravar. */
const SAVE_DELAY_MS = 1000;

type Status = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Apelido no cabeçalho, sem botão: grava sozinho 1 s depois que o jogador para de digitar (`saveNickname`: na conta e
 * na sala em que ele está, para a arena mostrar o novo na hora). Vazio ou inválido não grava (fica o anterior).
 */
export function NicknameField() {
  const saved = useNickname();
  const [value, setValue] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editing = value !== null;
  const shown = editing ? value : saved;

  // Ao abrir o site: acerta com o apelido da conta (outro navegador com o mesmo código pode ter trocado).
  useEffect(() => {
    void syncNickname().catch(() => undefined);
  }, []);
  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);
  // O "✓" de salvo some depois de um tempo.
  useEffect(() => {
    if (status !== 'saved') return;
    const t = setTimeout(() => setStatus('idle'), 2000);
    return () => clearTimeout(t);
  }, [status]);

  const change = (next: string) => {
    setValue(next);
    setStatus('idle');
    clearTimeout(timer.current ?? undefined);
    timer.current = setTimeout(async () => {
      const name = parseNickname(next);
      if (!name) return; // vazio: fica o anterior (o campo volta para ele ao sair)
      if (name === saved) {
        setValue(null);
        return;
      }
      setStatus('saving');
      try {
        await saveNickname(name);
        setStatus('saved');
      } catch {
        setStatus('error');
        return;
      }
      setValue((v) => (v === next ? null : v));
    }, SAVE_DELAY_MS);
  };

  const hint =
    status === 'saving'
      ? 'Salvando…'
      : status === 'error'
        ? 'Não foi possível salvar o apelido. Tente de novo.'
        : status === 'saved'
          ? 'Apelido salvo'
          : 'Seu apelido nas salas e como criador dos temas, sleeves e cartas. Salva sozinho ao parar de digitar.';

  return (
    <label className="relative flex items-center" title={hint}>
      <span className="sr-only">Apelido</span>
      <input
        value={shown}
        onChange={(e) => change(e.target.value)}
        onBlur={() => {
          // Saiu com o campo vazio: volta para o apelido salvo.
          if (editing && !parseNickname(value)) {
            clearTimeout(timer.current ?? undefined);
            setValue(null);
          }
        }}
        maxLength={NICKNAME_MAX}
        placeholder="Apelido"
        autoComplete="nickname"
        spellCheck={false}
        aria-describedby="nickname-status"
        className={`w-28 rounded-lg border bg-surface-2 px-2.5 py-1 text-sm text-text outline-none placeholder:text-muted focus:border-accent sm:w-36 ${
          status === 'error' || (!saved && !editing) ? 'border-danger/60' : 'border-border'
        }`}
      />
      <span
        id="nickname-status"
        aria-live="polite"
        className={`pointer-events-none absolute right-2 text-xs ${status === 'error' ? 'text-danger' : 'text-muted'}`}
      >
        {status === 'saving' ? '…' : status === 'saved' ? '✓' : status === 'error' ? '!' : ''}
        <span className="sr-only">{status === 'idle' ? '' : hint}</span>
      </span>
    </label>
  );
}
