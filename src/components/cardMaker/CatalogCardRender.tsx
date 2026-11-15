'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocalizedCard } from '@/lib/cardLanguage';
import { fromCatalogCard, withLocalizedText } from '@/lib/cardMaker/model';
import type { Card } from '@/models/card';
import { CardRender } from './CardRender';

/** Data fixa: a carta montada não é salva, só exibida. */
const NOW = '2026-01-01T00:00:00.000Z';

/**
 * Carta do catálogo montada virtualmente (layout + ícones + textos + artes extraídas), ocupando a largura do
 * contêiner. Usa o layout e as artes de `card.layout` (cartas escaneadas). Nome, textos, frase e características
 * seguem o idioma escolhido (EN | PT); o Atributo de Combate fica em inglês, pois escolhe o kanji impresso.
 */
export function CatalogCardRender({ card }: { card: Card }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const localized = useLocalizedCard(card);
  // Com a impressa de fundo, a frase montada ganha um sombreado que apaga de leve a impressa (`printedFlavor`).
  const custom = useMemo(() => withLocalizedText(fromCatalogCard(card, NOW), localized, card), [card, localized]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="size-full">
      {width > 0 && <CardRender card={custom} width={width} />}
    </div>
  );
}
