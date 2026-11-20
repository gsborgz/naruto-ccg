import { SET_NAMES_PTBR } from '../data/ptbr/glossary.ts';
import { SET_NAMES, isSetCode } from '../data/sets.ts';
import { CUSTOM_SET, CUSTOM_SET_NAME } from './cardMaker/customIds.ts';

/** Nome da coleção para exibir (em PT-BR; o nome impresso, em inglês, se não houver tradução). */
export function setName(set: string): string | undefined {
  if (set === CUSTOM_SET) return CUSTOM_SET_NAME;
  return SET_NAMES_PTBR[set] ?? (isSetCode(set) ? SET_NAMES[set] : undefined);
}
