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
import type { IconsContent } from './index.ts';

/**
 * Carga inicial (seed) dos ícones: a configuração calibrada de cada um (um arquivo por ícone nesta pasta). O app NÃO
 * lê estes arquivos: os ícones ficam no Redis (src/lib/content/) e são editados pelo site (`/criar/layouts`, aba
 * Ícones). Eles só servem para gravar o Redis quando ele está vazio e para os testes.
 *
 * Chave `<grupo>:<id>`, a mesma do editor (`IconChoice` em src/components/cardMaker/layoutEditing.tsx).
 */
export const SEED_ICONS: IconsContent = {
  'type:ninja': TYPE_NINJA,
  'type:jutsu': TYPE_JUTSU,
  'type:mission': TYPE_MISSION,
  'type:client': TYPE_CLIENT,
  'type-variant:ninja-alter': TYPE_NINJA_ALTER,
  'element:earth-01': ELEMENT_EARTH_01,
  'element:earth-02': ELEMENT_EARTH_02,
  'element:earth-03': ELEMENT_EARTH_03,
  'element:fire-01': ELEMENT_FIRE_01,
  'element:fire-02': ELEMENT_FIRE_02,
  'element:fire-03': ELEMENT_FIRE_03,
  'element:lightning-01': ELEMENT_LIGHTNING_01,
  'element:lightning-02': ELEMENT_LIGHTNING_02,
  'element:lightning-03': ELEMENT_LIGHTNING_03,
  'element:void-01': ELEMENT_VOID_01,
  'element:water-01': ELEMENT_WATER_01,
  'element:water-02': ELEMENT_WATER_02,
  'element:water-03': ELEMENT_WATER_03,
  'element:wind-01': ELEMENT_WIND_01,
  'element:wind-02': ELEMENT_WIND_02,
  'element:wind-03': ELEMENT_WIND_03,
  'cost:entrance-01': COST_ENTRANCE_01,
  'cost:entrance-02': COST_ENTRANCE_02,
  'cost:entrance-03': COST_ENTRANCE_03,
  'cost:entrance-04': COST_ENTRANCE_04,
  'cost:hand-01': COST_HAND_01,
  'cost:hand-02': COST_HAND_02,
  'cost:hand-03': COST_HAND_03,
  'chakra:chakra-any': COST_CHAKRA_ANY,
  'attribute:01': COMBAT_ATTRIBUTES_01,
  'attribute:02': COMBAT_ATTRIBUTES_02,
  'attribute:03-01': COMBAT_ATTRIBUTES_03_01,
  'attribute:03-02': COMBAT_ATTRIBUTES_03_02,
  'attribute:05': COMBAT_ATTRIBUTES_05,
  'attribute:06-01': COMBAT_ATTRIBUTES_06_01,
  'attribute:06-02': COMBAT_ATTRIBUTES_06_02,
  'attribute:06-03': COMBAT_ATTRIBUTES_06_03,
  'attribute:07': COMBAT_ATTRIBUTES_07,
};
