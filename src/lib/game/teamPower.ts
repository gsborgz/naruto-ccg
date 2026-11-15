import type { Power } from '../../models/card.ts';
import type { CardInstance } from './state.ts';

/** Poder impresso de um Ninja (Saudável e Ferido), ou `undefined` se a carta não for Ninja. */
export type PowerLookup = (cardId: string) => { healthy: Power; injured: Power } | undefined;

export interface TeamPower {
  /** Soma dos valores numéricos. */
  value: number;
  /** Algum dos valores somados é "X" (o valor vem do texto da carta). */
  hasX: boolean;
  /** Combate do Líder e Suporte de cada Apoio, na ordem do Time (para mostrar a conta). */
  parts: (number | 'X')[];
}

/**
 * Poder do Time (docs/REGRAS.md 3.5.4): Combate do Ninja Líder + Suporte de cada Ninja de Apoio,
 * cada um no estado atual (Saudável ou Ferido). O primeiro do grupo é o Líder. Sem Ninjas, `null`.
 */
export function teamPower(group: readonly CardInstance[], lookup: PowerLookup): TeamPower | null {
  const parts: (number | 'X')[] = [];
  for (const [i, c] of group.entries()) {
    const power = lookup(c.cardId);
    if (!power) continue;
    const state = c.injured ? power.injured : power.healthy;
    parts.push(i === 0 ? state.combat : state.support);
  }
  if (parts.length === 0) return null;
  return {
    value: parts.reduce<number>((sum, p) => sum + (p === 'X' ? 0 : p), 0),
    hasX: parts.includes('X'),
    parts,
  };
}

/** Texto do Poder: "5", "5+X" ou "X". */
export function formatTeamPower(p: TeamPower): string {
  if (!p.hasX) return String(p.value);
  return p.value === 0 ? 'X' : `${p.value}+X`;
}
