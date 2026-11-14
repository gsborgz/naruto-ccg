import type { Village } from '../model.ts';
import { iconUrl } from './defaults.ts';

/**
 * Ícones de vila (card-layouts/icons/village): sem texto, então ficam todos neste arquivo.
 * Telas padronizadas de 1254×1254; a da Nuvem é 1701×925. O tamanho do layout é a largura da tela
 * padrão, e as outras telas ficam na mesma escala, centradas na mesma caixa.
 */
export const VILLAGE_CANVAS_DEFAULT = { w: 1254, h: 1254 };
export const VILLAGE_CANVAS: Partial<Record<Village, { w: number; h: number }>> = { cloud: { w: 1701, h: 925 } };

export const villageIconUrl = (village: Village, rogue = false) => iconUrl('village', `village-${village}${rogue ? '-rogue' : ''}`);
