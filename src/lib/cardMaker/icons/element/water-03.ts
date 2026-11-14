import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/**
 * Elemento water, variante 03 (card-layouts/icons/element/element-water-03.png).
 * Ponto de partida: a caixa, a posição da arte e o nome de water-02, com a arte nova
 * (tela de 1254×1254) na mesma largura. A conferir contra uma carta impressa.
 */
export const ELEMENT_WATER_03: NamedIconConfig = {
  url: iconUrl('element', 'element-water-03'),
  aspect: 1181 / 1179,
  art: { x: -0.0528, y: -0.0134, w: 1.0696, h: 1.0696 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'WATER',
    cx: 0.1425,
    cy: 0.4694,
    cap: 0.1000,
    length: 0.400,
  },
};
