import type { CardTranslations } from '../../models/cardTranslation.ts';
import { PR_PROMOS_PTBR } from './sets/pr-promos.ts';
import { S01_THE_PATH_TO_HOKAGE_PTBR } from './sets/s01-the-path-to-hokage.ts';
import { S02_COILS_OF_THE_SNAKE_PTBR } from './sets/s02-coils-of-the-snake.ts';
import { S03_CURSE_OF_THE_SAND_PTBR } from './sets/s03-curse-of-the-sand.ts';
import { S04_REVENGE_AND_REBIRTH_PTBR } from './sets/s04-revenge-and-rebirth.ts';
import { S05_THE_DREAM_LEGACY_PTBR } from './sets/s05-the-dream-legacy.ts';
import { S06_ETERNAL_RIVALRY_PTBR } from './sets/s06-eternal-rivalry.ts';
import { S07_QUEST_FOR_POWER_PTBR } from './sets/s07-quest-for-power.ts';
import { S08_BATTLE_OF_DESTINY_PTBR } from './sets/s08-battle-of-destiny.ts';
import { S09_THE_CHOSEN_PTBR } from './sets/s09-the-chosen.ts';
import { S10_LINEAGE_OF_THE_LEGENDS_PTBR } from './sets/s10-lineage-of-the-legends.ts';
import { S11_APPROACHING_WIND_PTBR } from './sets/s11-approaching-wind.ts';
import { S12_A_NEW_CHRONICLE_PTBR } from './sets/s12-a-new-chronicle.ts';
import { S13_FATEFUL_REUNION_PTBR } from './sets/s13-fateful-reunion.ts';
import { S14_EMERGING_ALLIANCE_PTBR } from './sets/s14-emerging-alliance.ts';
import { S15_FORETOLD_PROPHECY_PTBR } from './sets/s15-foretold-prophecy.ts';
import { S16_BROKEN_PROMISE_PTBR } from './sets/s16-broken-promise.ts';
import { S17_WILL_OF_FIRE_PTBR } from './sets/s17-will-of-fire.ts';
import { S18_FANGS_OF_THE_SNAKE_PTBR } from './sets/s18-fangs-of-the-snake.ts';
import { S19_PATH_OF_PAIN_PTBR } from './sets/s19-path-of-pain.ts';
import { S20_TALES_OF_THE_GALLANT_SAGE_PTBR } from './sets/s20-tales-of-the-gallant-sage.ts';
import { S21_SHATTERED_TRUTH_PTBR } from './sets/s21-shattered-truth.ts';
import { S22_WEAPONS_OF_WAR_PTBR } from './sets/s22-weapons-of-war.ts';
import { S23_INVASION_PTBR } from './sets/s23-invasion.ts';
import { S24_SAGES_LEGACY_PTBR } from './sets/s24-sages-legacy.ts';
import { S25_KAGE_SUMMIT_PTBR } from './sets/s25-kage-summit.ts';
import { S26_AVENGERS_WRATH_PTBR } from './sets/s26-avengers-wrath.ts';
import { S27_HEROS_ASCENSION_PTBR } from './sets/s27-heros-ascension.ts';
import { S28_ULTIMATE_NINJA_STORM_3_PTBR } from './sets/s28-ultimate-ninja-storm-3.ts';
import { S29_SHINOBIS_DREAM_PTBR } from './sets/s29-shinobis-dream.ts';
import { TP1_TOURNAMENT_PACK_1_PTBR } from './sets/tp1-tournament-pack-1.ts';
import { TP2_TOURNAMENT_PACK_2_PTBR } from './sets/tp2-tournament-pack-2.ts';
import { TP3_TOURNAMENT_PACK_3_PTBR } from './sets/tp3-tournament-pack-3.ts';
import { TP4_TOURNAMENT_PACK_4_PTBR } from './sets/tp4-tournament-pack-4.ts';

/**
 * Traduções PT-BR de todas as coleções já traduzidas, por id da carta.
 * Carregado sob demanda (import dinâmico em `CardLanguageProvider`) só quando o jogador escolhe PT-BR.
 * Coleção nova: crie `sets/<mesmo nome do arquivo em src/data/sets>.ts` e inclua aqui e em `TRANSLATED_SETS`.
 */
export const CARD_TRANSLATIONS_PTBR: CardTranslations = {
  ...PR_PROMOS_PTBR,
  ...S01_THE_PATH_TO_HOKAGE_PTBR,
  ...S02_COILS_OF_THE_SNAKE_PTBR,
  ...S03_CURSE_OF_THE_SAND_PTBR,
  ...S04_REVENGE_AND_REBIRTH_PTBR,
  ...S05_THE_DREAM_LEGACY_PTBR,
  ...S06_ETERNAL_RIVALRY_PTBR,
  ...S07_QUEST_FOR_POWER_PTBR,
  ...S08_BATTLE_OF_DESTINY_PTBR,
  ...S09_THE_CHOSEN_PTBR,
  ...S10_LINEAGE_OF_THE_LEGENDS_PTBR,
  ...S11_APPROACHING_WIND_PTBR,
  ...S12_A_NEW_CHRONICLE_PTBR,
  ...S13_FATEFUL_REUNION_PTBR,
  ...S14_EMERGING_ALLIANCE_PTBR,
  ...S15_FORETOLD_PROPHECY_PTBR,
  ...S16_BROKEN_PROMISE_PTBR,
  ...S17_WILL_OF_FIRE_PTBR,
  ...S18_FANGS_OF_THE_SNAKE_PTBR,
  ...S19_PATH_OF_PAIN_PTBR,
  ...S20_TALES_OF_THE_GALLANT_SAGE_PTBR,
  ...S21_SHATTERED_TRUTH_PTBR,
  ...S22_WEAPONS_OF_WAR_PTBR,
  ...S23_INVASION_PTBR,
  ...S24_SAGES_LEGACY_PTBR,
  ...S25_KAGE_SUMMIT_PTBR,
  ...S26_AVENGERS_WRATH_PTBR,
  ...S27_HEROS_ASCENSION_PTBR,
  ...S28_ULTIMATE_NINJA_STORM_3_PTBR,
  ...S29_SHINOBIS_DREAM_PTBR,
  ...TP1_TOURNAMENT_PACK_1_PTBR,
  ...TP2_TOURNAMENT_PACK_2_PTBR,
  ...TP3_TOURNAMENT_PACK_3_PTBR,
  ...TP4_TOURNAMENT_PACK_4_PTBR,
};

/** Coleções com tradução completa (o teste confere que nenhuma carta delas ficou de fora). */
export const TRANSLATED_SETS: readonly string[] = ['PR', 'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19', 'S20', 'S21', 'S22', 'S23', 'S24', 'S25', 'S26', 'S27', 'S28', 'S29', 'TP1', 'TP2', 'TP3', 'TP4'];
