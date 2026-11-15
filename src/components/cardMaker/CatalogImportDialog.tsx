'use client';

import { useMemo, useState } from 'react';
import { Dialog } from '@/components/Dialog';
import { CARDS } from '@/data/cards';
import { useCardLanguage, useCardName } from '@/lib/cardLanguage';
import { localizeCard } from '@/lib/cardLocale';
import { fromCatalogCard, withLocalizedText, type CustomCard, type LayoutId } from '@/lib/cardMaker/model';
import { CARD_TYPE_LABEL, cardImageUrl, type Card } from '@/models/card';
import type { CardLanguage, CardTranslations } from '@/models/cardTranslation';

/**
 * Carta do criador a partir de uma carta do catálogo, com nome, textos, frase e características no idioma
 * escolhido (PT-BR: as traduções precisam já ter carregado; o que não tiver tradução fica em inglês).
 */
export function importCatalogCard(
  card: Card,
  language: CardLanguage,
  translations: CardTranslations | null,
  layout?: LayoutId,
): CustomCard {
  const custom = fromCatalogCard(card, undefined, layout);
  return language === 'en' ? custom : withLocalizedText(custom, localizeCard(card, language, translations), card);
}

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (card: CustomCard) => void;
  /** Layout da carta criada (o da carta aberta no criador). */
  layout: LayoutId;
}

const MAX_RESULTS = 40;

/** Busca uma carta do catálogo para servir de ponto de partida (textos no idioma escolhido: EN | PT). */
export function CatalogImportDialog({ open, onClose, onPick, layout }: Props) {
  const [query, setQuery] = useState('');
  const { language, translations } = useCardLanguage();
  const cardName = useCardName();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CARDS
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          cardName(c).toLowerCase().includes(q) ||
          c.id.includes(q) ||
          c.number.toLowerCase() === q,
      )
      .slice(0, MAX_RESULTS);
  }, [query, cardName]);

  return (
    <Dialog open={open} onClose={onClose} title="Importar do catálogo">
      <input
        autoFocus
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
        placeholder="Nome ou número da carta (ex.: Fugai, us098)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto">
        {query.trim() && !results.length && <li className="text-sm text-muted">Nenhuma carta encontrada.</li>}
        {results.map((card) => (
          <li key={card.id}>
            <button
              type="button"
              // Em PT-BR, espera as traduções para não importar em inglês.
              disabled={language === 'pt-BR' && !translations}
              onClick={() => {
                onPick(importCatalogCard(card, language, translations, layout));
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-lg p-1.5 text-left hover:bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cardImageUrl(card, 'thumb')} alt="" className="h-14 w-10 rounded object-cover" loading="lazy" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">{cardName(card)}</span>
                <span className="text-xs text-muted">
                  {card.set} {card.number} · {CARD_TYPE_LABEL[card.type]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">
        Os dados vêm da carta escolhida; a arte você envia. A imagem original fica disponível para comparação.
      </p>
    </Dialog>
  );
}
