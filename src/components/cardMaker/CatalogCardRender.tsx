'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocalizedCard } from '@/lib/cardLanguage';
import type { AltArtPlacement } from '@/lib/altArts';
import { fromCatalogCard, withLocalizedText, type CustomCard } from '@/lib/cardMaker/model';
import type { Card } from '@/models/card';
import { CardRender } from './CardRender';

/** Data fixa: a carta montada não é salva, só exibida. */
const NOW = '2026-01-01T00:00:00.000Z';

/**
 * Troca a arte da carta montada por uma arte alternativa: ela vira a camada de trás, e somem a camada da frente e
 * a frase impressa (que só existiam por causa da impressa ao fundo).
 */
export function withAltArt(card: CustomCard, art: AltArtPlacement): CustomCard {
  const { artFront: _front, printedFlavor: _printed, ...rest } = card;
  return { ...rest, art: { src: art.src, x: art.x, y: art.y, zoom: art.zoom } };
}

/**
 * Carta do catálogo montada virtualmente (layout + ícones + textos + artes extraídas), ocupando a largura do
 * contêiner. Usa o layout e as artes de `card.layout` (cartas escaneadas). Nome, textos, frase e características
 * seguem o idioma escolhido (EN | PT); o Atributo de Combate fica em inglês, pois escolhe o kanji impresso.
 * Com `art` (arte alternativa), ela entra no lugar da arte da carta; vale também para as cartas ainda não
 * escaneadas, montadas no layout padrão. `onArtMove`: arrastar a arte (enquadramento de uma arte nova).
 */
export function CatalogCardRender({
  card,
  art,
  onArtMove,
}: {
  card: Card;
  art?: AltArtPlacement | null;
  onArtMove?: (dx: number, dy: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const localized = useLocalizedCard(card);
  // Com a impressa de fundo, a frase montada ganha um sombreado que apaga de leve a impressa (`printedFlavor`).
  const custom = useMemo(() => {
    const montada = withLocalizedText(fromCatalogCard(card, NOW), localized, card);
    return art ? withAltArt(montada, art) : montada;
  }, [card, localized, art]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="size-full">
      {width > 0 && <CardRender card={custom} width={width} onArtMove={onArtMove} />}
    </div>
  );
}
