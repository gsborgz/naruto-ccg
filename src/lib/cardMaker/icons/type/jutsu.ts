import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Ícone do tipo Jutsu (card-layouts/icons/type/type-jutsu.png). */
export const TYPE_JUTSU: NamedIconConfig = {
  url: iconUrl('type', 'type-jutsu'),
  // Caixa: a tela de 1265×1243 dos ícones antigos, que tinham o nome impresso (as posições foram calibradas nela).
  aspect: 1243 / 1265,
  art: { x: 0.0022, y: -0.0129, w: 0.9972, h: 0.9972 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'JUTSU',
    cx: 0.2292,
    cy: 0.55,
    cap: 0.0800,
    length: 0.3300,
  },
};
