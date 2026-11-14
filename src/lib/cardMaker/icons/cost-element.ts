import type { ElementSymbol } from '../../../models/card.ts';
import { iconUrl } from './defaults.ts';

/**
 * Kanjis de elemento no custo do Jutsu (card-layouts/icons/cost/cost-chakra-<elemento>): sem texto por
 * cima, então ficam todos neste arquivo. Telas quadradas (1254×1254).
 */
export const JUTSU_COST_ELEMENT_ICON: Record<ElementSymbol, string> = Object.fromEntries(
  (['earth', 'fire', 'lightning', 'void', 'water', 'wind'] as const).map((el) => [el, iconUrl('cost', `cost-chakra-${el}`)]),
) as Record<ElementSymbol, string>;
