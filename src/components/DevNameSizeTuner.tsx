'use client';

import { useState } from 'react';
import { NAME_SIZE_RANGE, type LayoutSizeField } from '@/lib/devCardLayoutEdit';

interface Props {
  cardId: string;
  field: LayoutSizeField;
  /** Valor gravado no arquivo da coleção. */
  saved: number;
  /** Valor em edição (mostrado na carta montada). */
  value: number;
  onChange: (value: number) => void;
}

const FIELD_LABEL: Record<LayoutSizeField, string> = {
  nameSize: 'Tamanho do nome',
  nameSizePtBr: 'Tamanho do nome (PT-BR)',
};

/**
 * Só em desenvolvimento: ajusta o tamanho do nome da carta montada e grava no arquivo da coleção
 * (`/api/dev/card-layout`). Com o nome traduzido na tela, ajusta `nameSizePtBr`; senão, `nameSize`.
 */
export function DevNameSizeTuner({ cardId, field, saved, value, onChange }: Props) {
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  // Gravado nesta sessão: o arquivo muda, mas a carta aberta pode continuar sendo o objeto antigo até reabrir.
  const [justSaved, setJustSaved] = useState<number | null>(null);
  const current = justSaved ?? saved;
  const dirty = value !== current;

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch('/api/dev/card-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cardId, field, value }),
      });
      const data = (await response.json().catch(() => ({}))) as { file?: string; message?: string };
      if (response.ok) setJustSaved(value);
      setStatus(response.ok ? { kind: 'ok', text: `Gravado em ${data.file}` } : { kind: 'error', text: data.message ?? `Erro ${response.status}` });
    } catch {
      setStatus({ kind: 'error', text: 'Falha ao gravar' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-accent/50 p-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-accent">
          {FIELD_LABEL[field]}: {value > 0 ? `+${value}` : value} px <span className="font-normal text-muted">(dev)</span>
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
          aria-label={FIELD_LABEL[field]}
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
