'use client';

import dynamic from 'next/dynamic';
import { isCustomCardId } from '@/lib/cardMaker/customIds';
import { cardCornerCss } from '@/lib/cardMaker/layouts/corners';
import { cardImageUrl, type Card } from '@/models/card';

// Carregadas sob demanda: trazem as fontes e a configuração dos layouts do criador de cartas.
const CatalogCardRender = dynamic(() => import('./cardMaker/CatalogCardRender').then((m) => m.CatalogCardRender), {
  ssr: false,
});
const CustomCardFaceRender = dynamic(
  () => import('./cardMaker/CustomCardFaceRender').then((m) => m.CustomCardFaceRender),
  { ssr: false },
);

interface Props {
  card: Card;
  /** `thumb`: miniatura (grades); `full`: imagem em tamanho cheio (detalhe). */
  size: 'thumb' | 'full';
  /** Imagem original: prioridade de carregamento (primeiras linhas da grade). */
  eager?: boolean;
  className?: string;
}

/**
 * Face da carta em proporção 5:7: a imagem impressa ou, se a carta tem `layout` (a alter escolhida no deck,
 * `src/lib/deckDesigns.ts`), a carta montada. As cartas do catálogo não têm `layout`: saem sempre impressas. As cartas
 * do criador saem sempre montadas. A miniatura fica por baixo enquanto a montada ou a imagem grande carregam.
 */
export function CardFace({ card, size, eager = false, className = '' }: Props) {
  // Carta do criador (montador de decks): não tem imagem impressa, é sempre montada.
  if (isCustomCardId(card.id)) {
    return (
      <div className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 ${className}`}>
        <CustomCardFaceRender cardId={card.id} />
      </div>
    );
  }
  return <CatalogCardFace card={card} size={size} eager={eager} className={className} />;
}

function CatalogCardFace({ card, size, eager = false, className = '' }: Props) {
  return (
    <div
      className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 bg-cover ${className}`}
      style={{
        backgroundImage: `url(${cardImageUrl(card, 'thumb')})`,
        // Os cantos com o raio da moldura da carta, na montada e na impressa: as imagens impressas (e a miniatura por
        // trás da montada) têm o canto reto, preenchido com a cor da borda, que apareceria fora do canto da carta.
        // Carta sem layout (a impressa): o raio padrão.
        borderRadius: cardCornerCss(card.layout?.layout, card.type, card.layout?.panelVariant),
      }}
    >
      {card.layout ? (
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
