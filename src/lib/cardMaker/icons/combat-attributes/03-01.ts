import { ATTRIBUTE_TEXT_STYLE, iconUrl } from '../defaults.ts';
import type { CombatAttributeIconConfig } from '../types.ts';

/**
 * Atributo de Combate, moldura 03-01 (card-layouts/icons/combat-attributes/combat-attributes-03-01.png).
 * Calibrado no layout 2.
 * Medidas em pixels da tela do ícone (1215×1198), que é escalada para o tamanho do layout.
 */
export const COMBAT_ATTRIBUTES_03_01: CombatAttributeIconConfig = {
  url: iconUrl('combat-attributes', 'combat-attributes-03-01'),
  canvas: { w: 1215, h: 1198 },
  circle: { cx: 1060, cy: 1019, r: 143 },
  power: {
    ...ATTRIBUTE_TEXT_STYLE.power,
    // Saudável na lâmina de baixo; ferido na de cima (girado 90°).
    healthy: { x: 592.1, y: 1047.1 },
    injured: { x: 1076.8, y: 519.7 },
    size: 182.4,
    // Grossura do contorno dos números (pixels da tela).
    strokeWidth: 25.5,
  },
  // Nome do atributo: `strokeWidth` = grossura do contorno em pixels da carta (0 = sem contorno).
  label: { ...ATTRIBUTE_TEXT_STYLE.label, size: 29.2, uppercase: false, strokeWidth: 0 },
  kanji: ATTRIBUTE_TEXT_STYLE.kanji,
};
