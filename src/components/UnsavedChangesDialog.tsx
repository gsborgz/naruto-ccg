'use client';

import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

/** Pergunta o que fazer com as alterações não salvas ao sair do montador. */
export function UnsavedChangesDialog({ open, onSave, onDiscard, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault(); // Esc: continua editando
        onCancel();
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      aria-labelledby="unsaved-title"
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-border bg-surface p-0 text-text backdrop:bg-black/70"
    >
      <div className="flex flex-col gap-4 p-5">
        <div>
          <h2 id="unsaved-title" className="text-lg font-bold">
            Alterações não salvas
          </h2>
          <p className="mt-1 text-sm text-muted">Você alterou este deck. Quer salvar antes de sair?</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            Continuar editando
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-danger ring-1 ring-danger/40 transition-colors hover:bg-danger/10"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={onSave}
            autoFocus
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong"
          >
            Salvar
          </button>
        </div>
      </div>
    </dialog>
  );
}
