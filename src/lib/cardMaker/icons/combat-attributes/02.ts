import { ATTRIBUTE_TEXT_STYLE, iconUrl } from '../defaults.ts';
import type { CombatAttributeIconConfig } from '../types.ts';

/**
 * Atributo de Combate, moldura 02 (card-layouts/icons/combat-attributes/combat-attributes-02.png).
 * Números estimados pelo desenho (a conferir).
 * Medidas em pixels da tela do ícone (1215×1198), que é escalada para o tamanho do layout.
 */
export const COMBAT_ATTRIBUTES_02: CombatAttributeIconConfig = {
  url: iconUrl('combat-attributes', 'combat-attributes-02'),
  canvas: { w: 1215, h: 1198 },
  circle: { cx: 1073, cy: 1051, r: 131 },
  power: {
    ...ATTRIBUTE_TEXT_STYLE.power,
    // Saudável na lâmina de baixo; ferido na de cima (girado 90°).
    healthy: { x: 560, y: 1045 },
    injured: { x: 1090, y: 520 },
    size: 182.4,
    // Grossura do contorno dos números (pixels da tela).
    strokeWidth: 25.5,
  },
  // Nome do atributo: `strokeWidth` = grossura do contorno em pixels da carta (0 = sem contorno).
  label: { ...ATTRIBUTE_TEXT_STYLE.label, size: 27.4, uppercase: true, strokeWidth: 0 },
  kanji: ATTRIBUTE_TEXT_STYLE.kanji,
};
