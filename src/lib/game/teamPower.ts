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
  /** Moedas de Poder (Growth, +1/+1, -1/-1…) dos Ninjas do Time, já incluídas em `value`. */
  coins: number;
}

/** "+1/+1", "-2/-2", "+0/+2": o quanto a moeda dá em Combate e em Suporte. */
const POWER_COIN = /^([+-]\d{1,2})\/([+-]\d{1,2})$/;

/**
 * Quanto uma moeda dá em Combate e Suporte: o Marcador de Crescimento [Growth] dá +1/+1 (docs/REGRAS.md 6.5)
 * e as moedas com o valor no nome ("+1/+1", "-1/-1") dão esse valor. As outras não mexem no Poder.
 */
export function coinPower(kind: string): { combat: number; support: number } | null {
  if (kind.toLowerCase() === 'growth') return { combat: 1, support: 1 };
  const m = POWER_COIN.exec(kind);
  return m ? { combat: Number(m[1]), support: Number(m[2]) } : null;
}

/** O que as moedas da carta somam em Combate (Líder) ou Suporte (Apoio). */
function coinBonus(c: CardInstance, role: 'combat' | 'support'): number {
  let sum = 0;
  for (const [kind, count] of Object.entries(c.coins ?? {})) sum += (coinPower(kind)?.[role] ?? 0) * count;
  return sum;
}

/**
 * Poder do Time (docs/REGRAS.md 3.5.4): Combate do Ninja Líder + Suporte de cada Ninja de Apoio,
 * cada um no estado atual (Saudável ou Ferido), mais as moedas de Poder (no Combate do Líder e no Suporte
 * dos Apoios) e o ajuste manual (`power`) dos Ninjas. O primeiro do grupo é o Líder. Sem Ninjas, `null`.
 */
export function teamPower(group: readonly CardInstance[], lookup: PowerLookup): TeamPower | null {
  const parts: (number | 'X')[] = [];
  let mod = 0;
  let coins = 0;
  for (const c of group) {
    const power = lookup(c.cardId);
    if (!power) continue;
    const role = parts.length === 0 ? 'combat' : 'support';
    const state = c.injured ? power.injured : power.healthy;
    parts.push(state[role]);
    mod += c.power ?? 0;
    coins += coinBonus(c, role);
  }
  if (parts.length === 0) return null;
  return {
    value: parts.reduce<number>((sum, p) => sum + (p === 'X' ? 0 : p), 0) + mod + coins,
    hasX: parts.includes('X'),
    parts,
    mod,
    coins,
  };
}

/** Texto do Poder: "5", "5+X", "X" ou "X-2". Sem X, não fica abaixo de 0. */
export function formatTeamPower(p: TeamPower): string {
  if (!p.hasX) return String(Math.max(0, p.value));
  if (p.value === 0) return 'X';
  return p.value > 0 ? `${p.value}+X` : `X${p.value}`;
}
