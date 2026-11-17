'use client';

import { useEffect, useMemo, useState } from 'react';
import { CARDS, CARDS_BY_ID } from '@/data/cards';
import { LAYOUTS, LAYOUT_LIST, MAX_ELEMENTS, TYPE_ICON_VARIANTS, elementVariants, type LayoutSpec } from '@/lib/cardMaker/layouts';
import {
  ATTRIBUTE_FRAMES,
  MAX_VILLAGES,
  VILLAGES,
  cardVillages,
  fromCatalogCard,
  type AttributeFrame,
  type CardElement,
  type CustomCard,
  type EntranceIcon,
  type HandIcon,
  type LayoutId,
  type Village,
  type VillageMark,
} from '@/lib/cardMaker/model';
import { CARD_TYPE_LABEL, ELEMENT_LABEL, type CardType, type ElementSymbol } from '@/models/card';
import {
  ELEMENTS,
  ENTRANCE_ICONS,
  EditorCanvas,
  EditorFields,
  HAND_ICONS,
  IconEditButton,
  Pick,
  elementKey,
  hasStats,
  selectClass,
  smallSelect,
  useConfigEditor,
  type ConfigEditor,
} from './layoutEditing';

/**
 * Editor dos layouts e dos ícones do criador (`/criar/layouts`, só em desenvolvimento), com uma carta de exemplo
 * do catálogo e a original por cima. Os ícones da carta podem ser trocados (só na prévia) e o arquivo de cada um,
 * aberto e editado. **Salvar** grava nos arquivos; **Descartar** recarrega a página, que volta aos valores deles.
 * A edição em si fica em `layoutEditing.tsx` (a mesma da aba Layout do detalhe da carta).
 */

/** Ícones da carta de exemplo trocados no editor (só na prévia). */
interface IconOverrides {
  typeVariant?: string;
  elements?: CardElement[];
  entranceIcon?: EntranceIcon;
  handIcon?: HandIcon;
  attributeFrame?: AttributeFrame;
  panelVariant?: string;
  villages?: VillageMark[];
}

function applyOverrides(card: CustomCard, o: IconOverrides): CustomCard {
  return {
    ...card,
    ...('typeVariant' in o && { typeVariant: o.typeVariant || undefined }),
    ...(o.elements && { elements: o.elements }),
    ...(o.entranceIcon && { entranceIcon: o.entranceIcon, entranceCost: card.entranceCost || '1' }),
    ...(o.handIcon && { handIcon: o.handIcon, handCost: card.handCost || '1' }),
    ...(o.attributeFrame && { attribute: { ...card.attribute, frame: o.attributeFrame } }),
    ...('panelVariant' in o && { panelVariant: o.panelVariant || undefined }),
    ...(o.villages && { villages: o.villages, village: undefined }),
  };
}

const NOW = '2026-01-01T00:00:00.000Z';

function samplesFor(layout: LayoutId, type: CardType): { id: string; name: string }[] {
  const scanned = CARDS.filter((c) => c.type === type && c.layout?.layout === layout);
  const list = scanned.length ? scanned : CARDS.filter((c) => c.type === type).slice(0, 60);
  return list.map((c) => ({ id: c.id, name: c.name }));
}

/** Seletores para trocar os ícones da carta de exemplo (só na prévia), com o ✎ que abre o arquivo de cada um. */
function IconPicker({
  editor,
  spec,
  card,
  onChange,
  onReset,
  changed,
}: {
  editor: ConfigEditor;
  spec: LayoutSpec;
  card: CustomCard;
  onChange: (o: IconOverrides) => void;
  onReset: () => void;
  changed: boolean;
}) {
  const t = card.type;
  const variants = TYPE_ICON_VARIANTS[t] ?? [];
  const villages = cardVillages(card);
  const setElement = (slot: number, el: CardElement | null) => {
    const list = [...card.elements];
    if (el) list[slot] = el;
    else list.splice(slot, 1);
    onChange({ elements: list.filter(Boolean) });
  };
  const setVillage = (slot: number, v: VillageMark | null) => {
    const list = [...villages];
    if (v) list[slot] = v;
    else list.splice(slot, 1);
    onChange({ villages: list.filter(Boolean) });
  };

  return (
    <details open className="rounded-lg bg-surface px-3 py-2 ring-1 ring-border">
      <summary className="cursor-pointer text-sm font-semibold">
        Ícones da carta <span className="font-normal text-muted">(só na prévia)</span>
      </summary>
      <div className="mt-2 flex flex-col gap-1.5">
        <Pick label="Tipo">
          {variants.length > 0 && (
            <select value={card.typeVariant ?? ''} onChange={(e) => onChange({ typeVariant: e.target.value })} className={smallSelect}>
              <option value="">Padrão</option>
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
            icon={
              card.typeVariant && variants.some((v) => v.id === card.typeVariant)
                ? { group: 'type-variant', id: `${t}-${card.typeVariant}` }
                : { group: 'type', id: t }
            }
          />
        </Pick>
        {spec.panelVariants && (
          <Pick label="Design">
            <select value={card.panelVariant ?? ''} onChange={(e) => onChange({ panelVariant: e.target.value })} className={smallSelect}>
              <option value="">{spec.panelLabel ?? 'Padrão'}</option>
              {spec.panelVariants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </Pick>
        )}
        {Array.from({ length: Math.min(card.elements.length + 1, MAX_ELEMENTS) }, (_, slot) => {
          const el = card.elements[slot];
          return (
            <Pick key={slot} label={`Elemento ${slot + 1}`}>
              <select
                value={el?.element ?? ''}
                onChange={(e) => {
                  const element = e.target.value as ElementSymbol;
                  if (!element) return setElement(slot, null);
                  const vs = elementVariants(element);
                  const want = el?.variant ?? spec.elements.variant;
                  setElement(slot, { element, variant: vs.includes(want) ? want : vs[0] });
                }}
                className={smallSelect}
              >
                <option value="">—</option>
                {ELEMENTS.map((e) => (
                  <option key={e} value={e}>
                    {ELEMENT_LABEL[e]}
                  </option>
                ))}
              </select>
              {el && (
                <select value={el.variant} onChange={(e) => setElement(slot, { ...el, variant: e.target.value as CardElement['variant'] })} className={smallSelect}>
                  {elementVariants(el.element).map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              )}
              {el && <IconEditButton editor={editor} icon={{ group: 'element', id: elementKey(el) }} host={slot === 0 ? 'elements' : `elements-${slot}`} />}
            </Pick>
          );
        })}
        {t !== 'jutsu' && (
          <>
            <Pick label="Custo de entrada">
              <select value={card.entranceIcon} onChange={(e) => onChange({ entranceIcon: e.target.value as EntranceIcon })} className={smallSelect}>
                {ENTRANCE_ICONS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <IconEditButton editor={editor} icon={{ group: 'cost', id: card.entranceIcon }} host="cost-entrance" />
            </Pick>
            <Pick label="Custo de mão">
              <select value={card.handIcon} onChange={(e) => onChange({ handIcon: e.target.value as HandIcon })} className={smallSelect}>
                {HAND_ICONS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <IconEditButton editor={editor} icon={{ group: 'cost', id: card.handIcon }} host="cost-hand" />
            </Pick>
          </>
        )}
        {t === 'jutsu' && spec.jutsuCost && (
          <Pick label="Chakra genérico (custo do Jutsu)">
            <IconEditButton editor={editor} icon={{ group: 'chakra', id: 'chakra-any' }} host="jutsuCost" />
          </Pick>
        )}
        {t === 'ninja' && (
          <Pick label="Atributo de Combate">
            <select value={card.attribute.frame} onChange={(e) => onChange({ attributeFrame: e.target.value as AttributeFrame })} className={smallSelect}>
              {ATTRIBUTE_FRAMES.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <IconEditButton editor={editor} icon={{ group: 'attribute', id: card.attribute.frame }} host="attribute" />
          </Pick>
        )}
        {hasStats(t) &&
          Array.from({ length: Math.min(villages.length + 1, MAX_VILLAGES) }, (_, slot) => {
            const v = villages[slot];
            return (
              <Pick key={`v${slot}`} label={`Vila ${slot + 1}`}>
                <select
                  value={v?.village ?? ''}
                  onChange={(e) => setVillage(slot, e.target.value ? { village: e.target.value as Village, rogue: v?.rogue ?? false } : null)}
                  className={smallSelect}
                >
                  <option value="">—</option>
                  {VILLAGES.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                {v && (
                  <label className="flex items-center gap-1 text-xs text-muted">
                    <input type="checkbox" checked={v.rogue} onChange={(e) => setVillage(slot, { ...v, rogue: e.target.checked })} /> renegado
                  </label>
                )}
              </Pick>
            );
          })}
        {changed && (
          <button type="button" onClick={onReset} className="self-start rounded-md px-2 py-1 text-xs text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text">
            Voltar aos da carta
          </button>
        )}
      </div>
    </details>
  );
}

export function LayoutEditor() {
  const [layoutId, setLayoutId] = useState<LayoutId>('layout-01');
  const spec = LAYOUTS[layoutId];
  const [type, setType] = useState<CardType>('ninja');
  const samples = useMemo(() => samplesFor(layoutId, type), [layoutId, type]);
  const [sampleId, setSampleId] = useState('');
  const sample = CARDS_BY_ID.get(sampleId)?.type === type ? sampleId : (samples[0]?.id ?? '');
  const [overrides, setOverrides] = useState<IconOverrides>({});

  const [width, setWidth] = useState(560);
  const [refOpacity, setRefOpacity] = useState(0.5);
  const [showBoxes, setShowBoxes] = useState(true);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const editor = useConfigEditor();
  const { dirtyCount } = editor;

  useEffect(() => {
    if (!spec.types.includes(type)) setType(spec.types[0]);
  }, [spec, type]);

  useEffect(() => {
    if (!dirtyCount) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirtyCount]);

  const card = useMemo(() => {
    const source = CARDS_BY_ID.get(sample);
    return source ? applyOverrides(fromCatalogCard(source, NOW, layoutId), overrides) : null;
  }, [sample, layoutId, overrides]);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const written = await editor.save();
      setStatus({ ok: true, text: written.length ? `Gravado: ${written.join(', ')}` : 'Nada mudou nos arquivos.' });
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : String(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Editor de layouts</h1>
        <span className="text-xs text-muted">só em desenvolvimento</span>
        <span className="ml-auto flex items-center gap-2">
          {status && <span className={`text-xs ${status.ok ? 'text-ok' : 'text-danger'}`}>{status.text}</span>}
          <span className="text-xs text-muted">
            {dirtyCount} alteraç{dirtyCount === 1 ? 'ão' : 'ões'}
          </span>
          <button
            type="button"
            disabled={!dirtyCount || saving}
            onClick={() => window.location.reload()}
            className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-danger disabled:opacity-50"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={!dirtyCount || saving}
            onClick={save}
            className="rounded-lg bg-accent px-4 py-1.5 font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <select value={layoutId} onChange={(e) => setLayoutId(e.target.value as LayoutId)} className={selectClass}>
          {LAYOUT_LIST.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value as CardType)} className={selectClass}>
          {spec.types.map((t) => (
            <option key={t} value={t}>
              {CARD_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <select value={sample} onChange={(e) => setSampleId(e.target.value)} className={`${selectClass} max-w-72`}>
          {samples.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.name}
            </option>
          ))}
        </select>
        <input
          placeholder="id da carta"
          onKeyDown={(e) => {
            const found = e.key === 'Enter' && CARDS_BY_ID.get(e.currentTarget.value.trim());
            if (found) {
              setType(found.type);
              setSampleId(found.id);
            }
          }}
          className="w-36 rounded-lg bg-surface-2 px-2 py-1.5 text-sm ring-1 ring-border"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <label className="flex items-center gap-2">
          Original por cima
          <input type="range" min={0} max={1} step={0.05} value={refOpacity} onChange={(e) => setRefOpacity(Number(e.target.value))} />
          {Math.round(refOpacity * 100)}%
        </label>
        <label className="flex items-center gap-2">
          Tamanho
          <input type="range" min={300} max={900} step={10} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={showBoxes} onChange={(e) => setShowBoxes(e.target.checked)} /> Caixas
        </label>
        <span>
          Arraste as caixas (canto: tamanho; Shift: um eixo só). Setas movem a selecionada (Shift = 10, Alt = 0,1). Clique num ícone (ou no ✎)
          para editar o arquivo dele.
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        {card ? <EditorCanvas editor={editor} card={card} width={width} referenceOpacity={refOpacity} showBoxes={showBoxes} /> : <p>Escolha uma carta.</p>}
        <aside className="flex min-w-72 flex-1 flex-col gap-2">
          {card && (
            <>
              <IconPicker
                editor={editor}
                spec={spec}
                card={card}
                changed={Object.keys(overrides).length > 0}
                onChange={(o) => setOverrides((prev) => ({ ...prev, ...o }))}
                onReset={() => setOverrides({})}
              />
              <EditorFields editor={editor} card={card} />
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
