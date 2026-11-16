'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocalizedCard } from '@/lib/cardLanguage';
import type { AltArtFrame, AltArtPlacement } from '@/lib/altArts';
import { fromCatalogCard, withLocalizedText, type CustomCard, type CustomCardArt } from '@/lib/cardMaker/model';
import type { Card } from '@/models/card';
import { CardRender } from './CardRender';

/** Data fixa: a carta montada não é salva, só exibida. */
const NOW = '2026-01-01T00:00:00.000Z';

const frame = (a: AltArtFrame): CustomCardArt => ({ src: a.src, x: a.x, y: a.y, zoom: a.zoom });

/**
 * Troca a arte da carta montada por uma arte alternativa: o fundo dela vira a camada de trás e a frente dela (se
 * houver) a da frente. Somem a camada da frente e a frase impressa da carta (que eram da arte original).
 */
export function withAltArt(card: CustomCard, art: AltArtPlacement): CustomCard {
  const { artFront: _front, printedFlavor: _printed, ...rest } = card;
  return { ...rest, art: frame(art), ...(art.front && { artFront: frame(art.front) }) };
}

/** Arte nova sendo enquadrada no detalhe da carta: cada camada pode faltar (ainda não escolhida). */
export interface ArtPreview {
  back: AltArtFrame | null;
  front: AltArtFrame | null;
}

/**
 * A carta com a arte em edição: sem fundo novo, fica o fundo da carta (a impressa ou a arte extraída); a frente é
 * sempre a do rascunho (a da carta é da arte original e não combina com outra).
 */
function withPreview(card: CustomCard, preview: ArtPreview): CustomCard {
  const { artFront: _front, ...rest } = card;
  const next: CustomCard = { ...rest, ...(preview.front && { artFront: frame(preview.front) }) };
  if (!preview.back) return next;
  const { printedFlavor: _printed, ...withoutPrint } = next;
  return { ...withoutPrint, art: frame(preview.back) };
}

/**
 * Carta do catálogo montada virtualmente (layout + ícones + textos + artes extraídas), ocupando a largura do
 * contêiner. Usa o layout e as artes de `card.layout` (cartas escaneadas). Nome, textos, frase e características
 * seguem o idioma escolhido (EN | PT); o Atributo de Combate fica em inglês, pois escolhe o kanji impresso.
 * Com `art` (arte alternativa), ela entra no lugar da arte da carta; vale também para as cartas ainda não
 * escaneadas, montadas no layout padrão. `preview`: a arte nova em edição; `onArtMove`: arrastar a arte
 * (enquadramento de uma arte nova).
 */
export function CatalogCardRender({
  card,
  art,
  preview,
  onArtMove,
}: {
  card: Card;
  art?: AltArtPlacement | null;
  /** Arte nova em edição (no lugar de `art`). */
  preview?: ArtPreview;
  onArtMove?: (dx: number, dy: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const localized = useLocalizedCard(card);
  // Com a impressa de fundo, a frase montada ganha um sombreado que apaga de leve a impressa (`printedFlavor`).
  const custom = useMemo(() => {
    const montada = withLocalizedText(fromCatalogCard(card, NOW), localized, card);
    if (preview) return withPreview(montada, preview);
    return art ? withAltArt(montada, art) : montada;
  }, [card, localized, art, preview]);

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
