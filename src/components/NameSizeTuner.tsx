'use client';

import { useState } from 'react';
import { NAME_SIZE_RANGE } from '@/lib/content/changes';
import { saveCardLayout } from '@/lib/content/client';
import { useContent } from '@/lib/content/ContentProvider';

interface Props {
  cardId: string;
  /** Valor gravado no conteúdo do jogo. */
  saved: number;
  /** Valor em edição (mostrado na carta montada). */
  value: number;
  onChange: (value: number) => void;
}

const LABEL = 'Tamanho do nome';

/**
 * Atalho na carta montada do detalhe (a aba Editar tem o mesmo ajuste): ajusta o tamanho do nome e grava no conteúdo
 * do jogo (`/api/content/cards/<id>/layout`), para todo mundo.
 */
export function NameSizeTuner({ cardId, saved, value, onChange }: Props) {
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const content = useContent();
  // Gravado nesta sessão (a carta aberta pode ser uma cópia feita antes de gravar).
  const [justSaved, setJustSaved] = useState<number | null>(null);
  const current = justSaved ?? saved;
  const dirty = value !== current;

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      content.saved(await saveCardLayout(cardId, [{ path: ['nameSize'], value }]));
      setJustSaved(value);
      setStatus({ kind: 'ok', text: 'Salvo.' });
    } catch (e) {
      setStatus({ kind: 'error', text: e instanceof Error ? e.message : 'Falha ao gravar' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-accent/50 p-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-accent">
          {LABEL}: {value > 0 ? `+${value}` : value} px
        </span>
        {dirty && (
          <button type="button" onClick={() => onChange(current)} className="text-muted hover:text-text">
            desfazer
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={-NAME_SIZE_RANGE}
          max={NAME_SIZE_RANGE}
          step={0.5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-w-0 flex-1 accent-[var(--color-accent)]"
          aria-label={LABEL}
        />
        <input
          type="number"
          min={-NAME_SIZE_RANGE}
          max={NAME_SIZE_RANGE}
          step={0.5}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) onChange(Math.max(-NAME_SIZE_RANGE, Math.min(NAME_SIZE_RANGE, v)));
          }}
          className="w-16 rounded border border-border bg-surface-2 px-1 py-0.5 text-right"
        />
        <button
          type="button"
          disabled={!dirty || saving}
          onClick={save}
          className="rounded-md bg-accent px-2 py-1 font-semibold text-bg disabled:opacity-40"
        >
          {saving ? 'Gravando…' : 'Salvar'}
        </button>
      </div>
      {status && <p className={status.kind === 'ok' ? 'text-muted' : 'text-red-400'}>{status.text}</p>}
    </div>
  );
}
