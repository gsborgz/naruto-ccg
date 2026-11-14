import type { CardType } from '../../../models/card.ts';
import type { AttributeFrame, EntranceIcon, HandIcon } from '../model.ts';
import { TYPE_NINJA } from './type/ninja.ts';
import { TYPE_JUTSU } from './type/jutsu.ts';
import { TYPE_MISSION } from './type/mission.ts';
import { TYPE_CLIENT } from './type/client.ts';
import { TYPE_NINJA_ALTER } from './type/ninja-alter.ts';
import { ELEMENT_EARTH_01 } from './element/earth-01.ts';
import { ELEMENT_EARTH_02 } from './element/earth-02.ts';
import { ELEMENT_EARTH_03 } from './element/earth-03.ts';
import { ELEMENT_FIRE_01 } from './element/fire-01.ts';
import { ELEMENT_FIRE_02 } from './element/fire-02.ts';
import { ELEMENT_FIRE_03 } from './element/fire-03.ts';
import { ELEMENT_LIGHTNING_01 } from './element/lightning-01.ts';
import { ELEMENT_LIGHTNING_02 } from './element/lightning-02.ts';
import { ELEMENT_LIGHTNING_03 } from './element/lightning-03.ts';
import { ELEMENT_VOID_01 } from './element/void-01.ts';
import { ELEMENT_WATER_01 } from './element/water-01.ts';
import { ELEMENT_WATER_02 } from './element/water-02.ts';
import { ELEMENT_WATER_03 } from './element/water-03.ts';
import { ELEMENT_WIND_01 } from './element/wind-01.ts';
import { ELEMENT_WIND_02 } from './element/wind-02.ts';
import { ELEMENT_WIND_03 } from './element/wind-03.ts';
import { COST_ENTRANCE_01 } from './cost/entrance-01.ts';
import { COST_ENTRANCE_02 } from './cost/entrance-02.ts';
import { COST_ENTRANCE_03 } from './cost/entrance-03.ts';
import { COST_ENTRANCE_04 } from './cost/entrance-04.ts';
import { COST_HAND_01 } from './cost/hand-01.ts';
import { COST_HAND_02 } from './cost/hand-02.ts';
import { COST_HAND_03 } from './cost/hand-03.ts';
import { COST_CHAKRA_ANY } from './cost/chakra-any.ts';
import { COMBAT_ATTRIBUTES_01 } from './combat-attributes/01.ts';
import { COMBAT_ATTRIBUTES_02 } from './combat-attributes/02.ts';
import { COMBAT_ATTRIBUTES_03_01 } from './combat-attributes/03-01.ts';
import { COMBAT_ATTRIBUTES_03_02 } from './combat-attributes/03-02.ts';
import { COMBAT_ATTRIBUTES_05 } from './combat-attributes/05.ts';
import { COMBAT_ATTRIBUTES_06_01 } from './combat-attributes/06-01.ts';
import { COMBAT_ATTRIBUTES_06_02 } from './combat-attributes/06-02.ts';
import { COMBAT_ATTRIBUTES_06_03 } from './combat-attributes/06-03.ts';
import { COMBAT_ATTRIBUTES_07 } from './combat-attributes/07.ts';
import type { ChakraIconConfig, CombatAttributeIconConfig, CostIconConfig, NamedIconConfig } from './types.ts';

/**
 * Configuração de cada ícone (um arquivo por ícone nesta pasta): imagem, proporção e o texto desenhado
 * nele (nome, números, kanji), em medidas relativas ao próprio ícone. Assim o ícone fica igual em todos
 * os layouts, que só dizem onde ele fica e o tamanho (`IconPlacement`).
 */

export type * from './types.ts';
export * from './defaults.ts';
export * from './village.ts';
export * from './cost-element.ts';

export const TYPE_ICONS: Record<CardType, NamedIconConfig> = {
  'ninja': TYPE_NINJA,
  'jutsu': TYPE_JUTSU,
  'mission': TYPE_MISSION,
  'client': TYPE_CLIENT,
};

/**
 * Ícones alternativos do tipo, escolhidos na carta (`CustomCard.typeVariant`). Para incluir um, crie o
 * arquivo em type/ e adicione aqui com um id e o nome do seletor.
 */
export const TYPE_ICON_VARIANTS: Partial<Record<CardType, { id: string; label: string; icon: NamedIconConfig }[]>> = {
  ninja: [{ id: 'alter', label: 'Alternativo', icon: TYPE_NINJA_ALTER }],
};

/** Chave `<elemento>-<variante>` (o Vazio só tem a 01). */
export const ELEMENT_ICONS: Record<string, NamedIconConfig> = {
  'earth-01': ELEMENT_EARTH_01,
  'earth-02': ELEMENT_EARTH_02,
  'earth-03': ELEMENT_EARTH_03,
  'fire-01': ELEMENT_FIRE_01,
  'fire-02': ELEMENT_FIRE_02,
  'fire-03': ELEMENT_FIRE_03,
  'lightning-01': ELEMENT_LIGHTNING_01,
  'lightning-02': ELEMENT_LIGHTNING_02,
  'lightning-03': ELEMENT_LIGHTNING_03,
  'void-01': ELEMENT_VOID_01,
  'water-01': ELEMENT_WATER_01,
  'water-02': ELEMENT_WATER_02,
  'water-03': ELEMENT_WATER_03,
  'wind-01': ELEMENT_WIND_01,
  'wind-02': ELEMENT_WIND_02,
  'wind-03': ELEMENT_WIND_03,
};

export const COST_ICONS: Record<EntranceIcon | HandIcon, CostIconConfig> = {
  'entrance-01': COST_ENTRANCE_01,
  'entrance-02': COST_ENTRANCE_02,
  'entrance-03': COST_ENTRANCE_03,
  'entrance-04': COST_ENTRANCE_04,
  'hand-01': COST_HAND_01,
  'hand-02': COST_HAND_02,
  'hand-03': COST_HAND_03,
};

export const CHAKRA_ICON: ChakraIconConfig = COST_CHAKRA_ANY;

export const COMBAT_ATTRIBUTE_ICONS: Record<AttributeFrame, CombatAttributeIconConfig> = {
  '01': COMBAT_ATTRIBUTES_01,
  '02': COMBAT_ATTRIBUTES_02,
  '03-01': COMBAT_ATTRIBUTES_03_01,
  '03-02': COMBAT_ATTRIBUTES_03_02,
  '05': COMBAT_ATTRIBUTES_05,
  '06-01': COMBAT_ATTRIBUTES_06_01,
  '06-02': COMBAT_ATTRIBUTES_06_02,
  '06-03': COMBAT_ATTRIBUTES_06_03,
  '07': COMBAT_ATTRIBUTES_07,
};
