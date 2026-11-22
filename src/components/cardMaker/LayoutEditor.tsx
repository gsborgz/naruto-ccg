'use client';

import { useEffect, useMemo, useState } from 'react';
import { CARDS, CARDS_BY_ID } from '@/data/cards';
import { LAYOUTS, LAYOUT_LIST, TEXT_DIVIDER_COLOR, textDividerColor, MAX_ELEMENTS, TYPE_ICON_VARIANTS, elementVariants, frameFor, panelFor, type LayoutSpec } from '@/lib/cardMaker/layouts';
import {
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
  attributeFrames,
  entranceIcons,
  EditorCanvas,
  EditorFields,
  handIcons,
  IconEditButton,
  Pick,
  elementKey,
  hasStats,
  selectClass,
  smallSelect,
  useConfigEditor,
  type ConfigEditor,
} from './layoutEditing';
import { AssetSwapButton, ContentHistoryButton, MigrateAssetsButton, SweepAssetsButton } from './ContentTools';
import { IconsEditor } from './IconsEditor';
import { createContentLayout, deleteContentLayout, saveConfigChanges } from '@/lib/content/client';
import { useContent } from '@/lib/content/ContentProvider';
import type { ConfigTarget } from '@/lib/content/changes';
import { OpenIconContext, getAt, setAt, type IconChoice } from './layoutEditing';

/** Layouts das coleções impressas (as imagens deles estão no deploy; não podem ser excluídos). */
const PRINTED_LAYOUTS = ['layout-01', 'layout-02', 'layout-03', 'layout-04', 'layout-05'];

/** Caminhos da configuração do layout com o valor dado (ex.: a moldura usada por dois tipos). */
function pathsWithValue(node: unknown, value: string, path: string[] = []): string[][] {
  if (node === value) return [path];
  if (Array.isArray(node)) return node.flatMap((v, i) => pathsWithValue(v, value, [...path, String(i)]));
  if (node && typeof node === 'object') return Object.entries(node).flatMap(([k, v]) => pathsWithValue(v, value, [...path, k]));
  return [];
}

/** Id de layout a partir do nome ("Layout Akatsuki" → "layout-akatsuki"). */
function slugId(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^layout\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 39);
  return `layout-${slug || Date.now().toString(36)}`;
}

/**
 * Editor dos layouts e dos ícones do criador (`/criar/layouts`), com uma carta de exemplo do catálogo e a original por
 * cima. Os ícones da carta podem ser trocados (só na prévia) e a configuração de cada um, aberta e editada; as imagens
 * (moldura, painel, ícone) podem ser trocadas. **Salvar** grava no conteúdo do jogo (Redis), para todo mundo;
 * **Descartar** recarrega a página, que volta ao que está gravado. **Histórico** volta uma das últimas versões.
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

/** Seletores para trocar os ícones da carta de exemplo (só na prévia), com o ✎ que abre a configuração de cada um. */
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
                {entranceIcons().map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <IconEditButton editor={editor} icon={{ group: 'cost', id: card.entranceIcon }} host="cost-entrance" />
            </Pick>
            <Pick label="Custo de mão">
              <select value={card.handIcon} onChange={(e) => onChange({ handIcon: e.target.value as HandIcon })} className={smallSelect}>
                {handIcons().map((id) => (
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
              {attributeFrames().map((id) => (
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

/**
 * O que é do layout: nome, ícones que ele usa por padrão e as imagens (moldura e painel) do tipo da carta de exemplo.
 * Num layout criado no editor, trocar uma imagem que ainda é a do layout base grava a nova na pasta dele.
 */
function LayoutProperties({ editor, spec, type, panelVariant }: { editor: ConfigEditor; spec: LayoutSpec; type: CardType; panelVariant?: string }) {
  const content = useContent();
  const target: ConfigTarget = { kind: 'layout', id: spec.id };
  const root = spec as unknown as Record<string, unknown>;
  const printed = PRINTED_LAYOUTS.includes(spec.id);
  const set = (path: string[], value: string) => editor.setValue(target, root, path, value);
  const dirty = (path: string[]) => `layout:${spec.id}|${path.join('.')}` in editor.changes;
  const ring = (path: string[]) => `${smallSelect} ${dirty(path) ? '!ring-accent' : ''}`;
  // Cor da linha acima do texto: uma por tipo de carta (`textDividerColor.<tipo>`), só no tipo da prévia.
  const dividerColor = textDividerColor(spec, type);
  const setDividerColor = (value: string) => {
    // Sem cores ainda (ou um valor antigo, de antes de ser por tipo): começa o objeto, só com o tipo editado.
    if (!spec.textDividerColor || typeof spec.textDividerColor !== 'object') spec.textDividerColor = {};
    set(['textDividerColor', type], value);
  };

  /** A imagem nova foi para a pasta do layout: a configuração passa a usá-la (grava na hora). */
  const relocate = (oldUrl: string | undefined) => async (url: string) => {
    if (!oldUrl) return;
    const changes = pathsWithValue(spec, oldUrl).map((path) => ({ target, path, value: url }));
    for (const c of changes) setAt(spec, c.path, url);
    if (changes.length) content.saved((await saveConfigChanges(changes)).version);
  };
  const image = (label: string, url: string | undefined) => {
    const file = url?.split('/').pop();
    return (
      <AssetSwapButton
        key={label}
        label={label}
        url={url}
        deployFallback={printed}
        ownPath={printed || !file ? undefined : `${spec.id}/${file}`}
        onRelocated={relocate(url)}
      />
    );
  };

  return (
    <details open className="rounded-lg bg-surface px-3 py-2 ring-1 ring-border">
      <summary className="cursor-pointer text-sm font-semibold">
        Layout <span className="font-normal text-muted">({spec.id})</span>
      </summary>
      <div className="mt-2 flex flex-col gap-1.5">
        <Pick label="Nome">
          <input
            value={spec.label}
            onChange={(e) => set(['label'], e.target.value)}
            className={`w-48 rounded bg-surface-2 px-1.5 py-1 text-xs ring-1 ${dirty(['label']) ? 'ring-accent' : 'ring-border'}`}
          />
        </Pick>
        <Pick label={`Cor da linha acima do texto (${CARD_TYPE_LABEL[type]})`}>
          <span className="flex items-center gap-1">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(dividerColor ?? '') ? dividerColor : TEXT_DIVIDER_COLOR}
              onChange={(e) => setDividerColor(e.target.value)}
              className="h-6 w-7 cursor-pointer bg-transparent"
            />
            <input
              value={dividerColor ?? ''}
              placeholder={`${TEXT_DIVIDER_COLOR} (padrão)`}
              onChange={(e) => setDividerColor(e.target.value)}
              className={`w-36 rounded bg-surface-2 px-1.5 py-1 text-xs ring-1 ${dirty(['textDividerColor', type]) ? 'ring-accent' : 'ring-border'}`}
            />
          </span>
        </Pick>
        <p className="text-xs text-muted">Tipos de carta: {spec.types.map((t) => CARD_TYPE_LABEL[t]).join(', ')}.</p>
        <p className="text-xs font-semibold text-muted">Ícones que o layout usa por padrão</p>
        <Pick label="Variante dos elementos">
          <select value={spec.elements.variant} onChange={(e) => set(['elements', 'variant'], e.target.value)} className={ring(['elements', 'variant'])}>
            {['01', '02', '03'].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Pick>
        <Pick label="Custo de entrada">
          <select value={spec.defaults.entranceIcon} onChange={(e) => set(['defaults', 'entranceIcon'], e.target.value)} className={ring(['defaults', 'entranceIcon'])}>
            {entranceIcons().map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Pick>
        <Pick label="Custo de mão">
          <select value={spec.defaults.handIcon} onChange={(e) => set(['defaults', 'handIcon'], e.target.value)} className={ring(['defaults', 'handIcon'])}>
            {handIcons().map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Pick>
        <Pick label="Atributo de Combate">
          <select value={spec.attribute.defaultFrame} onChange={(e) => set(['attribute', 'defaultFrame'], e.target.value)} className={ring(['attribute', 'defaultFrame'])}>
            {attributeFrames().map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Pick>
        <p className="text-xs font-semibold text-muted">Imagens ({CARD_TYPE_LABEL[type]}{panelVariant ? `, design ${panelVariant}` : ''})</p>
        {image('Moldura', frameFor(spec, type, panelVariant))}
        {image('Painel', panelFor(spec, type, panelVariant))}
        {!printed && (
          <p className="text-xs text-muted">
            Enquanto a imagem é a do layout base, trocar grava a nova em <code>{spec.id}/</code> (a do layout base fica como está).
          </p>
        )}
      </div>
    </details>
  );
}

export function LayoutEditor() {
  const content = useContent();
  const [tab, setTab] = useState<'layouts' | 'icons'>('layouts');
  // Ícone aberto pelo ✎ do editor de layouts, para a aba Ícones começar nele.
  const [iconToOpen, setIconToOpen] = useState<IconChoice | undefined>(undefined);
  const [layoutId, setLayoutId] = useState<LayoutId>('layout-01');
  const spec = LAYOUTS[layoutId] ?? LAYOUTS['layout-01'];
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
  const switchTab = (next: 'layouts' | 'icons') => {
    // Na aba Layouts não há ícone aberto (as caixas e os campos de dentro dos ícones ficam na aba Ícones).
    if (next === 'layouts') editor.select(null);
    setTab(next);
  };
  const openIcon = (icon: IconChoice) => {
    setIconToOpen(icon);
    setTab('icons');
  };
  const { dirtyCount } = editor;

  useEffect(() => {
    if (!spec.types.includes(type)) setType(spec.types[0]);
  }, [spec, type]);

  // `/criar/layouts?layout=layout-02&carta=s13-n-549` (link "editar o layout" da aba Editar do detalhe da carta).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get('layout');
    if (wanted && LAYOUTS[wanted]) setLayoutId(wanted);
    const found = CARDS_BY_ID.get(params.get('carta') ?? '');
    if (found) {
      setType(found.type);
      setSampleId(found.id);
    }
  }, []);

  const pendingFirst = () => !dirtyCount || (alert('Salve ou descarte as alterações antes.'), false);
  const createLayout = async () => {
    if (!pendingFirst()) return;
    const label = prompt(`Nome do layout novo (cópia de "${spec.label}": molduras, painéis, posições e ícones):`)?.trim();
    if (!label) return;
    try {
      const id = slugId(label);
      await createContentLayout(id, label, spec.id);
      await content.reload();
      setLayoutId(id);
      setStatus({ ok: true, text: `Layout "${label}" criado (${id}). Troque as imagens e ajuste as posições.` });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : String(e) });
    }
  };
  const removeLayout = async () => {
    if (!pendingFirst() || !confirm(`Excluir o layout "${spec.label}"? As imagens dele saem do Blob. Não dá para desfazer.`)) return;
    try {
      await deleteContentLayout(spec.id);
      setLayoutId('layout-01');
      await content.reload();
      setStatus({ ok: true, text: 'Layout excluído.' });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : String(e) });
    }
  };

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
      setStatus({ ok: true, text: written.length ? `Salvo: ${written.join(', ')}` : 'Nada mudou.' });
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
        <div role="tablist" aria-label="Seções do editor" className="flex gap-1 text-sm">
          {(
            [
              ['layouts', 'Layouts'],
              ['icons', 'Ícones'],
            ] as const
          ).map(([value, text]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => switchTab(value)}
              className={`rounded-md px-3 py-1 ${tab === value ? 'bg-accent font-semibold text-bg' : 'text-muted hover:bg-surface-2 hover:text-text'}`}
            >
              {text}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted">as alterações valem para todo mundo</span>
        {tab === 'layouts' && <ContentHistoryButton kind="layout" id={layoutId} />}
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

      {tab === 'icons' && <IconsEditor key={iconToOpen ? `${iconToOpen.group}:${iconToOpen.id}` : 'icons'} editor={editor} initial={iconToOpen} />}
      {tab === 'layouts' && (
      <OpenIconContext.Provider value={openIcon}>
      <div className="flex flex-wrap items-center gap-3">
        <select value={layoutId} onChange={(e) => setLayoutId(e.target.value as LayoutId)} className={selectClass}>
          {LAYOUT_LIST.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => void createLayout()} className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text">
          + Novo layout
        </button>
        {!PRINTED_LAYOUTS.includes(spec.id) && (
          <button type="button" onClick={() => void removeLayout()} className="rounded-lg px-3 py-1.5 text-sm text-danger ring-1 ring-danger/40 hover:bg-danger/10">
            Excluir layout
          </button>
        )}
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
          Arraste as caixas (canto: tamanho; Shift: um eixo só). Setas movem a selecionada (Shift = 10, Alt = 0,1). O ✎ de cada ícone abre ele na aba Ícones
          para editar a configuração dele.
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        {/* A carta fica parada na tela; os campos rolam ao lado. */}
        <div className="sticky top-[calc(var(--app-header-h)+1rem)] self-start">
          {card ? <EditorCanvas editor={editor} card={card} width={width} referenceOpacity={refOpacity} showBoxes={showBoxes} /> : <p>Escolha uma carta.</p>}
        </div>
        <aside className="sticky top-[calc(var(--app-header-h)+1rem)] self-start flex min-w-72 flex-1 flex-col gap-2 max-h-[calc(100dvh-var(--app-header-h)-2rem)] overflow-y-auto overscroll-contain pr-1">
          {card && (
            <>
              <LayoutProperties editor={editor} spec={spec} type={type} panelVariant={card.panelVariant} />
              <IconPicker
                editor={editor}
                spec={spec}
                card={card}
                changed={Object.keys(overrides).length > 0}
                onChange={(o) => setOverrides((prev) => ({ ...prev, ...o }))}
                onReset={() => setOverrides({})}
              />
              <section className="flex flex-col gap-1.5 rounded-lg p-2 ring-1 ring-border">
                <h2 className="text-sm font-semibold">Imagens no Blob</h2>
                <MigrateAssetsButton />
                <SweepAssetsButton />
              </section>
              <EditorFields editor={editor} card={card} iconFields={false} />
            </>
          )}
        </aside>
      </div>
      </OpenIconContext.Provider>
      )}
    </div>
  );
}
