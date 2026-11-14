import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento wind, variante 01 (card-layouts/icons/element/element-wind-01.png). */
export const ELEMENT_WIND_01: NamedIconConfig = {
  url: iconUrl('element', 'element-wind-01'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1185 / 1163,
  art: { x: -0.0228, y: 0.0009, w: 1.015, h: 1.0193 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'WIND',
    cx: 0.1600,
    cy: 0.4958,
    cap: 0.1000,
    length: 0.3700,
  },
};
