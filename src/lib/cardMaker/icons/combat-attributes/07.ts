import { ATTRIBUTE_TEXT_STYLE, iconUrl } from '../defaults.ts';
import type { CombatAttributeIconConfig } from '../types.ts';

/**
 * Atributo de Combate, moldura 07 (card-layouts/icons/combat-attributes/combat-attributes-07.png).
 * Calibrado no layout 3.
 * Medidas em pixels da tela do ícone (1215×1198), que é escalada para o tamanho do layout.
 */
export const COMBAT_ATTRIBUTES_07: CombatAttributeIconConfig = {
  url: iconUrl('combat-attributes', 'combat-attributes-07'),
  canvas: { w: 1215, h: 1198 },
  circle: { cx: 1048, cy: 1037, r: 161 },
  power: {
    ...ATTRIBUTE_TEXT_STYLE.power,
    // Saudável na lâmina de baixo; ferido na de cima (girado 90°).
    healthy: { x: 595, y: 1048 },
    injured: { x: 1099, y: 519 },
    size: 175.1,
    // Grossura do contorno dos números (pixels da tela).
    strokeWidth: 25.5,
  },
  // Nome do atributo: `strokeWidth` = grossura do contorno em pixels da carta (0 = sem contorno).
  label: { ...ATTRIBUTE_TEXT_STYLE.label, size: 29.2, uppercase: true, strokeWidth: 0 },
  kanji: ATTRIBUTE_TEXT_STYLE.kanji,
};
