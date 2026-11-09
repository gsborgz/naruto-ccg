import type { CardTranslations } from '../../models/cardTranslation.ts';
import { S01_THE_PATH_TO_HOKAGE_PTBR } from './sets/s01-the-path-to-hokage.ts';

/**
 * Traduções PT-BR de todas as coleções já traduzidas, por id da carta.
 * Carregado sob demanda (import dinâmico em `CardLanguageProvider`) só quando o jogador escolhe PT-BR.
 * Coleção nova: crie `sets/<mesmo nome do arquivo em src/data/sets>.ts` e inclua aqui e em `TRANSLATED_SETS`.
 */
export const CARD_TRANSLATIONS_PTBR: CardTranslations = {
  ...S01_THE_PATH_TO_HOKAGE_PTBR,
};

/** Coleções com tradução completa (o teste confere que nenhuma carta delas ficou de fora). */
export const TRANSLATED_SETS: readonly string[] = ['S01'];
