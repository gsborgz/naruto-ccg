'use client';

import { createContext, useContext, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { CardRender } from '@/components/cardMaker/CardRender';
import {
  CARD_H,
  CARD_W,
  CHAKRA_ICON,
  COMBAT_ATTRIBUTE_ICONS,
  COST_ICONS,
  ELEMENT_ICONS,
  MAX_ELEMENTS,
  NAME_BANNER_ASPECT,
  TYPE_ICONS,
  TYPE_ICON_VARIANTS,
  attributeIcon,
  costArt,
  costIcon,
  elementBox,
  elementVariants,
  getLayout,
  type CostIconConfig,
  type IconPlacement,
  type LayoutSpec,
} from '@/lib/cardMaker/layouts';
import type { ConfigTarget, ConfigValue } from '@/lib/content/changes';
import { saveConfigChanges } from '@/lib/content/client';
import { useOptionalContent } from '@/lib/content/ContentProvider';
import { AssetSwapButton, ContentHistoryButton } from './ContentTools';
import type { AttributeFrame, CardElement, CustomCard, EntranceIcon, HandIcon } from '@/lib/cardMaker/model';
import { CARD_TYPE_LABEL, ELEMENT_LABEL, type CardType, type ElementSymbol } from '@/models/card';

/**
 * Edição dos layouts e dos ícones do criador: usada pela página `/criar/layouts` e pela aba Layout do detalhe da
 * carta (`DevCardLayoutTab`).
 *
 * Mexe direto nos objetos de configuração carregados (`LAYOUTS`, `TYPE_ICONS`...), que são os mesmos que a carta
 * montada lê, então a prévia muda na hora. As alterações ficam numa lista (`useConfigEditor`) e são gravadas no
 * conteúdo do jogo (Redis) pela rota `/api/content/config`, valendo para todo mundo na hora.
 *
 * Tipos de carta com a mesma configuração (no código original, `forAllTypes(...)` e constantes como `COST`) dividem o
 * objeto (`linkSharedTypes`) e mudam juntos, aqui e no servidor. Nos ícones, cada campo muda só no ícone editado.
 */

export type Obj = Record<string, unknown>;
export type Path = string[];
export type IconGroup = Extract<ConfigTarget, { kind: 'icon' }>['group'];

export interface Change {
  target: ConfigTarget;
  path: Path;
  value: ConfigValue;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Campo que um arrasto altera: valor original + deslocamento no eixo × `k`. */
export interface Drive {
  path: Path;
  axis: 'x' | 'y';
  k: number;
}

/** Caixa arrastável sobre a carta. */
export interface Handle {
  id: string;
  label: string;
  /** Seção do painel de campos que abre ao selecionar. */
  section: string;
  target: ConfigTarget;
  root: Obj;
  box: Box;
  move: Drive[];
  resize?: Drive[];
  /** Só para conferência (ex.: espaços seguintes dos elementos). */
  dashed?: boolean;
  /** Ícone cuja configuração abre ao selecionar a caixa. */
  icon?: IconChoice;
  /** Valor de um campo que ainda não existe na configuração (caminho com pontos), usado ao arrastar. */
  defaults?: Record<string, number>;
}

/** Valor atual de um campo arrastado (o padrão da caixa, se o campo ainda não existe). */
const driveValue = (h: Handle, path: Path) => {
  const v = getAt(h.root, path);
  return v === undefined || v === null ? (h.defaults?.[path.join('.')] ?? 0) : Number(v) || 0;
};

export const targetKey = (t: ConfigTarget) => (t.kind === 'layout' ? `layout:${t.id}` : `icon:${t.group}:${t.id}`);
export const changeKey = (t: ConfigTarget, path: Path) => `${targetKey(t)}|${path.join('.')}`;

export function getAt(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Obj)[k] : undefined), obj);
}

export function setAt(obj: unknown, path: Path, value: unknown) {
  const parent = getAt(obj, path.slice(0, -1));
  if (parent && typeof parent === 'object') (parent as Obj)[path[path.length - 1]] = value;
}

export const round = (v: number, k: number) => {
  const d = Math.abs(k) >= 0.5 ? 10 : 10000;
  return Math.round(v * d) / d;
};

// ── Ícones ────────────────────────────────────────────────────────────────────

export interface IconChoice {
  group: IconGroup;
  id: string;
}

export const choiceKey = (c: IconChoice) => `${c.group}:${c.id}`;

export function iconObject(c: IconChoice): Obj | undefined {
  switch (c.group) {
    case 'type':
      return TYPE_ICONS[c.id as CardType] as unknown as Obj;
    case 'type-variant': {
      const [type, ...rest] = c.id.split('-');
      return TYPE_ICON_VARIANTS[type as CardType]?.find((v) => v.id === rest.join('-'))?.icon as unknown as Obj;
    }
    case 'element':
      return ELEMENT_ICONS[c.id] as unknown as Obj;
    case 'cost':
      return COST_ICONS[c.id as EntranceIcon] as unknown as Obj;
    case 'chakra':
      return CHAKRA_ICON as unknown as Obj;
    case 'attribute':
      return COMBAT_ATTRIBUTE_ICONS[c.id as AttributeFrame] as unknown as Obj;
  }
}

// Listas fixas: os ícones de custo vêm do conteúdo (Redis), que só é carregado depois que este módulo é importado.
/** Ícones de custo existentes (os impressos e os criados na aba Ícones). */
export { entranceIcons, handIcons, attributeFrames } from '@/lib/cardMaker/icons';
export const ELEMENTS = Object.keys(ELEMENT_LABEL) as ElementSymbol[];

/** Chave do ícone de elemento que a carta mostra (variante inexistente cai na 01, como no app). */
export function elementKey(el: CardElement) {
  return `${el.element}-${elementVariants(el.element).includes(el.variant) ? el.variant : '01'}`;
}

// ── Caixas arrastáveis ────────────────────────────────────────────────────────

export const costKey = (t: CardType) => (t === 'mission' ? 'mission' : t === 'client' ? 'client' : 'ninja');
export const charKey = (t: CardType) => (t === 'client' ? 'client' : 'ninja');
export const hasStats = (t: CardType) => t === 'ninja' || t === 'client';

export const firstElement = (card: CustomCard, spec: LayoutSpec): CardElement => card.elements[0] ?? { element: 'fire', variant: spec.elements.variant };

export function layoutHandles(spec: LayoutSpec, card: CustomCard): Handle[] {
  const t = card.type;
  const target: ConfigTarget = { kind: 'layout', id: spec.id };
  const root = spec as unknown as Obj;
  const base = { target, root };

  const placement = (id: string, label: string, path: Path, p: IconPlacement, aspect: number, icon?: IconChoice): Handle => ({
    ...base,
    id,
    label,
    section: path[0],
    icon,
    box: { x: p.x, y: p.y, w: p.size, h: p.size * aspect },
    move: [
      { path: [...path, 'x'], axis: 'x', k: 1 },
      { path: [...path, 'y'], axis: 'y', k: 1 },
    ],
    resize: [{ path: [...path, 'size'], axis: 'x', k: 1 }],
  });

  const typeVariant = card.typeVariant ? TYPE_ICON_VARIANTS[t]?.find((v) => v.id === card.typeVariant) : undefined;
  const typeChoice: IconChoice = typeVariant ? { group: 'type-variant', id: `${t}-${typeVariant.id}` } : { group: 'type', id: t };
  const out: Handle[] = [placement('typeIcon', 'Tipo', ['typeIcon', t], spec.typeIcon[t], (typeVariant?.icon ?? TYPE_ICONS[t]).aspect, typeChoice)];

  const el = firstElement(card, spec);
  out.push({
    ...base,
    id: 'elements',
    label: 'Elemento 1',
    section: 'elements',
    icon: card.elements[0] && { group: 'element', id: elementKey(el) },
    box: elementBox(spec, el, 0),
    move: [
      { path: ['elements', 'pos', 'x'], axis: 'x', k: 1 },
      { path: ['elements', 'pos', 'y'], axis: 'y', k: 1 },
    ],
    resize: [{ path: ['elements', 'pos', 'size'], axis: 'x', k: 1 }],
  });
  for (let slot = 1; slot < MAX_ELEMENTS; slot++) {
    const other = card.elements[slot];
    out.push({
      ...base,
      id: `elements-${slot}`,
      label: `Elemento ${slot + 1} (slotDy)`,
      section: 'elements',
      icon: other && { group: 'element', id: elementKey(other) },
      box: elementBox(spec, other ?? el, slot, el),
      move: [{ path: ['elements', 'slotDy'], axis: 'y', k: 1 / slot }],
      dashed: true,
    });
  }

  if (t !== 'jutsu') {
    const ck = costKey(t);
    const cost = spec.cost[ck];
    const entrance = costIcon(cost.entrance, card.entranceIcon).box;
    const hand = costIcon(cost.hand, card.handIcon).box;
    out.push(placement('cost-entrance', 'Custo de entrada', ['cost', ck, 'entrance'], cost.entrance, entrance.h / entrance.w, { group: 'cost', id: card.entranceIcon }));
    out.push(placement('cost-hand', 'Custo de mão', ['cost', ck, 'hand'], cost.hand, hand.h / hand.w, { group: 'cost', id: card.handIcon }));
  }

  if (t === 'ninja') {
    const a = attributeIcon(spec, card.attribute.frame);
    out.push({
      ...base,
      id: 'attribute',
      label: 'Atributo de Combate',
      section: 'attribute',
      icon: { group: 'attribute', id: card.attribute.frame },
      box: a.box,
      move: [
        { path: ['attribute', 'x'], axis: 'x', k: 1 },
        { path: ['attribute', 'y'], axis: 'y', k: 1 },
      ],
      resize: [{ path: ['attribute', 'size'], axis: 'x', k: 1 }],
    });
  }
  if (hasStats(t)) out.push(placement('village', 'Vila', ['village'], spec.village, 1));

  const name = spec.name[t];
  const center = name.align === 'center';
  out.push({
    ...base,
    id: 'name',
    label: 'Nome',
    section: 'name',
    box: { x: center ? name.x - name.maxWidth / 2 : name.x, y: name.cy - name.size * 0.75, w: name.maxWidth, h: name.size * 1.5 },
    move: [
      { path: ['name', t, 'x'], axis: 'x', k: 1 },
      { path: ['name', t, 'cy'], axis: 'y', k: 1 },
    ],
    resize: [
      { path: ['name', t, 'maxWidth'], axis: 'x', k: center ? 2 : 1 },
      { path: ['name', t, 'size'], axis: 'y', k: 1 / 1.5 },
    ],
  });

  if (hasStats(t)) {
    const ck = charKey(t);
    const c = spec.characteristics[ck];
    out.push({
      ...base,
      id: 'characteristics',
      label: 'Características',
      section: 'characteristics',
      box: { x: c.x, y: c.cy - c.size * 0.75, w: c.maxWidth, h: c.size * 1.5 },
      move: [
        { path: ['characteristics', ck, 'x'], axis: 'x', k: 1 },
        { path: ['characteristics', ck, 'cy'], axis: 'y', k: 1 },
      ],
      resize: [
        { path: ['characteristics', ck, 'maxWidth'], axis: 'x', k: 1 },
        { path: ['characteristics', ck, 'size'], axis: 'y', k: 1 / 1.5 },
      ],
    });
  }

  const text = spec.textBox[t];
  if (text) {
    out.push({
      ...base,
      id: 'textBox',
      label: 'Texto de efeito',
      section: 'textBox',
      box: { x: text.x, y: text.top, w: text.w, h: text.bottom - text.top },
      move: [
        { path: ['textBox', t, 'x'], axis: 'x', k: 1 },
        { path: ['textBox', t, 'top'], axis: 'y', k: 1 },
        { path: ['textBox', t, 'bottom'], axis: 'y', k: 1 },
      ],
      resize: [
        { path: ['textBox', t, 'w'], axis: 'x', k: 1 },
        { path: ['textBox', t, 'bottom'], axis: 'y', k: 1 },
      ],
    });
  }

  // Linha acima do texto: só o centro vertical (gap) e a largura (inset, igual dos dois lados) mudam; segue a caixa de texto.
  const divider = spec.textDivider;
  if (text && divider) {
    const h = Math.max(divider.thickness, 8);
    out.push({
      ...base,
      id: 'textDivider',
      label: 'Linha acima do texto',
      section: 'textDivider',
      box: { x: text.x + divider.inset, y: text.top - divider.gap - h / 2, w: text.w - divider.inset * 2, h },
      move: [{ path: ['textDivider', 'gap'], axis: 'y', k: -1 }],
      resize: [{ path: ['textDivider', 'inset'], axis: 'x', k: -0.5 }],
    });
  }

  const flavor = spec.flavor[t];
  const fh = flavor.lineHeight * 3;
  out.push({
    ...base,
    id: 'flavor',
    label: 'Frase (base)',
    section: 'flavor',
    box: { x: flavor.x, y: flavor.bottom - fh, w: flavor.w, h: fh },
    move: [
      { path: ['flavor', t, 'x'], axis: 'x', k: 1 },
      { path: ['flavor', t, 'bottom'], axis: 'y', k: 1 },
    ],
    resize: [{ path: ['flavor', t, 'w'], axis: 'x', k: 1 }],
  });

  if (t === 'jutsu' && spec.jutsuCost) {
    const j = spec.jutsuCost;
    out.push({
      ...base,
      id: 'jutsuCost',
      label: 'Custo do Jutsu',
      section: 'jutsuCost',
      icon: { group: 'chakra', id: 'chakra-any' },
      box: { x: j.x, y: j.cy - j.chakraSize / 2, w: j.chakraSize * 3, h: j.chakraSize },
      move: [
        { path: ['jutsuCost', 'x'], axis: 'x', k: 1 },
        { path: ['jutsuCost', 'cy'], axis: 'y', k: 1 },
      ],
    });
  }

  if (spec.nameBanner) {
    const b = spec.nameBanner;
    const h = b.w * NAME_BANNER_ASPECT;
    out.push({
      ...base,
      id: 'nameBanner',
      label: 'Mancha do nome',
      section: 'nameBanner',
      box: { x: b.cx - b.w / 2, y: b.cy - h / 2, w: b.w, h },
      move: [
        { path: ['nameBanner', 'cx'], axis: 'x', k: 1 },
        { path: ['nameBanner', 'cy'], axis: 'y', k: 1 },
      ],
      resize: [{ path: ['nameBanner', 'w'], axis: 'x', k: 2 }],
    });
  }
  return out;
}

/**
 * Caixas de dentro do ícone selecionado (medidas relativas ao próprio ícone, convertidas para a carta).
 * `host`: a caixa do ícone na carta (a do layout).
 */
export function iconHandles(spec: LayoutSpec, card: CustomCard, c: IconChoice, host: Handle): Handle[] {
  const root = iconObject(c);
  if (!root) return [];
  const target: ConfigTarget = { kind: 'icon', group: c.group, id: c.id };
  const base = { target, root, icon: c };

  // A caixa do ícone (a "div" de tamanho fixo em que a imagem é enquadrada): arrastar a borda de baixo muda a proporção.
  const boxHandle = (): Handle => ({
    ...base,
    id: 'icon-box',
    label: 'Caixa do ícone (proporção)',
    section: 'geral',
    box: host.box,
    move: [],
    resize: [{ path: ['aspect'], axis: 'y', k: 1 / host.box.w }],
  });

  if (c.group === 'type' || c.group === 'type-variant' || c.group === 'element') {
    const k = host.box.w;
    const { x, y } = host.box;
    const art = root.art as Box;
    const label = root.label as { cx: number; cy: number; cap: number; length: number };
    return [
      boxHandle(),
      {
        ...base,
        id: 'icon-art',
        label: 'Arte do ícone',
        section: 'art',
        box: { x: x + art.x * k, y: y + art.y * k, w: art.w * k, h: art.h * k },
        move: [
          { path: ['art', 'x'], axis: 'x', k: 1 / k },
          { path: ['art', 'y'], axis: 'y', k: 1 / k },
        ],
        resize: [
          { path: ['art', 'w'], axis: 'x', k: 1 / k },
          { path: ['art', 'h'], axis: 'y', k: 1 / k },
        ],
      },
      {
        ...base,
        id: 'icon-label',
        label: 'Nome de lado',
        section: 'label',
        box: { x: x + (label.cx - label.cap / 2) * k, y: y + (label.cy - label.length / 2) * k, w: label.cap * k, h: label.length * k },
        move: [
          { path: ['label', 'cx'], axis: 'x', k: 1 / k },
          { path: ['label', 'cy'], axis: 'y', k: 1 / k },
        ],
        resize: [
          { path: ['label', 'cap'], axis: 'x', k: 1 / k },
          { path: ['label', 'length'], axis: 'y', k: 1 / k },
        ],
      },
    ];
  }
  if (c.group === 'cost' && card.type !== 'jutsu') {
    const slot = c.id.startsWith('entrance') ? 'entrance' : 'hand';
    const placed = costIcon(spec.cost[costKey(card.type)][slot], c.id as EntranceIcon);
    const n = placed.number;
    const k = placed.box.w;
    const art = costArt(root as unknown as CostIconConfig);
    return [
      boxHandle(),
      {
        ...base,
        id: 'icon-art',
        label: 'Imagem do ícone',
        section: 'art',
        // A altura segue a proporção da imagem; a caixa mostrada usa a da caixa do ícone.
        box: { x: placed.image.x, y: placed.image.y, w: placed.image.w, h: placed.image.w * (root.aspect as number) },
        move: [
          { path: ['art', 'x'], axis: 'x', k: 1 / k },
          { path: ['art', 'y'], axis: 'y', k: 1 / k },
        ],
        resize: [{ path: ['art', 'w'], axis: 'x', k: 1 / k }],
        defaults: { 'art.x': art.x, 'art.y': art.y, 'art.w': art.w },
      },
      {
        ...base,
        id: 'icon-number',
        label: 'Número do custo',
        section: 'number',
        box: { x: n.cx - n.size / 2, y: n.cy - n.size / 2, w: n.size, h: n.size },
        move: [
          { path: ['number', 'x'], axis: 'x', k: 1 / placed.box.w },
          { path: ['number', 'y'], axis: 'y', k: 1 / placed.box.h },
        ],
        resize: [{ path: ['number', 'size'], axis: 'y', k: 1 }],
      },
    ];
  }
  if (c.group === 'attribute' && card.type === 'ninja') {
    const a = attributeIcon(spec, c.id as AttributeFrame);
    const k = a.box.w / (root.canvas as { w: number }).w;
    const { cx, cy, r } = a.circle;
    const kanjiSize = r * a.kanji.size;
    const kanjiCy = cy + r * a.kanji.dy;
    const labelH = a.label.size * 1.1;
    const labelCy = cy + r * a.label.dyWithKanji[0];
    const point = (id: 'healthy' | 'injured', label: string, p: { cx: number; cy: number; size: number }): Handle => ({
      ...base,
      id: `icon-${id}`,
      label,
      section: 'power',
      box: { x: p.cx - p.size / 2, y: p.cy - p.size / 2, w: p.size, h: p.size },
      move: [
        { path: ['power', id, 'x'], axis: 'x', k: 1 / k },
        { path: ['power', id, 'y'], axis: 'y', k: 1 / k },
      ],
      resize: [{ path: ['power', 'size'], axis: 'y', k: 1 / k }],
    });
    return [
      {
        ...base,
        id: 'icon-circle',
        label: 'Círculo do atributo',
        section: 'circle',
        box: { x: a.circle.cx - a.circle.r, y: a.circle.cy - a.circle.r, w: a.circle.r * 2, h: a.circle.r * 2 },
        move: [
          { path: ['circle', 'cx'], axis: 'x', k: 1 / k },
          { path: ['circle', 'cy'], axis: 'y', k: 1 / k },
        ],
        resize: [{ path: ['circle', 'r'], axis: 'x', k: 1 / (2 * k) }],
      },
      point('healthy', 'Força (saudável)', a.healthy),
      point('injured', 'Força (ferido)', a.injured),
      {
        ...base,
        id: 'icon-kanji',
        label: 'Kanji (dy, size)',
        section: 'kanji',
        box: { x: cx - kanjiSize / 2, y: kanjiCy - kanjiSize / 2, w: kanjiSize, h: kanjiSize },
        move: [{ path: ['kanji', 'dy'], axis: 'y', k: 1 / r }],
        resize: [{ path: ['kanji', 'size'], axis: 'y', k: 1 / r }],
      },
      {
        // Com 1 atributo; com 2 ou 3 linhas o nome usa dyWithKanji[1] e [2] (editáveis nos campos).
        ...base,
        id: 'icon-attr-label',
        label: 'Nome do atributo (dyWithKanji[0], size)',
        section: 'label',
        box: { x: cx - r * 0.8, y: labelCy - labelH / 2, w: r * 1.6, h: labelH },
        move: [{ path: ['label', 'dyWithKanji', '0'], axis: 'y', k: 1 / r }],
        resize: [{ path: ['label', 'size'], axis: 'y', k: 1 / (1.1 * k) }],
      },
    ];
  }
  return [];
}

// ── Painel de campos ──────────────────────────────────────────────────────────

/** Campos do layout que não são editados aqui (ids, nomes, imagens). */
export const LAYOUT_SKIP = new Set(['id', 'label', 'types', 'frame', 'panel', 'panelVariants', 'panelLabel', 'textDividerColor']);
/** Campos por tipo: só o do tipo da carta da prévia. */
export const PER_TYPE = new Set(['typeIcon', 'name', 'textBox', 'markColor', 'flavor']);

export const isColor = (v: string) => /^#[0-9a-f]{3,8}$/i.test(v) || /^rgba?\(/.test(v);

export interface Section {
  key: string;
  path: Path;
  value: unknown;
}

export function FieldInput({ value, dirty, onChange }: { value: number | string | boolean; dirty: boolean; onChange: (v: ConfigValue) => void }) {
  const ring = dirty ? 'ring-accent' : 'ring-border';
  if (typeof value === 'boolean') {
    return <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />;
  }
  if (typeof value === 'number') {
    const step = !Number.isInteger(value) && Math.abs(value) < 3 ? 0.001 : 0.5;
    return (
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => e.target.value !== '' && Number.isFinite(e.target.valueAsNumber) && onChange(e.target.valueAsNumber)}
        className={`w-24 rounded bg-surface-2 px-1.5 py-0.5 text-right text-xs tabular-nums ring-1 ${ring}`}
      />
    );
  }
  const hex6 = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <span className="flex items-center gap-1">
      {hex6 && <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-5 w-6 cursor-pointer bg-transparent" />}
      {isColor(value) && !hex6 && <span className="inline-block h-4 w-4 rounded ring-1 ring-border" style={{ background: value }} />}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-32 rounded bg-surface-2 px-1.5 py-0.5 text-xs ring-1 ${ring}`} />
    </span>
  );
}

/** Nomes em português dos campos da configuração (a chave fica na dica). */
const FIELD_LABELS: Record<string, string> = {
  geral: 'geral',
  aspect: 'proporção da caixa (altura ÷ largura)',
  art: 'imagem',
  label: 'nome',
  number: 'número',
  power: 'força',
  circle: 'círculo',
  kanji: 'kanji',
  canvas: 'tela',
  inline: 'espaço na linha',
  shadow: 'sombra',
  healthy: 'saudável',
  injured: 'ferido',
  text: 'texto',
  x: 'x',
  y: 'y',
  w: 'largura',
  h: 'altura',
  cx: 'centro x',
  cy: 'centro y',
  r: 'raio',
  dx: 'deslocamento x',
  dy: 'deslocamento y',
  size: 'tamanho',
  cap: 'altura das letras',
  length: 'comprimento',
  weight: 'peso da fonte',
  color: 'cor',
  stroke: 'contorno: cor',
  strokeWidth: 'contorno: espessura',
  align: 'alinhamento',
  opacity: 'opacidade',
  blur: 'desfoque',
  uppercase: 'maiúsculas',
  multiMax: 'aumento com vários atributos',
  dyWithKanji: 'posição com kanji (1, 2 e 3 linhas)',
  textSize: 'tamanho do kanji digitado',
  textColor: 'cor do kanji digitado',
  textStroke: 'contorno do kanji digitado',
  maxWidth: 'largura máxima',
  maxHeight: 'altura máxima',
  lineHeight: 'altura da linha',
  separator: 'separador',
  bottom: 'base',
  top: 'topo',
  gap: 'espaço entre blocos (na linha acima do texto: distância até o texto)',
  textDivider: 'linha acima do texto',
  inset: 'recuo dos lados',
  thickness: 'espessura',
  default: 'ligada por padrão',
};

/** Rótulo de um campo: o nome em português, ou a própria chave. */
export const fieldLabel = (key: string) => FIELD_LABELS[key] ?? key;

export function FieldTree({
  value,
  path,
  isDirty,
  onChange,
}: {
  value: unknown;
  path: Path;
  isDirty: (p: Path) => boolean;
  onChange: (p: Path, v: ConfigValue) => void;
}) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'object') {
    if (!['number', 'string', 'boolean'].includes(typeof value)) return null;
    return <FieldInput value={value as number | string | boolean} dirty={isDirty(path)} onChange={(v) => onChange(path, v)} />;
  }
  return (
    <div className="flex flex-col gap-1 border-l border-border pl-2">
      {Object.entries(value as Obj).map(([k, v]) =>
        v !== null && typeof v === 'object' && !Array.isArray(v) ? (
          <div key={k} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted" title={k}>
              {fieldLabel(k)}
            </span>
            <FieldTree value={v} path={[...path, k]} isDirty={isDirty} onChange={onChange} />
          </div>
        ) : Array.isArray(v) ? (
          <div key={k} className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted" title={k}>
              {fieldLabel(k)}
            </span>
            <span className="flex gap-1">
              {v.map((item, i) => (
                <FieldTree key={i} value={item} path={[...path, k, String(i)]} isDirty={isDirty} onChange={onChange} />
              ))}
            </span>
          </div>
        ) : (
          <label key={k} className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted" title={k}>
              {fieldLabel(k)}
            </span>
            <FieldTree value={v} path={[...path, k]} isDirty={isDirty} onChange={onChange} />
          </label>
        ),
      )}
    </div>
  );
}

export function layoutSections(spec: LayoutSpec, t: CardType): Section[] {
  const out: Section[] = [];
  for (const [key, value] of Object.entries(spec)) {
    if (LAYOUT_SKIP.has(key) || (key === 'jutsuCost' && t !== 'jutsu')) continue;
    if (PER_TYPE.has(key)) {
      const v = (value as Obj)[t];
      if (v !== undefined) out.push({ key, path: [key, t], value: v });
    } else if (key === 'cost') {
      if (t !== 'jutsu') out.push({ key, path: [key, costKey(t)], value: (value as Obj)[costKey(t)] });
    } else if (key === 'characteristics') {
      if (hasStats(t)) out.push({ key, path: [key, charKey(t)], value: (value as Obj)[charKey(t)] });
    } else {
      out.push({ key, path: [key], value });
    }
  }
  return out;
}

/** Campos da configuração do ícone: os soltos em "geral" e um grupo por objeto (arte, nome, número...). */
export function iconSections(icon: Obj): Section[] {
  const plain = Object.entries(icon).filter(([k, v]) => k !== 'url' && k !== 'created' && (typeof v !== 'object' || v === null));
  const nested = Object.entries(icon).filter(([, v]) => v !== null && typeof v === 'object');
  return [
    ...(plain.length ? [{ key: 'geral', path: [] as Path, value: Object.fromEntries(plain) }] : []),
    ...nested.map(([key, value]) => ({ key, path: [key], value })),
  ];
}

export const selectClass = 'rounded-lg bg-surface-2 px-2 py-1.5 text-sm ring-1 ring-border';
export const smallSelect = 'rounded bg-surface-2 px-1.5 py-1 text-xs ring-1 ring-border';

export function Pick({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted">{label}</span>
      <span className="flex items-center gap-1">{children}</span>
    </label>
  );
}

/** A seção tem alteração pendente? ("geral" = os campos soltos do ícone, de um nível só.) */
export function sectionDirty(s: Section, changes: Record<string, Change>, target: ConfigTarget, root: Obj) {
  return Object.values(changes).some((c) => {
    if (targetKey(c.target) !== targetKey(target)) return false;
    if (!s.path.length) return c.path.length === 1 && typeof root[c.path[0]] !== 'object';
    return s.path.every((k, i) => c.path[i] === k);
  });
}

// ── Estado da edição ──────────────────────────────────────────────────────────

/** Edição em andamento: as alterações, a caixa selecionada e o ícone aberto. */
export function useConfigEditor() {
  const [changes, setChanges] = useState<Record<string, Change>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [activeIcon, setActiveIcon] = useState<{ icon: IconChoice; host: string } | null>(null);
  const [, setVersion] = useState(0);
  const content = useOptionalContent();

  const setValue = (target: ConfigTarget, root: Obj, path: Path, value: ConfigValue) => {
    if (target.kind === 'icon') {
      // Os ícones dividem objetos de defaults.ts (ex.: `kanji: ATTRIBUTE_TEXT_STYLE.kanji`): copia o caminho antes de
      // mudar, para a prévia mudar só este ícone, como fica gravado (o campo muda só nele).
      let o = root;
      for (const k of path.slice(0, -1)) {
        const child = o[k];
        const copy = Array.isArray(child) ? [...child] : { ...(child as Obj) };
        o[k] = copy;
        o = copy as unknown as Obj;
      }
    }
    setAt(root, path, value);
    // Item de lista (ex.: `dyWithKanji[0]`): grava a lista inteira.
    const parent = getAt(root, path.slice(0, -1));
    const change: Change = Array.isArray(parent) ? { target, path: path.slice(0, -1), value: [...parent] } : { target, path, value };
    setChanges((prev) => ({ ...prev, [changeKey(target, change.path)]: change }));
    setVersion((v) => v + 1);
  };

  /**
   * Seleciona uma caixa da carta. A configuração de um ícone não abre por aqui (só na aba Ícones, com `editIcon`); sair
   * da seleção (`null`) fecha o ícone aberto.
   */
  const select = (h: Handle | null) => {
    setSelected(h?.id ?? null);
    if (!h) setActiveIcon(null);
  };

  /** Abre a configuração do ícone (`host`: a caixa dele na carta). */
  const editIcon = (c: IconChoice, host: string) => {
    setActiveIcon({ icon: c, host });
    setSelected(host);
  };

  /** Grava as alterações no conteúdo do jogo; devolve os itens gravados (layouts e ícones). */
  const save = async (): Promise<string[]> => {
    const list = Object.values(changes);
    if (!list.length) return [];
    const { version, written } = await saveConfigChanges(list);
    content?.saved(version);
    setChanges({});
    return written;
  };

  return { changes, dirtyCount: Object.keys(changes).length, selected, activeIcon, setValue, select, editIcon, save };
}

export type ConfigEditor = ReturnType<typeof useConfigEditor>;

/** Caixas da carta (as do layout e, com um ícone aberto, as de dentro dele) e o ícone aberto. */
export function editorState(editor: ConfigEditor, card: CustomCard) {
  const spec = getLayout(card.layout);
  const outer = layoutHandles(spec, card);
  const { activeIcon } = editor;
  const host = activeIcon && outer.find((h) => h.id === activeIcon.host);
  // O ícone aberto ainda está na carta (ex.: não foi trocado depois de abrir)?
  const icon = host?.icon && activeIcon && choiceKey(host.icon) === choiceKey(activeIcon.icon) ? host.icon : null;
  const inner = host && icon ? iconHandles(spec, card, icon, host) : [];
  const handles = [...outer, ...inner];
  return { spec, handles, icon, selectedHandle: handles.find((h) => h.id === editor.selected) };
}

// ── Carta com as caixas ───────────────────────────────────────────────────────

/**
 * A carta montada com as caixas arrastáveis por cima (canto: tamanho; Shift: um eixo só) e as setas movendo a
 * selecionada (Shift = 10 px, Alt = 0,1 px, em unidades da carta).
 */
export function EditorCanvas({
  editor,
  card,
  width,
  referenceOpacity = 0,
  showBoxes = true,
  iconOnly = false,
}: {
  editor: ConfigEditor;
  card: CustomCard;
  width: number;
  referenceOpacity?: number;
  showBoxes?: boolean;
  /** Só as caixas de dentro do ícone aberto (aba Ícones): as do layout não aparecem, para não mexer nele sem querer. */
  iconOnly?: boolean;
}) {
  const state = editorState(editor, card);
  const { spec, selectedHandle } = state;
  const handles = iconOnly ? state.handles.filter((h) => h.target.kind === 'icon') : state.handles;
  const scale = width / CARD_W;
  const drag = useRef<{ handle: Handle; drives: Drive[]; start: { x: number; y: number }; orig: number[] } | null>(null);
  const setValueRef = useRef(editor.setValue);
  setValueRef.current = editor.setValue;

  const startDrag = (e: ReactPointerEvent, handle: Handle, drives: Drive[]) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    editor.select(handle);
    drag.current = { handle, drives, start: { x: e.clientX, y: e.clientY }, orig: drives.map((d) => driveValue(handle, d.path)) };
  };
  const onDragMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const delta = { x: (e.clientX - d.start.x) / scale, y: (e.clientY - d.start.y) / scale };
    if (e.shiftKey) {
      // Shift: só no eixo de maior movimento.
      if (Math.abs(delta.x) > Math.abs(delta.y)) delta.y = 0;
      else delta.x = 0;
    }
    d.drives.forEach((drive, i) => editor.setValue(d.handle.target, d.handle.root, drive.path, round(d.orig[i] + delta[drive.axis] * drive.k, drive.k)));
  };
  const endDrag = () => {
    drag.current = null;
  };

  useEffect(() => {
    if (!selectedHandle) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, select, textarea')) return;
      const dir = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[e.key];
      if (!dir) return;
      e.preventDefault();
      const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const delta = { x: dir[0] * step, y: dir[1] * step };
      for (const drive of selectedHandle.move) {
        if (!delta[drive.axis]) continue;
        const v = driveValue(selectedHandle, drive.path);
        setValueRef.current(selectedHandle.target, selectedHandle.root, drive.path, round(v + delta[drive.axis] * drive.k, drive.k));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedHandle]);

  // Remonta a carta quando muda o estilo dos textos (o ajuste do tamanho do texto só roda ao montar).
  const t = card.type;
  const fitKey = JSON.stringify([spec.id, spec.name[t], spec.characteristics, spec.textBox[t], spec.flavor[t]]);

  return (
    <div className="relative shrink-0 select-none" style={{ width, height: width * (CARD_H / CARD_W) }} onClick={() => editor.select(null)}>
      <CardRender key={fitKey} card={card} width={width} referenceOpacity={referenceOpacity} />
      {showBoxes && (
        <div className="absolute inset-0" onPointerMove={onDragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
          {handles.map((h) => {
            const on = h.id === editor.selected;
            const isInner = h.target.kind === 'icon';
            // As caixas de dentro do ícone ficam sempre por cima da caixa dele (mesmo selecionada), senão não dá para pegá-las.
            const outline = isInner
              ? on
                ? 'z-40 bg-fuchsia-400/15 outline-2 outline-fuchsia-300'
                : 'z-30 outline-1 outline-fuchsia-400 hover:bg-fuchsia-400/10'
              : on
                ? 'z-20 bg-accent/10 outline-2 outline-accent'
                : 'outline-1 outline-sky-400/80 hover:bg-sky-400/10';
            return (
              <div
                key={h.id}
                title={h.label}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => startDrag(e, h, h.move)}
                className={`absolute cursor-move ${outline} ${h.dashed ? 'outline-dashed' : 'outline'}`}
                style={{ left: h.box.x * scale, top: h.box.y * scale, width: h.box.w * scale, height: h.box.h * scale }}
              >
                {on && (
                  <span className="pointer-events-none absolute -top-5 left-0 whitespace-nowrap rounded bg-accent px-1 text-[10px] font-semibold text-bg">
                    {h.label}
                  </span>
                )}
                {h.resize && (
                  <span
                    onPointerDown={(e) => startDrag(e, h, h.resize!)}
                    className={`absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-nwse-resize rounded-sm ring-1 ring-bg ${isInner ? 'bg-fuchsia-400' : 'bg-accent'}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Campos ────────────────────────────────────────────────────────────────────

/** Botão ✎ que abre a configuração de um ícone. */
/**
 * Quem abre um ícone na aba Ícones (o editor de layouts): com ele, o ✎ leva o ícone para lá, em vez de abrir a
 * configuração dele no lugar.
 */
export const OpenIconContext = createContext<((icon: IconChoice) => void) | null>(null);

export function IconEditButton({ editor, icon, host }: { editor: ConfigEditor; icon: IconChoice; host: string }) {
  const openElsewhere = useContext(OpenIconContext);
  const on = editor.activeIcon && choiceKey(editor.activeIcon.icon) === choiceKey(icon);
  return (
    <button
      type="button"
      title={openElsewhere ? `Editar o ícone ${choiceKey(icon)} na aba Ícones` : `Editar o ícone ${choiceKey(icon)}`}
      onClick={() => (openElsewhere ? openElsewhere(icon) : editor.editIcon(icon, host))}
      className={`rounded px-1.5 py-0.5 text-xs ring-1 ${on ? 'bg-fuchsia-500/20 text-fuchsia-300 ring-fuchsia-400' : 'text-muted ring-border hover:text-text'}`}
    >
      ✎
    </button>
  );
}

/** Ícones com caixa fixa e a imagem enquadrada dentro dela (`art`): a imagem nova pode ter qualquer tamanho. */
export const FRAMED_ICON_GROUPS: ReadonlySet<IconGroup> = new Set(['type', 'type-variant', 'element', 'cost']);

/**
 * Imagem nova num ícone com caixa: encaixa inteira na caixa (sem cortar, centrada), mantendo a proporção da imagem.
 * Fica como alteração pendente (Salvar grava), para quem enviou ajustar o enquadramento antes.
 */
export function fitIconImage(editor: ConfigEditor, icon: IconChoice, root: Obj, size: { w: number; h: number }) {
  if (!FRAMED_ICON_GROUPS.has(icon.group) || !size.w || !size.h) return;
  const target: ConfigTarget = { kind: 'icon', group: icon.group, id: icon.id };
  const box = Number(root.aspect) || 1;
  const ratio = size.h / size.w;
  const w = ratio <= box ? 1 : box / ratio;
  const h = w * ratio;
  const r = (v: number) => Math.round(v * 10000) / 10000;
  editor.setValue(target, root, ['art', 'x'], r((1 - w) / 2));
  editor.setValue(target, root, ['art', 'y'], r((box - h) / 2));
  editor.setValue(target, root, ['art', 'w'], r(w));
  // Tipo e elemento guardam a altura da imagem; o custo segue a proporção dela.
  if (icon.group !== 'cost') editor.setValue(target, root, ['art', 'h'], r(h));
}

/**
 * Campos do ícone aberto e do layout da carta (do tipo dela; sem `layoutFields`, só os do ícone, como na aba Ícones).
 * A seção da caixa selecionada abre sozinha.
 */
export function EditorFields({
  editor,
  card,
  layoutFields = true,
  iconFields = true,
}: {
  editor: ConfigEditor;
  card: CustomCard;
  layoutFields?: boolean;
  /** Sem os campos do ícone aberto (o editor de layouts deixa os ícones para a aba Ícones). */
  iconFields?: boolean;
}) {
  const { spec, icon, selectedHandle } = editorState(editor, card);
  const content = useOptionalContent();
  const iconRoot = icon ? iconObject(icon) : undefined;
  const { changes } = editor;
  const layoutTarget: ConfigTarget = { kind: 'layout', id: spec.id };

  const renderSections = (sections: Section[], target: ConfigTarget, root: Obj, openKey: string | undefined) =>
    sections.map((s) => (
      <details key={`${targetKey(target)}:${s.key}`} open={openKey === s.key || undefined} className="rounded-lg bg-surface px-3 py-2 ring-1 ring-border">
        <summary className="cursor-pointer text-sm font-semibold">
          {fieldLabel(s.key)}
          {sectionDirty(s, changes, target, root) && <span className="ml-2 text-accent">●</span>}
        </summary>
        <div className="mt-2">
          <FieldTree
            value={s.value}
            path={s.path}
            isDirty={(p) => changeKey(target, p) in changes || changeKey(target, p.slice(0, -1)) in changes}
            onChange={(p, v) => editor.setValue(target, root, p, v)}
          />
        </div>
      </details>
    ));

  return (
    <div className="flex flex-col gap-2">
      {iconFields && icon && iconRoot && (
        <div className="flex flex-col gap-2 rounded-lg p-2 ring-1 ring-fuchsia-400/60">
          <p className="text-xs text-muted">
            <span className="font-semibold text-text">Ícone {icon.id}</span> — <code>{choiceKey(icon)}</code>. Medidas relativas ao próprio
            ícone: valem em todos os layouts. <ContentHistoryButton kind="icon" id={choiceKey(icon)} />
          </p>
          <AssetSwapButton
            label="Imagem"
            url={typeof iconRoot.url === 'string' ? iconRoot.url : undefined}
            exactSize={!FRAMED_ICON_GROUPS.has(icon.group)}
            onUploaded={(size) => fitIconImage(editor, icon, iconRoot, size)}
            // Ícone criado no editor: a imagem nova vai para a pasta dele (a do ícone copiado fica como está).
            {...(iconRoot.created === true && {
              ownPath: `icons/custom/${icon.group}-${icon.id}.webp`,
              deployFallback: false,
              onRelocated: async (url: string) => {
                const target: ConfigTarget = { kind: 'icon', group: icon.group, id: icon.id };
                setAt(iconRoot, ['url'], url);
                const { version } = await saveConfigChanges([{ target, path: ['url'], value: url }]);
                content?.saved(version);
              },
            })}
          />
          {renderSections(
            iconSections(iconRoot),
            { kind: 'icon', group: icon.group, id: icon.id },
            iconRoot,
            selectedHandle?.target.kind === 'icon' ? selectedHandle.section : undefined,
          )}
        </div>
      )}
      {layoutFields && (
      <>
      <p className="text-xs text-muted">
        {spec.label}, campos do tipo {CARD_TYPE_LABEL[card.type]} — <code>{spec.id}</code>. Vale para todas as cartas do layout; um valor
        igual em vários tipos de carta muda em todos eles. <ContentHistoryButton kind="layout" id={spec.id} />
      </p>
      {renderSections(
        layoutSections(spec, card.type),
        layoutTarget,
        spec as unknown as Obj,
        selectedHandle?.target.kind === 'layout' ? selectedHandle.section : undefined,
      )}
      </>
      )}
      {editor.dirtyCount > 0 && (
        <details className="rounded-lg px-3 py-2 text-xs ring-1 ring-border">
          <summary className="cursor-pointer text-muted">Alterações pendentes ({editor.dirtyCount})</summary>
          <ul className="mt-1 flex flex-col gap-0.5 font-mono">
            {Object.entries(changes).map(([k, c]) => (
              <li key={k}>
                {targetKey(c.target)} {c.path.join('.')} = {String(c.value)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
