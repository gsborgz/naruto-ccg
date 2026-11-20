import { cardImageUrl, type Card } from '../../models/card.ts';
import { cardArtUrl, type CardArtPlacement, type CardLayoutInfo } from '../../models/cardLayout.ts';
import { customCardToCard } from './deckCard.ts';
import { cardVillages, catalogTextToMarkup, fromCatalogCard, type CustomCard, type CustomCardArt } from './model.ts';

/**
 * Edição das cartas do catálogo pela aba Editar do detalhe da carta: a carta vira uma carta do criador
 * (`catalogDraft`), é editada com o mesmo editor do criador e volta para o formato do catálogo (`toCatalogCard`), com
 * o visual da carta montada no `layout` dela. Os textos são os do conteúdo do jogo (PT-BR).
 */

const NOW = '2026-01-01T00:00:00.000Z';

/**
 * A carta do catálogo como carta do criador. Carta ainda não escaneada (sem `layout`): a impressa faz o fundo
 * (centralizada; o enquadramento fica para quem edita).
 */
export function catalogDraft(card: Card): CustomCard {
  const draft = fromCatalogCard(card, NOW);
  if (card.layout) return draft;
  return { ...draft, art: { src: cardImageUrl(card, 'full'), x: 0, y: 0, zoom: 1 }, printedFlavor: card.flavor ?? '' };
}

/** A camada de arte da carta do criador no formato do `layout` da carta (`CardArtPlacement`). */
function placementOf(card: Card, art: CustomCardArt | undefined, layer: 'back' | 'front'): CardArtPlacement | undefined {
  if (!art?.src) return undefined;
  const frame = { x: round(art.x), y: round(art.y), zoom: Math.round(art.zoom * 10000) / 10000 };
  if (art.src === cardArtUrl(card.id, layer)) return frame;
  if (layer === 'back' && art.src === cardArtUrl(card.id, 'print-clean')) return { ...frame, print: true, clean: true };
  if (layer === 'back' && art.src === cardImageUrl(card, 'full')) return { ...frame, print: true };
  return { ...frame, src: art.src };
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * A carta editada (`draft`) de volta no formato do catálogo, a partir da original: os dados de jogo e os textos saem
 * do editor; o id, a coleção, o número, a imagem impressa e o Token ficam os da original. O visual (layout, ícones,
 * design, artes, ajustes do nome) vai para o `layout` da carta, com o que não sai dos dados (texto com marcação,
 * nome com quebra de linha, vilas) só quando difere.
 */
export function toCatalogCard(original: Card, draft: CustomCard): Card {
  const parsed = customCardToCard(draft);
  const name = draft.name.trim().replace(/\s+/g, ' ');
  const card = {
    ...parsed,
    id: original.id,
    name: name || original.name,
    set: original.set,
    number: original.number,
    image: original.image,
    ...(original.token && { token: true }),
  } as Card;

  const back = placementOf(original, draft.art, 'back');
  const front = placementOf(original, draft.artFront, 'front');
  const layout: CardLayoutInfo = {
    layout: draft.layout,
    icons: {
      type: draft.typeVariant ?? 'default',
      elements: draft.elements.map((e) => e.variant),
      ...(card.type !== 'jutsu' && { entrance: draft.entranceIcon, hand: draft.handIcon }),
      ...(card.type === 'ninja' && { attribute: draft.attribute.frame }),
    },
    art: { ...(back && { back }), ...(front && { front }) },
  };
  if (draft.panelVariant) layout.panelVariant = draft.panelVariant;
  if (draft.nameBanner !== undefined) layout.nameBanner = draft.nameBanner;
  if (draft.nameSize) layout.nameSize = draft.nameSize;
  if (draft.nameWrap && draft.nameWrap !== 'auto') layout.nameWrap = draft.nameWrap;
  if (draft.flavorShade === false) layout.flavorShade = false;
  if (draft.name.trim() !== card.name) layout.nameText = draft.name.trim();
  const markup = draft.text.trim();
  if (markup !== card.text.map(catalogTextToMarkup).join('\n')) layout.textMarkup = markup;
  // Vilas: só quando diferem das que a carta tiraria das características.
  const derived = cardVillages(fromCatalogCard({ ...card, layout: undefined }, NOW));
  const villages = cardVillages(draft);
  if (JSON.stringify(villages) !== JSON.stringify(derived)) layout.villages = villages;
  card.layout = layout;
  return card;
}

/** Endereços de arte no Vercel Blob que a carta usa (para o servidor contar o uso). */
export function catalogCardArts(card: Card): string[] {
  const art = card.layout?.art;
  return [art?.back?.src, art?.front?.src].filter((s): s is string => !!s);
}
