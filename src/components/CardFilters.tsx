'use client';

import { useEffect, useRef, useState } from 'react';
import { CARD_TYPE_LABEL, ELEMENT_LABEL, type CardType, type ElementSymbol } from '@/models/card';
import { INITIAL_FILTERS, type CardFilterState, type SortKey } from '@/lib/cardFilters';
import { SET_NAMES } from '@/data/sets';
import { useSetName } from '@/lib/cardLanguage';
import { CardDesignToggle } from './CardDesignToggle';
import { ElementBadge } from './ElementBadge';

const TYPES: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];
const ELEMENTS: ElementSymbol[] = ['lightning', 'fire', 'wind', 'water', 'earth', 'void'];
const SETS = Object.keys(SET_NAMES);
const SORTS: { value: SortKey; label: string }[] = [
  { value: 'type', label: 'Tipo' },
  { value: 'cost', label: 'Custo' },
  { value: 'name', label: 'Nome' },
];

const select = 'rounded-lg border border-border bg-surface px-2 py-2 text-sm text-text';

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const chip = (active: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
    active ? 'border-accent bg-accent/15 text-text' : 'border-border text-muted hover:text-text'
  }`;

interface Props {
  value: CardFilterState;
  onChange: (v: CardFilterState) => void;
  resultCount: number;
  /** Coleções além das oficiais, no topo da lista (ex.: as cartas criadas, no montador). */
  extraSets?: string[];
}

function SearchInput({ value, onChange, className = '' }: Pick<Props, 'value' | 'onChange'> & { className?: string }) {
  return (
    <input
      type="search"
      value={value.query}
      onChange={(e) => onChange({ ...value, query: e.target.value })}
      placeholder="Buscar por nome, característica ou efeito…"
      enterKeyHint="search"
      className={`min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted ${className}`}
    />
  );
}

function SetSelect({ value, onChange, extraSets = [], className = '' }: Omit<Props, 'resultCount'> & { className?: string }) {
  const setName = useSetName();
  return (
    <select
      value={value.set}
      onChange={(e) => onChange({ ...value, set: e.target.value })}
      aria-label="Coleção"
      className={`${select} max-w-full ${value.set ? 'border-accent' : ''} ${className}`}
    >
      <option value="">Todas as coleções</option>
      {[...extraSets, ...SETS].map((code) => (
        <option key={code} value={code}>
          {setName(code)}
        </option>
      ))}
    </select>
  );
}

function TypeChips({ value, onChange, className = '' }: Pick<Props, 'value' | 'onChange'> & { className?: string }) {
  return TYPES.map((t) => (
    <button
      key={t}
      type="button"
      aria-pressed={value.types.includes(t)}
      className={`${chip(value.types.includes(t))} ${className}`}
      onClick={() => onChange({ ...value, types: toggle(value.types, t) })}
    >
      {CARD_TYPE_LABEL[t]}
    </button>
  ));
}

function ElementChips({ value, onChange, className = '' }: Pick<Props, 'value' | 'onChange'> & { className?: string }) {
  return ELEMENTS.map((e) => (
    <button
      key={e}
      type="button"
      aria-pressed={value.elements.includes(e)}
      className={`${chip(value.elements.includes(e))} ${className}`}
      onClick={() => onChange({ ...value, elements: toggle(value.elements, e) })}
    >
      <ElementBadge element={e} />
      {ELEMENT_LABEL[e]}
    </button>
  ));
}

/** Quantos filtros (fora a busca e a ordenação) estão ativos: o número no botão "Filtros". */
function activeFilterCount(f: CardFilterState) {
  return (f.set ? 1 : 0) + f.types.length + f.elements.length;
}

/** Desktop: tudo à vista, em duas linhas. */
function DesktopFilters({ value, onChange, resultCount, extraSets }: Props) {
  return (
    <div className="hidden flex-col gap-3 md:flex">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={value} onChange={onChange} className="flex-1 basis-64" />
        <SetSelect value={value} onChange={onChange} extraSets={extraSets} />
        <label className="flex items-center gap-2 text-sm text-muted">
          Ordenar
          <select
            value={value.sort}
            onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
            className={select}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <TypeChips value={value} onChange={onChange} />
        <span className="mx-1 h-5 w-px bg-border" />
        <ElementChips value={value} onChange={onChange} />
        <span className="ml-auto flex items-center gap-3 text-sm text-muted">
          <CardDesignToggle />
          {resultCount} cartas
        </span>
      </div>
    </div>
  );
}

/** Um filtro ativo na barra do celular: toque para remover. */
function ActiveChip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent bg-accent/15 py-1 pr-2 pl-2.5 text-xs whitespace-nowrap"
    >
      {children}
      <span aria-hidden className="text-muted">
        ✕
      </span>
      <span className="sr-only">(remover filtro)</span>
    </button>
  );
}

/** Celular: busca e botão "Filtros" numa linha; os filtros ativos logo abaixo; o resto num painel que sobe de baixo. */
function MobileFilters({ value, onChange, resultCount, extraSets }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const setName = useSetName();
  const active = activeFilterCount(value);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const sortLabel = SORTS.find((s) => s.value === value.sort)?.label;

  return (
    <div className="flex flex-col gap-2 md:hidden">
      <div className="flex gap-2">
        <SearchInput value={value} onChange={onChange} className="flex-1 py-2.5 text-base" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold ${
            active ? 'border-accent text-text' : 'border-border text-muted'
          }`}
          aria-label={`Filtros${active ? ` (${active} ativos)` : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
            <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v1.2a1.5 1.5 0 0 1-.44 1.06L12 11.32V16a1 1 0 0 1-1.45.9l-2-1A1 1 0 0 1 8 15v-3.68L3.44 6.76A1.5 1.5 0 0 1 3 5.7V4.5Z" />
          </svg>
          Filtros
          {active > 0 && (
            <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-bg">
              {active}
            </span>
          )}
        </button>
      </div>

      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        <span className="shrink-0 text-xs text-muted">
          {resultCount} {resultCount === 1 ? 'carta' : 'cartas'}
          {value.sort !== 'type' && ` · por ${sortLabel?.toLowerCase()}`}
        </span>
        {value.set && (
          <ActiveChip onRemove={() => onChange({ ...value, set: '' })}>{setName(value.set)}</ActiveChip>
        )}
        {value.types.map((t) => (
          <ActiveChip key={t} onRemove={() => onChange({ ...value, types: toggle(value.types, t) })}>
            {CARD_TYPE_LABEL[t]}
          </ActiveChip>
        ))}
        {value.elements.map((e) => (
          <ActiveChip key={e} onRemove={() => onChange({ ...value, elements: toggle(value.elements, e) })}>
            <ElementBadge element={e} />
            {ELEMENT_LABEL[e]}
          </ActiveChip>
        ))}
        {active > 1 && (
          <button
            type="button"
            onClick={() => onChange({ ...value, set: '', types: [], elements: [] })}
            className="shrink-0 px-1 text-xs whitespace-nowrap text-accent"
          >
            Limpar tudo
          </button>
        )}
      </div>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        aria-label="Filtros"
        className="mx-0 mt-auto mb-0 max-h-[85dvh] w-full max-w-none rounded-t-2xl border-t border-border bg-surface p-0 text-text backdrop:bg-black/70"
      >
        {open && (
          <div className="flex max-h-[85dvh] flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-lg font-bold">Filtros</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-muted hover:bg-surface-2 hover:text-text"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto px-4 py-4">
              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Coleção</h3>
                <SetSelect value={value} onChange={onChange} extraSets={extraSets} className="w-full py-2.5 text-base" />
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Tipo</h3>
                <div className="grid grid-cols-2 gap-2">
                  <TypeChips value={value} onChange={onChange} className="justify-center py-2" />
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Elemento</h3>
                <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3">
                  <ElementChips value={value} onChange={onChange} className="justify-start py-2" />
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Ordenar por</h3>
                <div role="group" aria-label="Ordenar por" className="grid grid-cols-3 rounded-lg border border-border p-0.5">
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      aria-pressed={value.sort === s.value}
                      onClick={() => onChange({ ...value, sort: s.value })}
                      className={`rounded-md py-2 text-sm font-semibold ${
                        value.sort === s.value ? 'bg-accent text-bg' : 'text-muted'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Cartas</h3>
                <CardDesignToggle />
              </section>
            </div>

            <div className="flex gap-2 border-t border-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                disabled={active === 0 && value.sort === INITIAL_FILTERS.sort}
                onClick={() => onChange({ ...INITIAL_FILTERS, query: value.query })}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted disabled:opacity-40"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-bg"
              >
                Ver {resultCount} {resultCount === 1 ? 'carta' : 'cartas'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

export function CardFilters(props: Props) {
  return (
    <>
      <MobileFilters {...props} />
      <DesktopFilters {...props} />
    </>
  );
}
