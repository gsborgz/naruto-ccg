import type { Card, JutsuCostOption } from '@/models/card';
import { ElementBadge } from './ElementBadge';

/** Uma opção de custo de Jutsu: símbolos + Chakra genérico (um selo por "X" impresso). */
function CostOption({ option }: { option: JutsuCostOption }) {
  const { symbols, generic, xCount = 1 } = option;
  const genericBadges = generic === 'X' ? Array.from({ length: xCount }, () => 'X') : generic > 0 ? [generic] : [];
  return (
    <>
      {symbols.map((s, i) => (
        <ElementBadge key={i} element={s} />
      ))}
      {genericBadges.map((g, i) => (
        <span key={i} className="rounded bg-danger/80 px-1.5 font-bold text-white">
          {g}
        </span>
      ))}
    </>
  );
}

/** Resumo compacto do custo: Entrada/Mão para Ninja e Missão, Chakra para Jutsu (com as alternativas "ou"). */
export function CardCost({ card }: { card: Card }) {
  if (card.type === 'jutsu') {
    const options = [card.cost, ...(card.cost.alternatives ?? [])];
    return (
      <span className="inline-flex flex-wrap items-center gap-1 text-xs" title="Custo de Jutsu">
        {options.map((option, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            {i > 0 && <span className="text-muted">ou</span>}
            <CostOption option={option} />
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs" title="Custo de Entrada / Custo de Mão">
      <span className="rounded bg-sky-700 px-1.5 font-bold text-white">{card.entranceCost}</span>
      <span className="rounded bg-amber-700 px-1.5 font-bold text-white">{card.handCost}</span>
    </span>
  );
}
