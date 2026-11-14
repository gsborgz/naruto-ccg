import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Ícone do tipo Ninja (card-layouts/icons/type/type-ninja.png). */
export const TYPE_NINJA: NamedIconConfig = {
  url: iconUrl('type', 'type-ninja'),
  // Caixa: a tela de 1265×1243 dos ícones antigos, que tinham o nome impresso (as posições foram calibradas nela).
  aspect: 1243 / 1265,
  art: { x: 0.0086, y: -0.0067, w: 0.9813, h: 0.9813 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'NINJA',
    cx: 0.2264,
    cy: 0.58,
    cap: 0.0800,
    length: 0.3300,
  },
};
