'use client';

import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { localizeCard } from '@/lib/cardLocale';
import { customDeckCardId, isCustomCardId } from '@/lib/cardMaker/customIds';
import { elementToPng } from '@/lib/cardMaker/exportPng';
import { CARD_W } from '@/lib/cardMaker/layouts/shared';
import { fromCatalogCard, withLocalizedText, type CustomCard } from '@/lib/cardMaker/model';
import type { Card } from '@/models/card';
import type { CardLanguage, CardTranslations } from '@/models/cardTranslation';
import { CardRender } from './CardRender';

/** Data fixa: a carta montada não é salva, só desenhada. */
const NOW = '2026-01-01T00:00:00.000Z';

export interface CardImageRenderer {
  /** A carta montada como PNG (750×1050), ou null se ela não tem como ser montada. */
  render(card: Card): Promise<Blob | null>;
  dispose(): void;
}

/**
 * Desenha cartas montadas (as escaneadas, com `layout`, e as do criador) fora da tela, uma de cada vez, e as
 * converte em PNG. Os textos das cartas do catálogo seguem o idioma escolhido (como a carta montada na tela).
 */
export function createCardImageRenderer(options: {
  language: CardLanguage;
  translations: CardTranslations | null;
  /** Cartas do criador deste navegador. */
  customCards: CustomCard[];
}): CardImageRenderer {
  const custom = new Map(options.customCards.map((c) => [customDeckCardId(c.id), c]));
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  Object.assign(host.style, { position: 'fixed', left: '-10000px', top: '0', pointerEvents: 'none' });
  document.body.appendChild(host);
  const root = createRoot(host);

  const source = (card: Card): CustomCard | undefined => {
    if (isCustomCardId(card.id)) return custom.get(card.id);
    if (!card.layout) return undefined;
    const localized = localizeCard(card, options.language, options.translations);
    return withLocalizedText(fromCatalogCard(card, NOW), localized, card);
  };

  return {
    async render(card) {
      const shown = source(card);
      if (!shown) return null;
      flushSync(() => root.render(<CardRender key={card.id} card={shown} width={CARD_W} />));
      const node = host.firstElementChild;
      if (!(node instanceof HTMLElement)) return null;
      return elementToPng(node, 1);
    },
    dispose() {
      root.unmount();
      host.remove();
    },
  };
}
