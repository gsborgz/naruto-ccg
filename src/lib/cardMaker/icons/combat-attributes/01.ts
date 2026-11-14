import { ATTRIBUTE_TEXT_STYLE, iconUrl } from '../defaults.ts';
import type { CombatAttributeIconConfig } from '../types.ts';

/**
 * Atributo de Combate, moldura 01 (card-layouts/icons/combat-attributes/combat-attributes-01.png).
 * Calibrado no layout 1.
 * Medidas em pixels da tela do ícone (1215×1198), que é escalada para o tamanho do layout.
 */
export const COMBAT_ATTRIBUTES_01: CombatAttributeIconConfig = {
  url: iconUrl('combat-attributes', 'combat-attributes-01'),
  canvas: { w: 1215, h: 1198 },
  circle: { cx: 1066, cy: 1039, r: 138 },
  power: {
    ...ATTRIBUTE_TEXT_STYLE.power,
    // Saudável na lâmina de baixo; ferido na de cima (girado 90°).
    healthy: { x: 580, y: 1062 },
    injured: { x: 1080, y: 529 },
    size: 182.4,
    // Grossura do contorno dos números (pixels da tela).
    strokeWidth: 15,
  },
  // Nome do atributo: `strokeWidth` = grossura do contorno em pixels da carta (0 = sem contorno).
  label: { ...ATTRIBUTE_TEXT_STYLE.label, size: 28, uppercase: true, strokeWidth: 0.5 },
  kanji: ATTRIBUTE_TEXT_STYLE.kanji,
};
