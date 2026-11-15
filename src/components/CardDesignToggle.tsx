'use client';

import { setCardDesign, useCardDesign, type CardDesign } from '@/lib/cardDesign';

const OPTIONS: { value: CardDesign; label: string; title: string }[] = [
  { value: 'original', label: 'Originais', title: 'Imagens impressas das cartas' },
  {
    value: 'rendered',
    label: 'Montadas',
    title: 'Cartas montadas em tempo real (layout, ícones e textos), nas coleções já escaneadas; as outras continuam originais',
  },
];

/** Mostra as cartas da listagem (e o detalhe, ao abrir) com a imagem impressa ou montadas. */
export function CardDesignToggle() {
  const design = useCardDesign();
  return (
    <div role="group" aria-label="Design das cartas" className="flex rounded-md border border-border p-0.5 text-xs">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          aria-pressed={design === o.value}
          onClick={() => setCardDesign(o.value)}
          className={`rounded px-2 py-1 font-semibold ${
            design === o.value ? 'bg-accent text-bg' : 'text-muted hover:text-text'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
