'use client';

import dynamic from 'next/dynamic';
import { useChosenArt } from '@/lib/altArtClient';
import { hasFixedArt } from '@/lib/altArts';
import { isCustomCardId } from '@/lib/cardMaker/customIds';
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
 *
 * Arte alternativa (README, "Artes alternativas"): com uma arte escolhida neste navegador (ou fixada na carta,
 * `ArtCard.altArt`, como na partida), a carta sai sempre montada com ela, mesmo com `rendered` desligado.
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
  const chosen = useChosenArt(card.id);
  const art = hasFixedArt(card) ? card.altArt : chosen;
  const showRendered = !!art || (rendered && card.layout !== undefined);
  return (
    <div
      className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 bg-cover ${className}`}
      style={{ backgroundImage: `url(${cardImageUrl(card, 'thumb')})` }}
    >
      {showRendered ? (
        <CatalogCardRender card={card} art={art} />
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
