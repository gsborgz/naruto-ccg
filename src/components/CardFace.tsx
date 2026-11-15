'use client';

import dynamic from 'next/dynamic';
import { cardImageUrl, type Card } from '@/models/card';

// Carregada sob demanda: traz as fontes e a configuração dos layouts do criador de cartas.
const CatalogCardRender = dynamic(() => import('./cardMaker/CatalogCardRender').then((m) => m.CatalogCardRender), {
  ssr: false,
});

interface Props {
  card: Card;
  /** `thumb`: miniatura (grades); `full`: imagem em tamanho cheio (detalhe). */
  size: 'thumb' | 'full';
  /** Mostra a carta montada quando ela tem `layout` (cartas escaneadas). Padrão: sim. */
  rendered?: boolean;
  /** Imagem original: prioridade de carregamento (primeiras linhas da grade). */
  eager?: boolean;
  className?: string;
}

/**
 * Face da carta em proporção 5:7: a carta montada (layout + artes extraídas) quando ela foi escaneada, senão
 * a imagem impressa. A miniatura fica por baixo enquanto a montada ou a imagem grande carregam.
 */
export function CardFace({ card, size, rendered = true, eager = false, className = '' }: Props) {
  const showRendered = rendered && card.layout !== undefined;
  return (
    <div
      className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 bg-cover ${className}`}
      style={{ backgroundImage: `url(${cardImageUrl(card, 'thumb')})` }}
    >
      {showRendered ? (
        <CatalogCardRender card={card} />
      ) : (
        <img
          key={card.id}
          src={cardImageUrl(card, size)}
          alt={card.name}
          width={size === 'thumb' ? 300 : 429}
          height={size === 'thumb' ? 420 : 600}
          loading={eager || size === 'full' ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          className="size-full object-cover"
        />
      )}
    </div>
  );
}
