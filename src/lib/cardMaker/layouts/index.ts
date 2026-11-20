import type { CardType } from '../../../models/card.ts';
import type { LayoutId } from '../model.ts';
import type { LayoutSpec } from './types.ts';

export * from './shared.ts';
export * from '../icons/index.ts';
export type * from './types.ts';

/**
 * Layouts do criador, na ordem do seletor. Começam vazios e são preenchidos com o conteúdo do Redis
 * (src/lib/content/hydrate.ts). A carga inicial fica em `seed.ts` (a configuração calibrada de cada layout, `layoutXX.ts`).
 */
export const LAYOUTS = {} as Record<LayoutId, LayoutSpec>;

export const LAYOUT_LIST: LayoutSpec[] = [];

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
  return LAYOUTS[id as LayoutId] ?? LAYOUTS['layout-01'];
}
