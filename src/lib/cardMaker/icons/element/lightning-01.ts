import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento lightning, variante 01 (card-layouts/icons/element/element-lightning-01.png). */
export const ELEMENT_LIGHTNING_01: NamedIconConfig = {
  url: iconUrl('element', 'element-lightning-01'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1190 / 1206,
  art: { x: -0.0389, y: -0.0001, w: 1.0259, h: 0.9797 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'LIGHTNING',
    cx: 0.1444,
    cy: 0.4764,
    cap: 0.1000,
    length: 0.7200,
  },
};
