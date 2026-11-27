import type { CardType } from '../../../models/card.ts';
import { ATTRIBUTE_PAIR_DEFAULT, ATTRIBUTE_TEXT_WRAP_DEFAULT, attributeSymbolDefault } from '../icons/defaults.ts';
import type { AttributeFrame, CardElement, ElementVariant, EntranceIcon, HandIcon, Village } from '../model.ts';
import {
  CHAKRA_ICON,
  COMBAT_ATTRIBUTE_ICONS,
  COST_ICONS,
  ELEMENT_ICONS,
  ICON_ASSETS,
  TYPE_ICONS,
  TYPE_ICON_VARIANTS,
  VILLAGE_CANVAS,
  VILLAGE_CANVAS_DEFAULT,
  type CostIconConfig,
  type IconSideLabel,
  type IconTextAlign,
  type NamedIconConfig,
} from '../icons/index.ts';
import type { IconBox, IconPlacement, LayoutSpec } from './types.ts';
import { COMBAT_ATTRIBUTES_PTBR } from '../../../data/ptbr/glossary.ts';

/**
 * O que é comum a todos os layouts: tamanho da carta, assets e as funções que põem cada ícone na
 * posição e no tamanho do layout. A configuração de cada ícone (proporção, textos, números) fica em
 * src/lib/cardMaker/icons/, um arquivo por ícone.
 */

export const CARD_W = 750;
export const CARD_H = 1050;

export const ASSETS = '/card-layouts';

/** Mesmo valor para os quatro tipos (layouts que só têm Ninja preenchem os demais com o do Ninja). */
export const forAllTypes = <T>(value: T): Record<CardType, T> => ({ ninja: value, client: value, jutsu: value, mission: value });

/** Mancha de pincel atrás do nome (gerada por scripts/generate-name-banner.py; 1000×92). */
export const NAME_BANNER_URL = `${ICON_ASSETS}/banner/name-banner-01.webp`;
export const NAME_BANNER_ASPECT = 92 / 1000;

/** Caixa de um ícone com a proporção dele (altura / largura). */
const boxOf = (p: IconPlacement, aspect: number): IconBox => ({ x: p.x, y: p.y, w: p.size, h: p.size * aspect });

// ── Molduras e painéis ────────────────────────────────────────────────────────

/** Nome do arquivo por tipo: Ninja e Cliente dividem a moldura nos layouts que têm os dois. */
export const PART_NAME: Record<CardType, string> = {
  ninja: 'ninja-client',
  client: 'ninja-client',
  jutsu: 'jutsu',
  mission: 'mission',
};

export const layoutAsset = (layout: string, file: string) => `${ASSETS}/${layout}/${file}.webp`;

// ── Tipo e elementos: arte + nome escrito de lado ─────────────────────────────

/** Ícone já posicionado na carta: imagem, caixa da arte e o nome (posição e tamanho em unidades da carta). */
export interface PlacedIcon {
  url: string;
  art: { x: number; y: number; w: number; h: number };
  label: IconSideLabel;
}

function place(box: IconBox, icon: NamedIconConfig): PlacedIcon {
  const k = box.w;
  const { art, label } = icon;
  return {
    url: icon.url,
    art: { x: box.x + art.x * k, y: box.y + art.y * k, w: art.w * k, h: art.h * k },
    label: { ...label, cx: box.x + label.cx * k, cy: box.y + label.cy * k, cap: label.cap * k, length: label.length * k },
  };
}

/** Ícones alternativos do tipo (`TYPE_ICON_VARIANTS`); vazio se o tipo só tem o padrão. */
export function typeIconVariants(type: CardType): { id: string; label: string }[] {
  return (TYPE_ICON_VARIANTS[type] ?? []).map(({ id, label }) => ({ id, label }));
}

/**
 * Ícone do tipo na posição e no tamanho do layout: o alternativo escolhido (`variant`) ou o padrão
 * (também quando o tipo não tem esse alternativo, ex.: depois de trocar o tipo da carta).
 */
export function typeIcon(spec: LayoutSpec, type: CardType, variant?: string): PlacedIcon {
  const alt = variant ? TYPE_ICON_VARIANTS[type]?.find((v) => v.id === variant) : undefined;
  const icon = alt?.icon ?? TYPE_ICONS[type];
  return place(boxOf(spec.typeIcon[type], icon.aspect), icon);
}

/** Quantos elementos uma carta pode ter, em qualquer layout (um abaixo do outro, a cada `slotDy`). */
export const MAX_ELEMENTS = 3;

/**
 * Variantes que existem para o elemento (as impressas, 01 a 03, e as criadas no editor; o Vazio só tem a 01), em ordem
 * numérica.
 */
export function elementVariants(element: CardElement['element']): ElementVariant[] {
  return Object.keys(ELEMENT_ICONS)
    .filter((key) => key.startsWith(`${element}-`))
    .map((key) => key.slice(element.length + 1))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

/** Configuração do ícone do elemento (a variante pedida, ou a 01 se ela não existir). */
function elementConfig({ element, variant }: CardElement): { key: string; icon: NamedIconConfig } {
  const key = `${element}-${elementVariants(element).includes(variant) ? variant : '01'}`;
  return { key, icon: ELEMENT_ICONS[key] };
}

export const elementIconUrl = (el: CardElement) => elementConfig(el).icon.url;

/** Caixa do ícone no 1º espaço do layout. */
function firstSlotBox(spec: LayoutSpec, el: CardElement): IconBox {
  const { key, icon } = elementConfig(el);
  return boxOf(spec.elements.overrides?.[key] ?? spec.elements.pos, icon.aspect);
}

/**
 * Caixa do elemento no espaço `slot` (0, 1, 2…). Cada espaço fica `slotDy` abaixo do anterior e se
 * alinha horizontalmente com o 1º (`first`): os centros coincidem, mesmo com ícones de larguras diferentes.
 */
export function elementBox(spec: LayoutSpec, el: CardElement, slot: number, first?: CardElement): IconBox {
  const box = firstSlotBox(spec, el);
  const y = box.y + slot * spec.elements.slotDy;
  if (slot === 0 || !first) return { ...box, y };
  const anchor = firstSlotBox(spec, first);
  return { ...box, x: anchor.x + anchor.w / 2 - box.w / 2, y };
}

/**
 * Onde fica o ícone customizado (`CustomCard.customIcon`): no espaço logo abaixo do último elemento da carta (o 1º
 * espaço, se ela não tem elemento), com o topo no topo do espaço e o centro alinhado com o do 1º elemento. `w` é a
 * largura escolhida; a altura segue a proporção da imagem.
 */
export function customIconBox(spec: LayoutSpec, elements: CardElement[], size: number): { x: number; y: number; w: number } {
  const slot = Math.min(elements.length, MAX_ELEMENTS);
  const anchor = elements[0] ? firstSlotBox(spec, elements[0]) : boxOf(spec.elements.pos, 1);
  return { x: anchor.x + anchor.w / 2 - size / 2, y: anchor.y + slot * spec.elements.slotDy, w: size };
}

/** Ícone do elemento no espaço `slot` (arte + nome), como em `elementBox`. */
export function elementIcon(spec: LayoutSpec, el: CardElement, slot: number, first?: CardElement): PlacedIcon {
  return place(elementBox(spec, el, slot, first), elementConfig(el).icon);
}

// ── Números sobre ícones ──────────────────────────────────────────────────────

/** Número já posicionado na carta (centro, fonte e contorno em unidades da carta). */
export interface PlacedNumber {
  cx: number;
  cy: number;
  size: number;
  strokeWidth: number;
  color: string;
  stroke: string;
  align?: IconTextAlign;
}

/** Imagem do ícone de custo dentro da caixa dele (`CostIconConfig.art`; sem valor, a largura inteira da caixa). */
export function costArt(icon: CostIconConfig): { x: number; y: number; w: number } {
  return { x: 0, y: 0, w: 1, ...icon.art };
}

// ── Custos ────────────────────────────────────────────────────────────────────

/**
 * Ícone de custo de entrada ou de mão na posição do layout. O `size` do layout só muda a imagem: o número
 * acompanha o centro do ícone, mas a fonte e o contorno são os do arquivo do ícone, em pixels da carta.
 */
export function costIcon(
  placement: IconPlacement,
  id: EntranceIcon | HandIcon,
): { url: string; box: IconBox; image: Omit<IconBox, 'h'>; number: PlacedNumber } {
  // Ícone que não existe mais (criado no editor e excluído): o primeiro do mesmo tipo.
  const icon = COST_ICONS[id] ?? COST_ICONS[id.startsWith('hand-') ? 'hand-01' : 'entrance-01'];
  const box = boxOf(placement, icon.aspect);
  const n = icon.number;
  const art = costArt(icon);
  return {
    url: icon.url,
    box,
    image: { x: box.x + art.x * box.w, y: box.y + art.y * box.w, w: art.w * box.w },
    number: {
      align: n.align,
      cx: box.x + n.x * box.w,
      cy: box.y + n.y * box.h,
      size: n.size,
      strokeWidth: n.strokeWidth,
      color: n.color,
      stroke: n.stroke,
    },
  };
}

/**
 * Chakra genérico na linha do custo do Jutsu, com largura `size`: o espaço que ocupa na linha (`inline`),
 * a imagem e o número, relativos a esse espaço.
 */
export function chakraIcon(size: number): {
  url: string;
  inline: { w: number; h: number };
  image: IconBox;
  number: PlacedNumber;
} {
  const icon = CHAKRA_ICON;
  const w = size;
  const h = size * icon.aspect;
  const left = icon.inline.x * w;
  const top = icon.inline.y * h;
  const n = icon.number;
  return {
    url: icon.url,
    inline: { w: icon.inline.w * w, h: icon.inline.h * h },
    image: { x: -left, y: -top, w, h },
    number: { cx: n.x * w - left, cy: n.y * h - top, size: n.size * w, strokeWidth: n.strokeWidth * w, color: n.color, stroke: n.stroke, align: n.align },
  };
}

// ── Atributo de Combate ───────────────────────────────────────────────────────

/**
 * Atributos de Combate com kanji em card-layouts/icons/attributes: arquivo → nome como impresso nas
 * cartas ("martial-arts" → "Martial Arts"; "unknown" → "?"). Ao adicionar um arquivo, inclua-o aqui.
 */
export const ATTRIBUTE_NAMES: Readonly<Record<string, string>> = {
  'absorption': 'Absorption',
  'bat': 'Bat',
  'bee': 'Bee',
  'bomb': 'Bomb',
  'bone': 'Bone',
  'brush': 'Brush',
  'bubble': 'Bubble',
  'control': 'Control',
  'cooking': 'Cooking',
  'crystal': 'Crystal',
  'curse': 'Curse',
  'decode': 'Decode',
  'delivery': 'Delivery',
  'face': 'Face',
  'fang': 'Fang',
  'flame': 'Flame',
  'food': 'Food',
  'fool': 'Fool',
  'genjutsu': 'Genjutsu',
  'gravity': 'Gravity',
  'hair': 'Hair',
  'ice': 'Ice',
  'ink': 'Ink',
  'insect': 'Insect',
  'iron': 'Iron',
  'labyrinth': 'Labyrinth',
  'lava': 'Lava',
  'magic': 'Magic',
  'magnet': 'Magnet',
  'manipulation': 'Manipulation',
  'martial-arts': 'Martial Arts',
  'medicine': 'Medicine',
  'mind': 'Mind',
  'mist': 'Mist',
  'money': 'Money',
  'mud': 'Mud',
  'nail': 'Nail',
  'ninjutsu': 'Ninjutsu',
  'oil': 'Oil',
  'paper': 'Paper',
  'peacock': 'Peacock',
  'pig': 'Pig',
  'power': 'Power',
  'prophecy': 'Prophecy',
  'running': 'Running',
  'sand': 'Sand',
  'sand-iron': 'Sand Iron',
  'seal': 'Seal',
  'shadow': 'Shadow',
  'slime': 'Slime',
  'smoke': 'Smoke',
  'snake': 'Snake',
  'soft': 'Soft',
  'soft-body': 'Soft body',
  'sound': 'Sound',
  'speech': 'Speech',
  'spider': 'Spider',
  'spirit': 'Spirit',
  'steal': 'Steal',
  'steam': 'Steam',
  'stitch': 'Stitch',
  'stone': 'Stone',
  'taijutsu': 'Taijutsu',
  'thunderbolt': 'Thunderbolt',
  'tree': 'Tree',
  'unknown': '?',
  'water': 'Water',
  'weapon': 'Weapon',
  'wisdom': 'Wisdom',
};

/** Atributo em PT-BR → como impresso (o primeiro, quando dois impressos têm a mesma tradução). */
const ATTRIBUTE_EN_BY_PTBR: ReadonlyMap<string, string> = new Map(
  Object.entries(COMBAT_ATTRIBUTES_PTBR)
    .reverse()
    .map(([en, pt]) => [pt, en]),
);

/** Arquivos de kanji existentes. */
export const ATTRIBUTE_KANJI: ReadonlySet<string> = new Set(Object.keys(ATTRIBUTE_NAMES));

/** Quantos atributos uma carta pode ter (os trios do S25 têm 3). */
export const MAX_ATTRIBUTES = 3;

/** Arquivo do kanji de um atributo ("Sand Iron" → sand-iron; "?" → unknown). */
export function attributeSlug(name: string): string {
  // O conteúdo do jogo guarda o atributo em PT-BR ("Arma"); o arquivo tem o nome impresso, em inglês ("weapon").
  const trimmed = ATTRIBUTE_EN_BY_PTBR.get(name.trim()) ?? name.trim();
  if (trimmed === '?') return 'unknown';
  return trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Nomes dos atributos escritos no campo (dois atributos separados por "/", como "Genjutsu/Tree"). */
export const attributeNames = (label: string) =>
  label
    .split('/')
    .map((n) => n.trim())
    .filter(Boolean);

/** Atributo que é só um símbolo, sem letras (ex.: "?"): aparece só o símbolo, sem o nome embaixo. */
export function attributeSymbolOnly(label: string): boolean {
  return attributeNames(label).length <= 1 && label.trim() !== '' && !/\p{L}/u.test(label);
}

/**
 * Imagens dos kanjis do(s) atributo(s), na ordem. `null` se algum nome não tiver imagem (aí a carta
 * usa o kanji digitado das cartas antigas, se houver).
 */
export function attributeKanjiUrls(label: string): string[] | null {
  const slugs = attributeNames(label).map(attributeSlug);
  if (!slugs.length || slugs.some((s) => !ATTRIBUTE_KANJI.has(s))) return null;
  return slugs.map((s) => `${ICON_ASSETS}/attributes/${s}.webp`);
}

/** Moldura do Atributo de Combate (a 01 se ela não existe mais, ex.: criada no editor e excluída). */
function attributeConfig(frame: AttributeFrame) {
  return COMBAT_ATTRIBUTE_ICONS[frame] ?? COMBAT_ATTRIBUTE_ICONS['01'];
}

/** Escala da tela do ícone do atributo para a carta, no tamanho do layout. */
function attributeScale(spec: LayoutSpec, frame: AttributeFrame) {
  return spec.attribute.size / attributeConfig(frame).canvas.w;
}

/** Centro e raio do círculo (ou losango) da moldura na carta. */
export function attributeCircle(spec: LayoutSpec, frame: AttributeFrame) {
  const k = attributeScale(spec, frame);
  const c = attributeConfig(frame).circle;
  return { cx: spec.attribute.x + c.cx * k, cy: spec.attribute.y + c.cy * k, r: c.r * k };
}

/** Ícone do Atributo de Combate na carta: imagem, círculo, números de força e estilos do nome e do kanji. */
export function attributeIcon(spec: LayoutSpec, frame: AttributeFrame) {
  const icon = attributeConfig(frame);
  const k = attributeScale(spec, frame);
  const { x, y } = spec.attribute;
  const p = icon.power;
  const at = (pt: { x: number; y: number }): PlacedNumber => ({
    cx: x + pt.x * k,
    cy: y + pt.y * k,
    size: p.size * k,
    strokeWidth: p.strokeWidth * k,
    color: p.color,
    stroke: p.stroke,
    align: p.align,
  });
  return {
    url: icon.url,
    box: { x, y, w: icon.canvas.w * k, h: icon.canvas.h * k } as IconBox,
    circle: attributeCircle(spec, frame),
    healthy: at(p.healthy),
    injured: at(p.injured),
    /** `size` já em unidades da carta; `strokeWidth` já vem em unidades da carta. */
    label: { ...icon.label, size: icon.label.size * k },
    kanji: icon.kanji,
    /** Dois atributos (frações do raio). */
    pair: { ...ATTRIBUTE_PAIR_DEFAULT, ...icon.pair },
    /** Atributo só com símbolo, como "?" (frações do raio). */
    symbol: attributeSymbolDefault(icon),
    /** Texto de efeito contornando a silhueta (`margin` em pixels da carta, sem escala). */
    textWrap: { ...ATTRIBUTE_TEXT_WRAP_DEFAULT, ...icon.textWrap },
  };
}

// ── Vila ──────────────────────────────────────────────────────────────────────

/**
 * Posição de cada vila quando há mais de uma, relativa ao lugar de uma vila só: deslocamento do
 * centro (em frações do tamanho do ícone) e escala. 2 vilas: na diagonal (a primeira em cima, à
 * esquerda); 3: em triângulo (uma em cima, duas embaixo).
 */
export const VILLAGE_ARRANGEMENTS: Record<number, { dx: number; dy: number; scale: number }[]> = {
  1: [{ dx: 0, dy: 0, scale: 1 }],
  2: [
    { dx: -0.16, dy: -0.16, scale: 0.66 },
    { dx: 0.16, dy: 0.16, scale: 0.66 },
  ],
  3: [
    { dx: 0, dy: -0.23, scale: 0.55 },
    { dx: -0.28, dy: 0.23, scale: 0.55 },
    { dx: 0.28, dy: 0.23, scale: 0.55 },
  ],
};

/**
 * Caixa do ícone de vila: a tela padrão na posição do layout; telas de outro formato ficam centradas nela.
 * Com várias vilas, `index` de `count` segue `VILLAGE_ARRANGEMENTS`.
 */
export function villageBox(spec: LayoutSpec, village: Village, index = 0, count = 1): IconBox {
  const { x, y, size } = spec.village;
  const slot = (VILLAGE_ARRANGEMENTS[count] ?? VILLAGE_ARRANGEMENTS[1])[index] ?? VILLAGE_ARRANGEMENTS[1][0];
  const k = (size / VILLAGE_CANVAS_DEFAULT.w) * slot.scale;
  const canvas = VILLAGE_CANVAS[village] ?? VILLAGE_CANVAS_DEFAULT;
  const w = canvas.w * k;
  const h = canvas.h * k;
  const cx = x + size / 2 + slot.dx * size;
  const cy = y + (VILLAGE_CANVAS_DEFAULT.h * (size / VILLAGE_CANVAS_DEFAULT.w)) / 2 + slot.dy * size;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
