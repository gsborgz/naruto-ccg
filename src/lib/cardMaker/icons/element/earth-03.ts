import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/**
 * Elemento earth, variante 03 (card-layouts/icons/element/element-earth-03.png).
 * Ponto de partida: a caixa, a posição da arte e o nome de earth-02, com a arte nova
 * (tela de 1254×1254) na mesma largura. A conferir contra uma carta impressa.
 */
export const ELEMENT_EARTH_03: NamedIconConfig = {
  url: iconUrl('element', 'element-earth-03'),
  aspect: 1172 / 1306,
  art: { x: 0.0324, y: -0.0058, w: 0.9417, h: 0.9335 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'EARTH',
    cx: 0.1800,
    cy: 0.3625,
    cap: 0.1050,
    length: 0.3600,
  },
};
