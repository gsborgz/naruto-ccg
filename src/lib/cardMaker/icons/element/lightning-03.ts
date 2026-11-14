import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/**
 * Elemento lightning, variante 03 (card-layouts/icons/element/element-lightning-03.png).
 * Ponto de partida: a caixa, a posição da arte e o nome de lightning-02, com a arte nova
 * (tela de 1278×1230) na mesma largura. A conferir contra uma carta impressa.
 */
export const ELEMENT_LIGHTNING_03: NamedIconConfig = {
  url: iconUrl('element', 'element-lightning-03'),
  aspect: 1160 / 1195,
  art: { x: 0.0124, y: 0.0201, w: 0.9919, h: 0.9546 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'LIGHTNING',
    cx: 0.1958,
    cy: 0.4764,
    cap: 0.1000,
    length: 0.7200,
  },
};
