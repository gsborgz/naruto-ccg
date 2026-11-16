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
  /** Ajuste manual (soma do `power` dos Ninjas do Time), já incluído em `value`. */
  mod: number;
}

/**
 * Poder do Time (docs/REGRAS.md 3.5.4): Combate do Ninja Líder + Suporte de cada Ninja de Apoio,
 * cada um no estado atual (Saudável ou Ferido), mais o ajuste manual (`power`) dos Ninjas. O primeiro do
 * grupo é o Líder. Sem Ninjas, `null`.
 */
export function teamPower(group: readonly CardInstance[], lookup: PowerLookup): TeamPower | null {
  const parts: (number | 'X')[] = [];
  let mod = 0;
  for (const [i, c] of group.entries()) {
    const power = lookup(c.cardId);
    if (!power) continue;
    const state = c.injured ? power.injured : power.healthy;
    parts.push(i === 0 ? state.combat : state.support);
    mod += c.power ?? 0;
  }
  if (parts.length === 0) return null;
  return {
    value: parts.reduce<number>((sum, p) => sum + (p === 'X' ? 0 : p), 0) + mod,
    hasX: parts.includes('X'),
    parts,
    mod,
  };
}

/** Texto do Poder: "5", "5+X", "X" ou "X-2". Sem X, não fica abaixo de 0. */
export function formatTeamPower(p: TeamPower): string {
  if (!p.hasX) return String(Math.max(0, p.value));
  if (p.value === 0) return 'X';
  return p.value > 0 ? `${p.value}+X` : `X${p.value}`;
}
