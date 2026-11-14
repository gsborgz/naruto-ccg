import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/**
 * Elemento wind, variante 03 (card-layouts/icons/element/element-wind-03.png).
 * Ponto de partida: a caixa, a posição da arte e o nome de wind-02, com a arte nova
 * (tela de 1278×1230) na mesma largura. A conferir contra uma carta impressa.
 */
export const ELEMENT_WIND_03: NamedIconConfig = {
  url: iconUrl('element', 'element-wind-03'),
  aspect: 1208 / 1168,
  art: { x: -0.0001, y: 0.0066, w: 0.9971, h: 0.9597 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'WIND',
    cx: 0.1650,
    cy: 0.4944,
    cap: 0.1050,
    length: 0.36,
  },
};
