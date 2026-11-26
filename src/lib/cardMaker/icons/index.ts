import type { CardType } from '../../../models/card.ts';
import { ATTRIBUTE_PAIR_DEFAULT, ATTRIBUTE_TEXT_WRAP_DEFAULT, attributeSymbolDefault } from './defaults.ts';
import type { AttributeFrame, EntranceIcon, HandIcon } from '../model.ts';
import type { ChakraIconConfig, CombatAttributeIconConfig, CostIconConfig, NamedIconConfig } from './types.ts';

/**
 * Configuração de cada ícone: imagem, proporção e o texto desenhado nele (nome, números, kanji), em medidas relativas
 * ao próprio ícone. Assim o ícone fica igual em todos os layouts, que só dizem onde ele fica e o tamanho
 * (`IconPlacement`).
 *
 * Os mapas abaixo começam vazios e são preenchidos com o conteúdo do Redis (src/lib/content/hydrate.ts), onde cada
 * ícone fica com a chave `<grupo>:<id>` (`IconsContent`). A carga inicial fica em `seed.ts` (um arquivo por ícone
 * nesta pasta).
 */

export type * from './types.ts';
export * from './defaults.ts';
export * from './village.ts';
export * from './cost-element.ts';

/** Grupos de ícones, como no editor de layouts (`/criar/layouts`). */
export const ICON_GROUPS = ['type', 'type-variant', 'element', 'cost', 'chakra', 'attribute'] as const;
export type IconGroup = (typeof ICON_GROUPS)[number];

/** Configuração de um ícone de qualquer grupo. */
export type AnyIconConfig = NamedIconConfig | CostIconConfig | ChakraIconConfig | CombatAttributeIconConfig;

/** Todos os ícones, com a chave `<grupo>:<id>` (ex.: `element:fire-02`, `chakra:chakra-any`). */
export type IconsContent = Record<string, AnyIconConfig>;

export const TYPE_ICONS = {} as Record<CardType, NamedIconConfig>;

/**
 * Nome no seletor dos ícones alternativos do tipo impressos. Os criados no editor têm o nome na configuração (`name`).
 * O ícone de cada um é o `type-variant:<tipo>-<id>` do conteúdo (ex.: `type-variant:ninja-alter`).
 */
const TYPE_ICON_VARIANT_LABELS: Record<string, string> = { alter: 'Alternativo' };

const CARD_TYPES: readonly CardType[] = ['ninja', 'jutsu', 'mission', 'client'];

/** Ordem dos ids: números em ordem numérica ("03-02" antes de "05", "10" depois de "09"). */
const byId = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true });

/** Ícones de custo de entrada existentes (os impressos e os criados no editor). */
export function entranceIcons(): EntranceIcon[] {
  return (Object.keys(COST_ICONS) as EntranceIcon[]).filter((id) => id.startsWith('entrance-')).sort(byId);
}

/** Ícones de custo de mão existentes. */
export function handIcons(): HandIcon[] {
  return (Object.keys(COST_ICONS) as HandIcon[]).filter((id) => id.startsWith('hand-')).sort(byId);
}

/** Molduras do Atributo de Combate existentes. */
export function attributeFrames(): AttributeFrame[] {
  return Object.keys(COMBAT_ATTRIBUTE_ICONS).sort(byId);
}

export const TYPE_ICON_VARIANTS: Partial<Record<CardType, { id: string; label: string; icon: NamedIconConfig }[]>> = {};

/** Chave `<elemento>-<variante>` (o Vazio só tem a 01). */
export const ELEMENT_ICONS: Record<string, NamedIconConfig> = {};

export const COST_ICONS = {} as Record<EntranceIcon | HandIcon, CostIconConfig>;

/** Chakra genérico do custo do Jutsu (`chakra:chakra-any`). Objeto único, atualizado no lugar. */
export const CHAKRA_ICON = {} as ChakraIconConfig;

export const COMBAT_ATTRIBUTE_ICONS = {} as Record<AttributeFrame, CombatAttributeIconConfig>;

const replaceContents = (target: Record<string, unknown>, source: Record<string, unknown>) => {
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, source);
};

/** Preenche os mapas acima com os ícones do conteúdo (chamado por `hydrateContent`). */
export function installIcons(icons: IconsContent): void {
  const group = <T,>(name: IconGroup) =>
    Object.fromEntries(
      Object.entries(icons)
        .filter(([key]) => key.startsWith(`${name}:`))
        .map(([key, value]) => [key.slice(name.length + 1), value as T]),
    );
  replaceContents(TYPE_ICONS, group<NamedIconConfig>('type'));
  replaceContents(ELEMENT_ICONS, group<NamedIconConfig>('element'));
  replaceContents(COST_ICONS, group<CostIconConfig>('cost'));
  replaceContents(COMBAT_ATTRIBUTE_ICONS, group<CombatAttributeIconConfig>('attribute'));
  // Dois atributos: os campos que o ícone ainda não gravou ficam com o padrão (e aparecem na aba Ícones).
  for (const icon of Object.values(COMBAT_ATTRIBUTE_ICONS)) {
    icon.pair = { ...ATTRIBUTE_PAIR_DEFAULT, ...icon.pair };
    icon.textWrap = { ...ATTRIBUTE_TEXT_WRAP_DEFAULT, ...icon.textWrap };
    icon.symbol = attributeSymbolDefault(icon);
  }
  replaceContents(CHAKRA_ICON as unknown as Record<string, unknown>, (icons['chakra:chakra-any'] ?? {}) as unknown as Record<string, unknown>);
  const variants = group<NamedIconConfig>('type-variant');
  replaceContents(
    TYPE_ICON_VARIANTS,
    Object.fromEntries(
      CARD_TYPES.map((type) => [
        type,
        Object.entries(variants)
          .filter(([key]) => key.startsWith(`${type}-`))
          .map(([key, icon]) => {
            const id = key.slice(type.length + 1);
            return { id, label: icon.name || TYPE_ICON_VARIANT_LABELS[id] || id, icon };
          })
          .sort((a, b) => byId(a.id, b.id)),
      ]),
    ),
  );
}
