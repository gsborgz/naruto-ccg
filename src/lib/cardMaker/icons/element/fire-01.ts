import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento fire, variante 01 (card-layouts/icons/element/element-fire-01.png). */
export const ELEMENT_FIRE_01: NamedIconConfig = {
  url: iconUrl('element', 'element-fire-01'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1217 / 1212,
  art: { x: 0.005, y: 0, w: 1.0259, h: 1.0081 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'FIRE',
    cx: 0.1800,
    cy: 0.4819,
    cap: 0.1100,
    length: 0.2900,
  },
};
