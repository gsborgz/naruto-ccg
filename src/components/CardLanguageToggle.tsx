'use client';

import { useCardLanguage } from '@/lib/cardLanguage';
import type { CardLanguage } from '@/models/cardTranslation';

const OPTIONS: { value: CardLanguage; label: string; title: string }[] = [
  { value: 'en', label: 'EN', title: 'Textos das cartas em inglês, como impressos' },
  { value: 'pt-BR', label: 'PT', title: 'Textos das cartas traduzidos para português' },
];

/** Idioma dos textos das cartas (efeitos, frases e características). */
export function CardLanguageToggle() {
  const { language, setLanguage } = useCardLanguage();
  return (
    <div role="group" aria-label="Idioma das cartas" className="flex rounded-md border border-border p-0.5 text-xs">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          aria-pressed={language === o.value}
          onClick={() => setLanguage(o.value)}
          className={`rounded px-2 py-1 font-semibold ${
            language === o.value ? 'bg-accent text-bg' : 'text-muted hover:text-text'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
