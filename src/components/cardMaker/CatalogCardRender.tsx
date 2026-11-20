'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { fromCatalogCard } from '@/lib/cardMaker/model';
import type { Card } from '@/models/card';
import { CardRender } from './CardRender';

/** Data fixa: a carta montada não é salva, só exibida. */
const NOW = '2026-01-01T00:00:00.000Z';

/**
 * Carta do catálogo montada virtualmente (layout + ícones + textos + artes), ocupando a largura do contêiner. Usa o
 * layout e as artes de `card.layout` (cartas escaneadas ou editadas pela aba Editar), com os textos do conteúdo do
 * jogo.
 */
export function CatalogCardRender({ card }: { card: Card }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const custom = useMemo(() => fromCatalogCard(card, NOW), [card]);

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
