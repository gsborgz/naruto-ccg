'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CHAKRA_ICON,
  COMBAT_ATTRIBUTE_ICONS,
  COST_ICONS,
  ELEMENT_ICONS,
  LAYOUT_LIST,
  TYPE_ICONS,
  TYPE_ICON_VARIANTS,
} from '@/lib/cardMaker/layouts';
import {
  newCustomCard,
  withLayout,
  withLayoutIcons,
  type AttributeFrame,
  type CustomCard,
  type ElementVariant,
  type EntranceIcon,
  type HandIcon,
  type LayoutId,
} from '@/lib/cardMaker/model';
import { assetUrl } from '@/lib/content/assets';
import { CARD_TYPE_LABEL, ELEMENT_LABEL, type CardType, type ElementSymbol } from '@/models/card';
import { useImageSize } from './ContentTools';
import { EditorCanvas, EditorFields, choiceKey, iconObject, selectClass, type ConfigEditor, type IconChoice } from './layoutEditing';

/**
 * Aba Ícones do editor de layouts: cada ícone (tipo, tipo alternativo, elemento, custo, Chakra, Atributo de Combate)
 * editado sozinho, numa carta de exemplo que o mostra, com as caixas de dentro dele na carta e os campos dele
 * (posição e tamanho dos textos e números, cores, contorno, sombra). As medidas são relativas ao próprio ícone, então
 * valem em todos os layouts. A imagem pode ser trocada por outra do mesmo tamanho (o tamanho padrão do ícone).
 */

interface IconEntry {
  choice: IconChoice;
  label: string;
  url?: string;
}

const GROUP_LABEL: Record<IconChoice['group'], string> = {
  type: 'Tipo',
  'type-variant': 'Tipo (alternativo)',
  element: 'Elemento',
  cost: 'Custo de entrada e de mão',
  chakra: 'Chakra (custo do Jutsu)',
  attribute: 'Atributo de Combate',
};

function iconList(): IconEntry[] {
  const out: IconEntry[] = [];
  for (const [t, icon] of Object.entries(TYPE_ICONS)) out.push({ choice: { group: 'type', id: t }, label: CARD_TYPE_LABEL[t as CardType], url: icon.url });
  for (const [t, list] of Object.entries(TYPE_ICON_VARIANTS)) {
    for (const v of list ?? []) out.push({ choice: { group: 'type-variant', id: `${t}-${v.id}` }, label: `${CARD_TYPE_LABEL[t as CardType]} ${v.label.toLowerCase()}`, url: v.icon.url });
  }
  for (const [id, icon] of Object.entries(ELEMENT_ICONS).sort(([a], [b]) => a.localeCompare(b))) {
    const [element, variant] = id.split('-');
    out.push({ choice: { group: 'element', id }, label: `${ELEMENT_LABEL[element as ElementSymbol] ?? element} ${variant}`, url: icon.url });
  }
  for (const [id, icon] of Object.entries(COST_ICONS).sort(([a], [b]) => a.localeCompare(b))) {
    out.push({ choice: { group: 'cost', id }, label: id.startsWith('entrance') ? `Entrada ${id.slice(9)}` : `Mão ${id.slice(5)}`, url: icon.url });
  }
  out.push({ choice: { group: 'chakra', id: 'chakra-any' }, label: 'Chakra genérico', url: CHAKRA_ICON.url });
  for (const [id, icon] of Object.entries(COMBAT_ATTRIBUTE_ICONS).sort(([a], [b]) => a.localeCompare(b))) {
    out.push({ choice: { group: 'attribute', id }, label: `Moldura ${id}`, url: icon.url });
  }
  return out;
}

/** Tipo de carta que mostra o ícone. */
function cardTypeFor(c: IconChoice): CardType {
  if (c.group === 'type' || c.group === 'type-variant') return c.id.split('-')[0] as CardType;
  return c.group === 'chakra' ? 'jutsu' : 'ninja';
}

/** A caixa do ícone na carta (a de `layoutHandles`). */
function hostFor(c: IconChoice): string {
  if (c.group === 'type' || c.group === 'type-variant') return 'typeIcon';
  if (c.group === 'element') return 'elements';
  if (c.group === 'cost') return c.id.startsWith('entrance') ? 'cost-entrance' : 'cost-hand';
  if (c.group === 'chakra') return 'jutsuCost';
  return 'attribute';
}

/** Carta de exemplo que mostra o ícone, no layout escolhido. */
function sampleCard(c: IconChoice, layout: LayoutId): CustomCard {
  const type = cardTypeFor(c);
  const base = withLayoutIcons(withLayout({ ...newCustomCard(type, '2026-01-01T00:00:00.000Z'), name: 'Exemplo' }, layout));
  const card: CustomCard = {
    ...base,
    entranceCost: '3',
    handCost: '2',
    healthy: '5/3',
    injured: '2/1',
    attribute: { ...base.attribute, label: 'Ninjutsu' },
    jutsuCost: { symbols: ['fire'], generic: '2' },
  };
  if (c.group === 'type-variant') card.typeVariant = c.id.split('-').slice(1).join('-');
  if (c.group === 'element') {
    const [element, variant] = c.id.split('-');
    card.elements = [{ element: element as ElementSymbol, variant: variant as ElementVariant }];
  }
  if (c.group === 'cost') {
    if (c.id.startsWith('entrance')) card.entranceIcon = c.id as EntranceIcon;
    else card.handIcon = c.id as HandIcon;
  }
  if (c.group === 'attribute') card.attribute = { ...card.attribute, frame: c.id as AttributeFrame };
  return card;
}

export function IconsEditor({ editor }: { editor: ConfigEditor }) {
  const icons = useMemo(iconList, []);
  const [selected, setSelected] = useState<IconChoice>(icons[0]?.choice ?? { group: 'type', id: 'ninja' });
  const type = cardTypeFor(selected);
  const layouts = LAYOUT_LIST.filter((l) => l.types.includes(type));
  const [layoutId, setLayoutId] = useState<LayoutId>('layout-02');
  const layout = layouts.some((l) => l.id === layoutId) ? layoutId : (layouts[0]?.id ?? 'layout-01');
  const card = useMemo(() => sampleCard(selected, layout), [selected, layout]);
  const [width, setWidth] = useState(520);
  const entry = icons.find((i) => choiceKey(i.choice) === choiceKey(selected));
  const size = useImageSize(entry?.url);

  // Abre o ícone escolhido (as caixas de dentro dele na carta e os campos dele).
  useEffect(() => {
    editor.editIcon(selected, hostFor(selected));
    // `editor` muda a cada render; só ao escolher outro ícone ou layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choiceKey(selected), layout]);

  const groups = Object.keys(GROUP_LABEL) as IconChoice['group'][];
  return (
    <div className="flex flex-wrap items-start gap-6">
      <nav aria-label="Ícones" className="flex max-h-[80vh] w-56 shrink-0 flex-col gap-3 overflow-y-auto pr-1">
        {groups.map((g) => {
          const list = icons.filter((i) => i.choice.group === g);
          if (!list.length) return null;
          return (
            <div key={g} className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{GROUP_LABEL[g]}</h3>
              {list.map((i) => {
                const on = choiceKey(i.choice) === choiceKey(selected);
                return (
                  <button
                    key={choiceKey(i.choice)}
                    type="button"
                    onClick={() => setSelected(i.choice)}
                    className={`flex items-center gap-2 rounded px-1.5 py-1 text-left text-sm ${on ? 'bg-accent/15 font-semibold text-text' : 'text-muted hover:bg-surface-2 hover:text-text'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {i.url && <img src={assetUrl(i.url)} alt="" className="size-7 object-contain" loading="lazy" />}
                    {i.label}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <label className="flex items-center gap-2">
            Layout do exemplo
            <select value={layout} onChange={(e) => setLayoutId(e.target.value)} className={selectClass}>
              {layouts.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Tamanho
            <input type="range" min={300} max={900} step={10} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          </label>
        </div>
        <EditorCanvas editor={editor} card={card} width={width} iconOnly />
      </div>

      <aside className="flex min-w-72 flex-1 flex-col gap-2">
        <div className="rounded-lg bg-surface px-3 py-2 text-xs ring-1 ring-border">
          <p className="text-sm font-semibold text-text">{entry?.label ?? selected.id}</p>
          <p className="text-muted">
            Tamanho padrão da imagem: {size ? `${size.w}×${size.h} px` : '…'}. Uma imagem nova precisa ter esse tamanho (redimensione
            antes de enviar). As medidas abaixo são relativas ao ícone e valem em todos os layouts; arraste as caixas de dentro do ícone
            na carta ou mexa nos campos.
          </p>
        </div>
        {iconObject(selected) ? <EditorFields editor={editor} card={card} layoutFields={false} /> : <p className="text-sm text-muted">Ícone não encontrado.</p>}
      </aside>
    </div>
  );
}
