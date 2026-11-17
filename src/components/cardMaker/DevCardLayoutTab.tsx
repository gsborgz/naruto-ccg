'use client';

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocalizedCard } from '@/lib/cardLanguage';
import { LAYOUTS, LAYOUT_LIST, TYPE_ICON_VARIANTS, elementVariants } from '@/lib/cardMaker/layouts';
import { ATTRIBUTE_FRAMES, fromCatalogCard, withLocalizedText, type CustomCard } from '@/lib/cardMaker/model';
import { NAME_WRAPS, type AttributeFrame, type CardIcons, type CardLayoutInfo, type ElementVariant, type EntranceIcon, type HandIcon, type LayoutId, type NameWrap } from '@/models/cardLayout';
import { NAME_WRAP_LABEL } from '@/lib/cardMaker/model';
import { ELEMENT_LABEL, type Card } from '@/models/card';
import { NAME_SIZE_RANGE } from '@/lib/devCardLayoutEdit';
import { ENTRANCE_ICONS, EditorCanvas, EditorFields, HAND_ICONS, IconEditButton, Pick, elementKey, smallSelect, useConfigEditor, type ConfigEditor } from './layoutEditing';

/**
 * Aba Layout do detalhe da carta, só em desenvolvimento (`npm run dev`), nas cartas escaneadas (`card.layout`).
 *
 * - **Da carta** (bloco `layout` dela no arquivo da coleção, via `/api/dev/card-layout-info`): o layout base, o
 *   design, a mancha do nome e os ícones impressos (tipo, variante de cada elemento, custos e Atributo de Combate),
 *   para as cartas que usam um layout como base mas com um ou outro ícone diferente.
 * - **Do layout base e dos ícones** (arquivos de src/lib/cardMaker/, via `/api/dev/card-config`): o editor de
 *   `/criar/layouts`, com as caixas na carta. Isso vale para todas as cartas do layout (ou do ícone).
 */

const NOW = '2026-01-01T00:00:00.000Z';

/** Mudanças no `layout` da carta; `null` = tirar o campo (volta ao padrão do layout). */
interface CardEdits {
  layout?: LayoutId;
  /** Ajuste da fonte do nome (px da carta, sobre o tamanho do layout) e o do nome traduzido. */
  nameSize?: number;
  nameSizePtBr?: number;
  /** Quebra de linha do nome e a do nome traduzido; `auto` tira o campo. */
  nameWrap?: NameWrap;
  nameWrapPtBr?: NameWrap;
  panelVariant?: string | null;
  nameBanner?: boolean | null;
  icons?: Partial<CardIcons>;
}

function applyEdits(info: CardLayoutInfo, edits: CardEdits): CardLayoutInfo {
  const next: CardLayoutInfo = { ...info, icons: { ...info.icons, ...edits.icons } };
  if (edits.layout) next.layout = edits.layout;
  if (edits.nameSize !== undefined) next.nameSize = edits.nameSize;
  if (edits.nameSizePtBr !== undefined) next.nameSizePtBr = edits.nameSizePtBr;
  if (edits.nameWrap) next.nameWrap = edits.nameWrap === 'auto' ? undefined : edits.nameWrap;
  if (edits.nameWrapPtBr) next.nameWrapPtBr = edits.nameWrapPtBr === 'auto' ? undefined : edits.nameWrapPtBr;
  if (edits.panelVariant !== undefined) next.panelVariant = edits.panelVariant ?? undefined;
  if (edits.nameBanner !== undefined) next.nameBanner = edits.nameBanner ?? undefined;
  return next;
}

/** As mudanças no formato da rota (caminho no bloco `layout` da carta). */
function editsToChanges(edits: CardEdits) {
  const out: { path: string[]; value: string | number | boolean | string[] | null }[] = [];
  if (edits.layout) out.push({ path: ['layout'], value: edits.layout });
  if (edits.nameSize !== undefined) out.push({ path: ['nameSize'], value: edits.nameSize });
  if (edits.nameSizePtBr !== undefined) out.push({ path: ['nameSizePtBr'], value: edits.nameSizePtBr });
  if (edits.nameWrap) out.push({ path: ['nameWrap'], value: edits.nameWrap === 'auto' ? null : edits.nameWrap });
  if (edits.nameWrapPtBr) out.push({ path: ['nameWrapPtBr'], value: edits.nameWrapPtBr === 'auto' ? null : edits.nameWrapPtBr });
  if (edits.panelVariant !== undefined) out.push({ path: ['panelVariant'], value: edits.panelVariant || null });
  if (edits.nameBanner !== undefined) out.push({ path: ['nameBanner'], value: edits.nameBanner });
  for (const [k, v] of Object.entries(edits.icons ?? {})) if (v !== undefined) out.push({ path: ['icons', k], value: v as string | string[] });
  return out;
}

/** Estado da aba: as mudanças da carta, o editor do layout e a carta montada com tudo aplicado. */
export function useDevCardLayout(card: Card) {
  const localized = useLocalizedCard(card);
  const [edits, setEdits] = useState<CardEdits>({});
  // Gravado nesta sessão: o arquivo muda, mas a carta aberta continua sendo o objeto antigo até reabrir.
  const [saved, setSaved] = useState<CardEdits>({});
  const editor = useConfigEditor();
  const info = card.layout ? applyEdits(card.layout, edits) : undefined;
  const custom = useMemo<CustomCard | null>(() => {
    if (!info) return null;
    const withInfo: Card = { ...card, layout: info };
    return withLocalizedText(fromCatalogCard(withInfo, NOW), localized, withInfo);
    // `info` muda a cada render (objeto novo): depende das mudanças.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, localized, JSON.stringify(edits)]);

  const set = (e: CardEdits) => setEdits((prev) => ({ ...prev, ...e, icons: { ...prev.icons, ...e.icons } }));
  const cardDirty = JSON.stringify(edits) !== JSON.stringify(saved);
  // Nome traduzido na tela: o ajuste que vale é o `nameSizePtBr` (como em `withLocalizedText`).
  const translatedName = localized.name !== card.name;
  return { card, info, custom, edits, set, editor, cardDirty, saved, setSaved, reset: () => setEdits(saved), translatedName };
}

export type DevCardLayout = ReturnType<typeof useDevCardLayout>;

/** Coluna da esquerda: a carta montada com as caixas e a original por cima. */
export function DevCardLayoutCanvas({ state }: { state: DevCardLayout }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [refOpacity, setRefOpacity] = useState(0);
  const [showBoxes, setShowBoxes] = useState(true);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div ref={ref} className="w-full">
        {width > 0 && state.custom && (
          <EditorCanvas editor={state.editor} card={state.custom} width={width} referenceOpacity={refOpacity} showBoxes={showBoxes} />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <label className="flex items-center gap-2">
          Original por cima
          <input type="range" min={0} max={1} step={0.05} value={refOpacity} onChange={(e) => setRefOpacity(Number(e.target.value))} className="w-24" />
          {Math.round(refOpacity * 100)}%
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={showBoxes} onChange={(e) => setShowBoxes(e.target.checked)} /> Caixas
        </label>
      </div>
      <p className="text-xs text-muted">Arraste as caixas (canto: tamanho; Shift: um eixo só). Setas movem a selecionada (Shift = 10, Alt = 0,1).</p>
    </div>
  );
}

/** Coluna da direita: o layout e os ícones da carta, salvar, e os campos do layout base e do ícone aberto. */
export function DevCardLayoutPanel({ state }: { state: DevCardLayout }) {
  const { card, info, custom, editor } = state;
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  if (!info || !custom) return null;
  const dirty = state.cardDirty || editor.dirtyCount > 0;

  const save = async () => {
    setSaving(true);
    setStatus(null);
    const done: string[] = [];
    try {
      const changes = editsToChanges(state.edits);
      if (state.cardDirty && changes.length) {
        const res = await fetch('/api/dev/card-layout-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: card.id, changes }),
        });
        const body = (await res.json().catch(() => ({}))) as { file?: string; message?: string };
        if (!res.ok) throw new Error(body.message ?? `Erro ${res.status}`);
        state.setSaved(state.edits);
        if (body.file) done.push(`sets/${body.file}`);
      }
      done.push(...(await editor.save()));
      setStatus({ ok: true, text: done.length ? `Gravado: ${done.join(', ')}` : 'Nada mudou nos arquivos.' });
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : String(err) });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    // O layout base é mudado nos objetos carregados: só recarregando volta ao que está nos arquivos.
    if (editor.dirtyCount > 0) {
      if (confirm('Descartar as alterações do layout base e dos ícones? A página será recarregada.')) window.location.reload();
      return;
    }
    state.reset();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">
          {dirty ? 'Alterações não salvas' : 'Sem alterações'} <span className="text-accent">(dev)</span>
        </span>
        <span className="ml-auto flex gap-2">
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={discard}
            className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-danger disabled:opacity-50"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={save}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </span>
      </div>
      {status && <p className={`text-xs ${status.ok ? 'text-ok' : 'text-danger'}`}>{status.text}</p>}
      <CardSettings state={state} info={info} editor={editor} />
      <EditorFields editor={editor} card={custom} />
    </div>
  );
}

/**
 * A aba inteira, nas duas colunas do detalhe da carta: a carta com as caixas à esquerda; à direita o `header` do
 * detalhe (nome e abas) e os campos. Carregada sob demanda pelo detalhe, só em desenvolvimento.
 */
export default function DevCardLayoutTab({ card, header }: { card: Card; header: ReactNode }) {
  const state = useDevCardLayout(card);
  return (
    <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:p-6">
      <div className="mx-auto w-full max-w-xs self-start sm:max-w-none">
        <DevCardLayoutCanvas state={state} />
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {header}
        <DevCardLayoutPanel state={state} />
      </div>
    </div>
  );
}

/** O que é da carta: layout base, design, mancha do nome e ícones; o ✎ abre o arquivo de cada ícone. */
function CardSettings({ state, info, editor }: { state: DevCardLayout; info: CardLayoutInfo; editor: ConfigEditor }) {
  const { card, set } = state;
  const spec = LAYOUTS[info.layout];
  const variants = TYPE_ICON_VARIANTS[card.type] ?? [];
  const typeVariant = info.icons.type !== 'default' && variants.some((v) => v.id === info.icons.type) ? info.icons.type : undefined;
  const changed = (key: string) => JSON.stringify((state.edits as Record<string, unknown>)[key]) !== JSON.stringify((state.saved as Record<string, unknown>)[key]);
  const iconChanged = (key: keyof CardIcons) => JSON.stringify(state.edits.icons?.[key]) !== JSON.stringify(state.saved.icons?.[key]);
  const ring = (on: boolean) => `${smallSelect} ${on ? '!ring-accent' : ''}`;

  return (
    <details open className="rounded-lg bg-surface px-3 py-2 ring-1 ring-border">
      <summary className="cursor-pointer text-sm font-semibold">
        Layout e ícones desta carta <span className="font-normal text-muted">({card.id}, arquivo da coleção)</span>
      </summary>
      <div className="mt-2 flex flex-col gap-1.5">
        <NameSizeField state={state} field="nameSize" label="Tamanho do nome" value={info.nameSize ?? 0} active={!state.translatedName} />
        {(state.translatedName || info.nameSizePtBr !== undefined) && (
          <NameSizeField state={state} field="nameSizePtBr" label="Tamanho do nome (PT-BR)" value={info.nameSizePtBr ?? 0} active={state.translatedName} />
        )}
        <NameWrapField state={state} field="nameWrap" label="Quebra de linha do nome" value={info.nameWrap} active={!state.translatedName} />
        {(state.translatedName || info.nameWrapPtBr !== undefined) && (
          <NameWrapField state={state} field="nameWrapPtBr" label="Quebra de linha do nome (PT-BR)" value={info.nameWrapPtBr} active={state.translatedName} />
        )}
        <Pick label="Layout base">
          <select value={info.layout} onChange={(e) => set({ layout: e.target.value as LayoutId })} className={ring(changed('layout'))}>
            {LAYOUT_LIST.filter((l) => l.types.includes(card.type)).map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </Pick>
        {spec.panelVariants && (
          <Pick label="Design">
            <select value={info.panelVariant ?? ''} onChange={(e) => set({ panelVariant: e.target.value || null })} className={ring(changed('panelVariant'))}>
              <option value="">{spec.panelLabel ?? 'Padrão'}</option>
              {spec.panelVariants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </Pick>
        )}
        {spec.nameBanner && (
          <Pick label="Mancha atrás do nome">
            <select
              value={info.nameBanner === undefined ? '' : String(info.nameBanner)}
              onChange={(e) => set({ nameBanner: e.target.value === '' ? null : e.target.value === 'true' })}
              className={ring(changed('nameBanner'))}
            >
              <option value="">Padrão do layout ({spec.nameBanner.default ? 'com' : 'sem'})</option>
              <option value="true">Com</option>
              <option value="false">Sem</option>
            </select>
          </Pick>
        )}
        <Pick label="Ícone do tipo">
          {variants.length > 0 && (
            <select value={typeVariant ?? 'default'} onChange={(e) => set({ icons: { type: e.target.value } })} className={ring(iconChanged('type'))}>
              <option value="default">Padrão</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          )}
          <IconEditButton
            editor={editor}
            host="typeIcon"
            icon={typeVariant ? { group: 'type-variant', id: `${card.type}-${typeVariant}` } : { group: 'type', id: card.type }}
          />
        </Pick>
        {card.elements.slice(0, 3).map((element, i) => {
          const variant = info.icons.elements[i] ?? spec.elements.variant;
          return (
            <Pick key={i} label={`Elemento ${i + 1}: ${ELEMENT_LABEL[element]}`}>
              <select
                value={variant}
                onChange={(e) => {
                  const list = card.elements.slice(0, 3).map((_, j) => info.icons.elements[j] ?? spec.elements.variant);
                  list[i] = e.target.value as ElementVariant;
                  set({ icons: { elements: list } });
                }}
                className={ring(iconChanged('elements'))}
              >
                {elementVariants(element).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <IconEditButton editor={editor} icon={{ group: 'element', id: elementKey({ element, variant }) }} host={i === 0 ? 'elements' : `elements-${i}`} />
            </Pick>
          );
        })}
        {card.type !== 'jutsu' && (
          <>
            <Pick label="Custo de entrada">
              <select
                value={info.icons.entrance ?? spec.defaults.entranceIcon}
                onChange={(e) => set({ icons: { entrance: e.target.value as EntranceIcon } })}
                className={ring(iconChanged('entrance'))}
              >
                {ENTRANCE_ICONS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <IconEditButton editor={editor} icon={{ group: 'cost', id: info.icons.entrance ?? spec.defaults.entranceIcon }} host="cost-entrance" />
            </Pick>
            <Pick label="Custo de mão">
              <select
                value={info.icons.hand ?? spec.defaults.handIcon}
                onChange={(e) => set({ icons: { hand: e.target.value as HandIcon } })}
                className={ring(iconChanged('hand'))}
              >
                {HAND_ICONS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <IconEditButton editor={editor} icon={{ group: 'cost', id: info.icons.hand ?? spec.defaults.handIcon }} host="cost-hand" />
            </Pick>
          </>
        )}
        {card.type === 'jutsu' && spec.jutsuCost && (
          <Pick label="Chakra genérico (custo do Jutsu)">
            <IconEditButton editor={editor} icon={{ group: 'chakra', id: 'chakra-any' }} host="jutsuCost" />
          </Pick>
        )}
        {card.type === 'ninja' && (
          <Pick label="Atributo de Combate">
            <select
              value={info.icons.attribute ?? spec.attribute.defaultFrame}
              onChange={(e) => set({ icons: { attribute: e.target.value as AttributeFrame } })}
              className={ring(iconChanged('attribute'))}
            >
              {ATTRIBUTE_FRAMES.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <IconEditButton editor={editor} icon={{ group: 'attribute', id: info.icons.attribute ?? spec.attribute.defaultFrame }} host="attribute" />
          </Pick>
        )}
      </div>
    </details>
  );
}

/**
 * Ajuste da fonte do nome desta carta, em px da carta sobre o tamanho do layout (negativo diminui). `active`: é o
 * que vale na carta da tela (com o nome traduzido, o `nameSizePtBr`; senão o `nameSize`).
 */
function NameSizeField({
  state,
  field,
  label,
  value,
  active,
}: {
  state: DevCardLayout;
  field: 'nameSize' | 'nameSizePtBr';
  label: string;
  value: number;
  active: boolean;
}) {
  const changed = state.edits[field] !== undefined && state.edits[field] !== (state.saved[field] ?? state.card.layout?.[field] ?? 0);
  const setValue = (v: number) => {
    if (Number.isFinite(v)) state.set({ [field]: Math.round(Math.max(-NAME_SIZE_RANGE, Math.min(NAME_SIZE_RANGE, v)) * 10) / 10 });
  };
  return (
    <Pick label={`${label}${active ? '' : ' (não está na tela)'}`}>
      <input
        type="range"
        min={-NAME_SIZE_RANGE}
        max={NAME_SIZE_RANGE}
        step={0.5}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-28 accent-[var(--color-accent)]"
        aria-label={label}
      />
      <input
        type="number"
        step={0.5}
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
        className={`w-16 rounded bg-surface-2 px-1.5 py-0.5 text-right text-xs tabular-nums ring-1 ${changed ? 'ring-accent' : 'ring-border'}`}
      />
      <span className="text-xs text-muted">px</span>
    </Pick>
  );
}

/** Quebra de linha do nome desta carta (`NameWrap`); `active` como em `NameSizeField`. */
function NameWrapField({
  state,
  field,
  label,
  value,
  active,
}: {
  state: DevCardLayout;
  field: 'nameWrap' | 'nameWrapPtBr';
  label: string;
  value: NameWrap | undefined;
  active: boolean;
}) {
  const changed = state.edits[field] !== undefined && (state.edits[field] ?? 'auto') !== (state.saved[field] ?? state.card.layout?.[field] ?? 'auto');
  return (
    <Pick label={`${label}${active ? '' : ' (não está na tela)'}`}>
      <select
        value={value ?? 'auto'}
        onChange={(e) => state.set({ [field]: e.target.value as NameWrap })}
        className={`${smallSelect} ${changed ? '!ring-accent' : ''}`}
      >
        {NAME_WRAPS.map((w) => (
          <option key={w} value={w}>
            {NAME_WRAP_LABEL[w]}
          </option>
        ))}
      </select>
    </Pick>
  );
}
