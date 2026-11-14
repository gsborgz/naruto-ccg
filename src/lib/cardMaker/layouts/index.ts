import type { CardType } from '../../../models/card.ts';
import type { LayoutId } from '../model.ts';
import { LAYOUT_01 } from './layout01.ts';
import { LAYOUT_02 } from './layout02.ts';
import { LAYOUT_03 } from './layout03.ts';
import { LAYOUT_04 } from './layout04.ts';
import { LAYOUT_05 } from './layout05.ts';
import type { LayoutSpec } from './types.ts';

export * from './shared.ts';
export * from '../icons/index.ts';
export type * from './types.ts';

/** Layouts do criador, na ordem do seletor. Cada um tem a configuração própria (`layoutXX.ts`). */
export const LAYOUTS: Record<LayoutId, LayoutSpec> = {
  'layout-01': LAYOUT_01,
  'layout-02': LAYOUT_02,
  'layout-03': LAYOUT_03,
  'layout-04': LAYOUT_04,
  'layout-05': LAYOUT_05,
};

export const LAYOUT_LIST: LayoutSpec[] = Object.values(LAYOUTS);

/**
 * Painel de dados da carta: a versão escolhida (`panelVariant`) ou o painel padrão do layout
 * (também quando a versão não existe no layout atual, ex.: depois de trocar de layout).
 */
export function panelFor(spec: LayoutSpec, type: CardType, variant: string | undefined): string | undefined {
  return designVariant(spec, variant)?.panel[type] ?? spec.panel[type];
}

/** Moldura da carta: a do design escolhido (`panelVariant`), se ele tiver uma, ou a padrão do layout. */
export function frameFor(spec: LayoutSpec, type: CardType, variant: string | undefined): string | undefined {
  return designVariant(spec, variant)?.frame?.[type] ?? spec.frame[type];
}

const designVariant = (spec: LayoutSpec, variant: string | undefined) =>
  variant ? spec.panelVariants?.find((v) => v.id === variant) : undefined;

/** Configuração do layout (cartas salvas com um layout desconhecido caem no layout 1). */
export function getLayout(id: string | undefined): LayoutSpec {
  return LAYOUTS[id as LayoutId] ?? LAYOUT_01;
}
