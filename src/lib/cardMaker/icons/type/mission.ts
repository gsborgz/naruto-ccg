import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Ícone do tipo Mission (card-layouts/icons/type/type-mission.png). */
export const TYPE_MISSION: NamedIconConfig = {
  url: iconUrl('type', 'type-mission'),
  // Caixa: a tela de 1265×1243 dos ícones antigos, que tinham o nome impresso (as posições foram calibradas nela).
  aspect: 1243 / 1265,
  art: { x: 0.006, y: -0.0071, w: 0.9873, h: 0.9873 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'MISSION',
    cx: 0.225,
    cy: 0.4667,
    cap: 0.0800,
    length: 0.50,
  },
};
