'use client';

import { CARD_TYPE_LABEL, ELEMENT_LABEL, type CardType, type ElementSymbol } from '@/models/card';
import type { CardFilterState, SortKey } from '@/lib/cardFilters';
import { SET_NAMES } from '@/data/sets';
import { useSetName } from '@/lib/cardLanguage';
import { ElementBadge } from './ElementBadge';

const TYPES: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];
const ELEMENTS: ElementSymbol[] = ['lightning', 'fire', 'wind', 'water', 'earth', 'void'];
const SETS = Object.keys(SET_NAMES);

const select = 'rounded-lg border border-border bg-surface px-2 py-2 text-sm text-text';

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const chip = (active: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
    active ? 'border-accent bg-accent/15 text-text' : 'border-border text-muted hover:text-text'
  }`;

export function CardFilters({
  value,
  onChange,
  resultCount,
}: {
  value: CardFilterState;
  onChange: (v: CardFilterState) => void;
  resultCount: number;
}) {
  const setName = useSetName();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Buscar por nome, característica ou efeito…"
          className="min-w-0 flex-1 basis-64 rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted"
        />
        <select
          value={value.set}
          onChange={(e) => onChange({ ...value, set: e.target.value })}
          aria-label="Coleção"
          className={`${select} max-w-full ${value.set ? 'border-accent' : ''}`}
        >
          <option value="">Todas as coleções</option>
          {SETS.map((code) => (
            <option key={code} value={code}>
              {setName(code)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-muted">
          Ordenar
          <select
            value={value.sort}
            onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
            className={select}
          >
            <option value="type">Tipo</option>
            <option value="cost">Custo</option>
            <option value="name">Nome</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={value.types.includes(t)}
            className={chip(value.types.includes(t))}
            onClick={() => onChange({ ...value, types: toggle(value.types, t) })}
          >
            {CARD_TYPE_LABEL[t]}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-border" />
        {ELEMENTS.map((e) => (
          <button
            key={e}
            type="button"
            aria-pressed={value.elements.includes(e)}
            className={chip(value.elements.includes(e))}
            onClick={() => onChange({ ...value, elements: toggle(value.elements, e) })}
          >
            <ElementBadge element={e} />
            {ELEMENT_LABEL[e]}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted">{resultCount} cartas</span>
      </div>
    </div>
  );
}
