'use client';

import { useRef, useState } from 'react';
import { prepareWallpaper } from '@/lib/themes/client';
import { PALETTE_IDS, PALETTES, THEME_LIMITS, THEME_RANGES, type BoardTheme } from '@/lib/themes/types';
import { ThemePreview } from './ThemePreview';

/**
 * Formulário de um tema (rascunho): nome, padrão de cores, imagem de fundo e os ajustes de contraste, com a prévia ao
 * lado. A imagem escolhida é tratada aqui (até Full HD, WebP) e fica como data URL até o **Salvar** da página enviá-la.
 */
export function ThemeEditor({
  draft,
  onChange,
  onSave,
  onCancel,
  saving,
  error,
  isNew,
}: {
  draft: BoardTheme;
  onChange: (next: BoardTheme) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
  isNew: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const set = <K extends keyof BoardTheme>(key: K, value: BoardTheme[K]) => onChange({ ...draft, [key]: value });

  async function pick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Escolha uma imagem (JPEG, PNG ou WebP).');
      return;
    }
    setImageError(null);
    setProcessing(true);
    try {
      set('wallpaper', await prepareWallpaper(file));
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'Não foi possível ler a imagem.');
    } finally {
      setProcessing(false);
    }
  }

  const slider = (key: 'dim' | 'arenaDim' | 'blur', label: string, format: (v: number) => string) => {
    const r = THEME_RANGES[key];
    return (
      <label className="flex flex-col gap-1 text-sm">
        <span className="flex justify-between text-muted">
          {label}
          <span className="tabular-nums text-text">{format(draft[key])}</span>
        </span>
        <input
          type="range"
          min={r.min}
          max={r.max}
          step={r.step}
          value={draft[key]}
          onChange={(e) => set(key, Number(e.target.value))}
          className="accent-[var(--color-accent)]"
        />
      </label>
    );
  };
  const percent = (v: number) => `${Math.round(v * 100)}%`;

  return (
    <section className="grid gap-6 rounded-xl border border-border bg-surface p-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <h2 className="text-lg font-bold">{isNew ? 'Novo tema' : 'Editar tema'}</h2>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Nome</span>
          <input
            value={draft.name}
            maxLength={THEME_LIMITS.nameLength}
            onChange={(e) => set('name', e.target.value)}
            required
            className="rounded-lg bg-bg px-3 py-2 text-text ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm text-muted">Padrão de cores</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {PALETTE_IDS.map((id) => {
              const p = PALETTES[id];
              const checked = draft.palette === id;
              return (
                <label
                  key={id}
                  className={`flex cursor-pointer flex-col gap-1.5 rounded-lg p-2 ring-1 transition-colors ${
                    checked ? 'bg-surface-2 ring-2 ring-accent' : 'ring-border hover:bg-surface-2'
                  }`}
                  title={`Combina com ${p.hint}`}
                >
                  <input type="radio" name="palette" value={id} checked={checked} onChange={() => set('palette', id)} className="sr-only" />
                  <span className="flex h-4 overflow-hidden rounded" aria-hidden>
                    {p.ramp.map((c) => (
                      <span key={c} className="flex-1" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="text-xs text-muted">{p.hint}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-muted">Imagem de fundo</span>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void pick(e.dataTransfer.files[0]);
            }}
            className={`flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 text-center ${
              dragOver ? 'border-accent bg-surface-2' : 'border-border'
            }`}
          >
            {draft.wallpaper ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL ou Blob, já tratada
              <img src={draft.wallpaper} alt="" className="max-h-28 rounded object-contain" />
            ) : (
              <span className="text-muted">Sem imagem: a arena usa o fundo padrão.</span>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={processing}
                className="rounded-lg px-3 py-1.5 ring-1 ring-border hover:bg-surface-2 disabled:opacity-50"
              >
                {processing ? 'Tratando…' : draft.wallpaper ? 'Trocar imagem' : 'Escolher imagem'}
              </button>
              {draft.wallpaper && (
                <button
                  type="button"
                  onClick={() => set('wallpaper', null)}
                  className="rounded-lg px-3 py-1.5 text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
                >
                  Remover
                </button>
              )}
            </div>
            <span className="text-xs text-muted">ou arraste uma imagem para cá (reduzida para até 1920 px, WebP)</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                void pick(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>
          {imageError && <p className="text-danger">{imageError}</p>}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={draft.tile} onChange={(e) => set('tile', e.target.checked)} />
            Repetir a imagem (textura) em vez de cobrir a tela
          </label>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm text-muted">Contraste</legend>
          {slider('dim', 'Escurecer o fundo', percent)}
          {slider('arenaDim', 'Véu do Campo de Batalha', percent)}
          {slider('blur', 'Desfoque atrás do Campo de Batalha', (v) => `${v} px`)}
        </fieldset>

        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-muted hover:bg-surface-2 hover:text-text"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || processing}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-2 lg:sticky lg:top-4 lg:self-start">
        <span className="text-sm text-muted">Prévia</span>
        <ThemePreview theme={draft} />
        <p className="text-xs text-muted">
          A paleta muda as costas das cartas, os botões, os brilhos e as suas zonas; as cores neutras e o vidro escuro das
          zonas ficam iguais, para tudo continuar legível sobre qualquer imagem.
        </p>
      </div>
    </section>
  );
}
