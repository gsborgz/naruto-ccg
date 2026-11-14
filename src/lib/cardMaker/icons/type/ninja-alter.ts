import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/**
 * Ícone alternativo do tipo Ninja (card-layouts/icons/type/type-ninja-alter.png).
 * Ponto de partida: a caixa, a posição da arte e o nome de ninja, com a arte nova
 * (tela de 1261×1247) na mesma largura. A conferir contra uma carta impressa.
 */
export const TYPE_NINJA_ALTER: NamedIconConfig = {
  url: iconUrl('type', 'type-ninja-alter'),
  aspect: 1243 / 1265,
  art: { x: 0.0086, y: -0.0067, w: 0.9813, h: 0.9704 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'NINJA',
    cx: 0.2264,
    cy: 0.4708,
    cap: 0.0800,
    length: 0.3300,
  },
};
