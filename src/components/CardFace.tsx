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
  /** Mostra a carta montada quando ela tem `layout` (cartas escaneadas). Padrão: não (a imagem impressa). */
  rendered?: boolean;
  /** Imagem original: prioridade de carregamento (primeiras linhas da grade). */
  eager?: boolean;
  className?: string;
}

/**
 * Face da carta em proporção 5:7: a imagem impressa ou, com `rendered` e a carta já escaneada, a carta montada
 * (layout + artes extraídas). As cartas do criador saem sempre montadas. A miniatura fica por baixo enquanto a montada ou a imagem grande carregam.

 */
export function CardFace({ card, size, rendered = false, eager = false, className = '' }: Props) {
  // Carta do criador (montador de decks): não tem imagem impressa, é sempre montada.
  if (isCustomCardId(card.id)) {
    return (
      <div className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 ${className}`}>
        <CustomCardFaceRender cardId={card.id} />
      </div>
    );
  }
  return <CatalogCardFace card={card} size={size} rendered={rendered} eager={eager} className={className} />;
}

function CatalogCardFace({ card, size, rendered = false, eager = false, className = '' }: Props) {
  const showRendered = rendered && card.layout !== undefined;
  return (
    <div
      className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 bg-cover ${className}`}
      style={{
        backgroundImage: `url(${cardImageUrl(card, 'thumb')})`,
        // Os cantos com o raio da moldura da carta, na montada e na impressa: as imagens impressas (e a miniatura por
        // trás da montada) têm o canto reto, preenchido com a cor da borda, que apareceria fora do canto da carta.
        // Coleções ainda não mapeadas: o raio padrão
        // (montada sem layout mapeado = layout 1, como em `fromCatalogCard`).
        borderRadius: cardCornerCss(
          card.layout?.layout ?? (showRendered ? 'layout-01' : undefined),
          card.type,
          card.layout?.panelVariant,
        ),
      }}
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
