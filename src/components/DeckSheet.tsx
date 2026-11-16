'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Celular: o deck num painel que sobe de baixo, por cima da lista de cartas (<dialog> nativo: Esc ou toque fora
 * fecham). A lista fica onde estava, então dá para conferir o deck e voltar a adicionar cartas do mesmo ponto.
 */
export function DeckSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Se a janela crescer até o layout de duas colunas, o deck já aparece ao lado: fecha o painel.
  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia('(min-width: 64rem)');
    const onChange = () => wide.matches && onClose();
    onChange();
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, [open, onClose]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label="Deck"
      className="mx-0 mt-auto mb-0 h-[88dvh] max-h-[88dvh] w-full max-w-none overflow-hidden rounded-t-2xl bg-transparent p-0 text-text backdrop:bg-black/70 lg:hidden"
    >
      {open && (
        <div className="flex h-full flex-col pb-[env(safe-area-inset-bottom)] [&>*]:rounded-b-none [&>*]:border-b-0">
          {children}
        </div>
      )}
    </dialog>
  );
}
