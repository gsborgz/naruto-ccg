import type { Card } from '../models/card.ts';
import { S01_THE_PATH_TO_HOKAGE } from './sets/s01-the-path-to-hokage.ts';
import { S02_COILS_OF_THE_SNAKE } from './sets/s02-coils-of-the-snake.ts';
import { S03_CURSE_OF_THE_SAND } from './sets/s03-curse-of-the-sand.ts';
import { S04_REVENGE_AND_REBIRTH } from './sets/s04-revenge-and-rebirth.ts';
import { S05_THE_DREAM_LEGACY } from './sets/s05-the-dream-legacy.ts';
import { S06_ETERNAL_RIVALRY } from './sets/s06-eternal-rivalry.ts';
import { S07_QUEST_FOR_POWER } from './sets/s07-quest-for-power.ts';
import { S08_BATTLE_OF_DESTINY } from './sets/s08-battle-of-destiny.ts';
import { S09_THE_CHOSEN } from './sets/s09-the-chosen.ts';
import { S10_LINEAGE_OF_THE_LEGENDS } from './sets/s10-lineage-of-the-legends.ts';
import { S11_APPROACHING_WIND } from './sets/s11-approaching-wind.ts';
import { S12_A_NEW_CHRONICLE } from './sets/s12-a-new-chronicle.ts';
import { S13_FATEFUL_REUNION } from './sets/s13-fateful-reunion.ts';
import { S14_EMERGING_ALLIANCE } from './sets/s14-emerging-alliance.ts';
import { S15_FORETOLD_PROPHECY } from './sets/s15-foretold-prophecy.ts';
import { S16_BROKEN_PROMISE } from './sets/s16-broken-promise.ts';
import { S17_WILL_OF_FIRE } from './sets/s17-will-of-fire.ts';
import { S18_FANGS_OF_THE_SNAKE } from './sets/s18-fangs-of-the-snake.ts';
import { S19_PATH_OF_PAIN } from './sets/s19-path-of-pain.ts';
import { S20_TALES_OF_THE_GALLANT_SAGE } from './sets/s20-tales-of-the-gallant-sage.ts';
import { S21_SHATTERED_TRUTH } from './sets/s21-shattered-truth.ts';
import { S22_WEAPONS_OF_WAR } from './sets/s22-weapons-of-war.ts';
import { S23_INVASION } from './sets/s23-invasion.ts';
import { S24_SAGES_LEGACY } from './sets/s24-sages-legacy.ts';
import { S25_KAGE_SUMMIT } from './sets/s25-kage-summit.ts';
import { S26_AVENGERS_WRATH } from './sets/s26-avengers-wrath.ts';
import { S27_HEROS_ASCENSION } from './sets/s27-heros-ascension.ts';
import { S28_ULTIMATE_NINJA_STORM_3 } from './sets/s28-ultimate-ninja-storm-3.ts';
import { S29_SHINOBIS_DREAM } from './sets/s29-shinobis-dream.ts';
import { TP1_TOURNAMENT_PACK_1 } from './sets/tp1-tournament-pack-1.ts';
import { TP2_TOURNAMENT_PACK_2 } from './sets/tp2-tournament-pack-2.ts';
import { TP3_TOURNAMENT_PACK_3 } from './sets/tp3-tournament-pack-3.ts';
import { TP4_TOURNAMENT_PACK_4 } from './sets/tp4-tournament-pack-4.ts';
import { PR_PROMOS } from './sets/pr-promos.ts';

/**
 * Catálogo de cartas disponíveis, montado coleção por coleção (um arquivo por set em `./sets`).
 * Imagens em /cards/<set>/<id>.png (já sem marca d'água); versões otimizadas em /public/cards/<set> (`npm run cards:images`).
 */
export const CARDS: Card[] = [...S01_THE_PATH_TO_HOKAGE, ...S02_COILS_OF_THE_SNAKE, ...S03_CURSE_OF_THE_SAND, ...S04_REVENGE_AND_REBIRTH, ...S05_THE_DREAM_LEGACY, ...S06_ETERNAL_RIVALRY, ...S07_QUEST_FOR_POWER, ...S08_BATTLE_OF_DESTINY, ...S09_THE_CHOSEN, ...S10_LINEAGE_OF_THE_LEGENDS, ...S11_APPROACHING_WIND, ...S12_A_NEW_CHRONICLE, ...S13_FATEFUL_REUNION, ...S14_EMERGING_ALLIANCE, ...S15_FORETOLD_PROPHECY, ...S16_BROKEN_PROMISE, ...S17_WILL_OF_FIRE, ...S18_FANGS_OF_THE_SNAKE, ...S19_PATH_OF_PAIN, ...S20_TALES_OF_THE_GALLANT_SAGE, ...S21_SHATTERED_TRUTH, ...S22_WEAPONS_OF_WAR, ...S23_INVASION, ...S24_SAGES_LEGACY, ...S25_KAGE_SUMMIT, ...S26_AVENGERS_WRATH, ...S27_HEROS_ASCENSION, ...S28_ULTIMATE_NINJA_STORM_3, ...S29_SHINOBIS_DREAM, ...TP1_TOURNAMENT_PACK_1, ...TP2_TOURNAMENT_PACK_2, ...TP3_TOURNAMENT_PACK_3, ...TP4_TOURNAMENT_PACK_4, ...PR_PROMOS];

export const CARDS_BY_ID: ReadonlyMap<string, Card> = new Map(CARDS.map((c) => [c.id, c]));
