import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/**
 * Elemento fire, variante 03 (card-layouts/icons/element/element-fire-03.png).
 * Ponto de partida: a caixa, a posição da arte e o nome de fire-02, com a arte nova
 * (tela de 1261×1247) na mesma largura. A conferir contra uma carta impressa.
 */
export const ELEMENT_FIRE_03: NamedIconConfig = {
  url: iconUrl('element', 'element-fire-03'),
  aspect: 1225 / 1228,
  art: { x: 0, y: -0.0022, w: 1.003, h: 0.9919 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'FIRE',
    cx: 0.1900,
    cy: 0.4792,
    cap: 0.105,
    length: 0.29,
  },
};
