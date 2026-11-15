'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useCustomSource } from '@/lib/useCardCatalog';
import { CardRender } from './CardRender';

/**
 * Carta do criador usada no montador (`custom-<uuid>`), montada como no `/criar`, ocupando a largura do contêiner.
 * Os textos são os digitados no criador (não passam pela tradução EN | PT).
 */
export function CustomCardFaceRender({ cardId }: { cardId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const source = useCustomSource(cardId);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="size-full">
      {width > 0 && source && <CardRender card={source} width={width} />}
    </div>
  );
}
