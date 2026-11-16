import type { CardType } from '../../../models/card.ts';

/**
 * Raio dos cantos da carta montada, em unidades da carta (750×1050). As molduras têm o canto arredondado e o raio
 * muda de layout para layout (e de tipo para tipo): a carta montada é recortada com o raio da moldura dela, para a
 * arte (ou a miniatura por trás, enquanto carrega) não aparecer fora do canto.
 *
 * Arquivo leve de propósito: o `CardFace` usa para arredondar a carta antes de carregar a configuração dos layouts.
 */

/** Sem moldura (layouts 3 e 5, arte de corpo inteiro) ou sem medida: 3,5% da largura. */
export const CARD_CORNER = 26;

/**
 * Medido nas imagens das molduras (`card-layouts/layout-XX/*-frame.png`, primeiro pixel opaco na diagonal do canto),
 * com 1 de folga. Chave: o layout, ou `layout:design` para um design alternativo com moldura própria.
 */
const FRAME_CORNERS: Record<string, Partial<Record<CardType, number>>> = {
  'layout-01': { ninja: 42, client: 42, jutsu: 37, mission: 35 },
  'layout-02': { ninja: 28, client: 28, jutsu: 30, mission: 28 },
  'layout-04': { ninja: 35 },
  'layout-04:purple': { ninja: 32 },
};

/**
 * Raio dos cantos da carta (unidades da carta) para o layout, o tipo e o design escolhidos. Vale também para a
 * imagem impressa, que tem a mesma moldura. Sem layout (coleção ainda não mapeada): `CARD_CORNER`.
 */
export function cardCorner(layout: string | undefined, type: CardType, design?: string): number {
  if (!layout) return CARD_CORNER;
  const id = layout;
  return (design && FRAME_CORNERS[`${id}:${design}`]?.[type]) || FRAME_CORNERS[id]?.[type] || CARD_CORNER;
}

/** O raio como `border-radius` em porcentagem (horizontal / vertical), para qualquer tamanho da carta. */
export function cardCornerCss(layout: string | undefined, type: CardType, design?: string): string {
  const r = cardCorner(layout, type, design);
  return `${((r / 750) * 100).toFixed(3)}% / ${((r / 1050) * 100).toFixed(3)}%`;
}
