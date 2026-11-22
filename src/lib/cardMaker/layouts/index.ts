import type { CardType } from '../../../models/card.ts';
import type { LayoutId } from '../model.ts';
import type { LayoutSpec, TextDividerStyle } from './types.ts';

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

/** Linha acima do texto de efeito nos layouts que ainda não têm a sua (`LayoutSpec.textDivider`). */
export const TEXT_DIVIDER_DEFAULT: TextDividerStyle = { gap: 14, inset: 0, thickness: 6, default: true };

/** Cor da linha acima do texto nos layouts sem `textDividerColor`. */
export const TEXT_DIVIDER_COLOR = '#8e2a1f';

/** Caminho de um ajuste de posição da carta (`CustomCard.layoutOverrides`): campos do layout separados por ponto. */
export const LAYOUT_OVERRIDE_PATH = /^[A-Za-z][A-Za-z0-9-]*(.[A-Za-z0-9-]+){1,5}$/;

/**
 * Configuração do layout da carta com os ajustes de posição dela (`layoutOverrides`). Só troca campos numéricos que
 * existem no layout, copiando os objetos do caminho (o layout carregado, `LAYOUTS`, fica como está; os tipos que
 * dividem o mesmo objeto no layout não mudam juntos).
 */
export function cardLayout(card: { layout?: string; layoutOverrides?: Record<string, number> }): LayoutSpec {
  const loaded = getLayout(card.layout);
  // Layouts gravados antes da linha acima do texto ficam com a padrão (e o ajuste da carta vale nela também).
  // Cópia do padrão: um objeto dividido entre layouts faria uma edição num valer em todos.
  const base = loaded.textDivider ? loaded : { ...loaded, textDivider: { ...TEXT_DIVIDER_DEFAULT } };
  const overrides = card.layoutOverrides;
  if (!overrides) return base;
  let spec: LayoutSpec | null = null;
  for (const [key, value] of Object.entries(overrides)) {
    if (!Number.isFinite(value) || !LAYOUT_OVERRIDE_PATH.test(key)) continue;
    const path = key.split('.');
    let probe: unknown = base;
    for (const k of path) probe = probe && typeof probe === 'object' ? (probe as Record<string, unknown>)[k] : undefined;
    if (typeof probe !== 'number') continue;
    spec ??= { ...base };
    let o = spec as unknown as Record<string, unknown>;
    for (const k of path.slice(0, -1)) {
      const copy = { ...(o[k] as Record<string, unknown>) };
      o[k] = copy;
      o = copy;
    }
    o[path[path.length - 1]] = value;
  }
  return spec ?? base;
}

/** Configuração do layout (cartas salvas com um layout desconhecido caem no layout 1). */
export function getLayout(id: string | undefined): LayoutSpec {
  return LAYOUTS[id as LayoutId] ?? LAYOUTS['layout-01'];
}
