import { cardImageUrl, type Card, type CardType, type ElementSymbol } from '../../models/card.ts';
import {
  cardArtUrl,
  type ArtLayer,
  type AttributeFrame,
  type CardArtPlacement,
  type CardLayoutInfo,
  type ElementVariant,
  type EntranceIcon,
  type HandIcon,
  type LayoutId,
  type NameWrap,
} from '../../models/cardLayout.ts';
import { getLayout } from './layouts/index.ts';
import { CHARACTERISTICS_PTBR } from '../../data/ptbr/glossary.ts';

/**
 * Carta criada no criador de cartas (`/criar`). No montador de decks ela vira uma carta do catálogo
 * (`customCardToCard` em `deckCard.ts`). Fica no localStorage e vai junto com o deck para as salas e os
 * compartilhamentos (`sharedCard.ts`); a arte fica no Vercel Blob (`artUpload.ts`).
 * Os valores ficam como texto (ex.: custo "X", força "7/2") porque a carta é montada como impressa.
 */

export type { ArtLayer, AttributeFrame, ElementVariant, EntranceIcon, HandIcon, LayoutId, NameWrap };

/** Símbolos de vila (arquivos `village-<vila>` e `village-<vila>-rogue` em card-layouts/icons/village). */
export const VILLAGES = [
  'leaf',
  'sand',
  'mist',
  'sound',
  'cloud',
  'stone',
  'rain',
  'grass',
  'waterfall',
  'snow',
  'star',
  'hot-water',
  'moon',
  'whirlpool',
  'lock',
  'artisan',
  'nadeshiko',
] as const;
export type Village = (typeof VILLAGES)[number];

/** Uma vila à esquerda do nome, com ou sem o símbolo de renegado (a vila riscada). */
export interface VillageMark {
  village: Village;
  rogue: boolean;
}

/** Quantas vilas cabem à esquerda do nome (2 ficam na diagonal, 3 em triângulo). */
export const MAX_VILLAGES = 3;

export interface CardElement {
  element: ElementSymbol;
  variant: ElementVariant;
}


/** Deslocamento em unidades da carta (750×1050) e zoom sobre o enquadramento "cobrir" (`CardArtPlacement`). */
export interface CustomCardArt extends Omit<CardArtPlacement, 'src'> {
  /**
   * Endereço da arte no Vercel Blob (enviada pelo jogador), data URL tratado enquanto ainda não foi enviada
   * (`artUpload.ts`), URL da arte extraída de uma carta do catálogo (`cardArtUrl`), ou null sem arte.
   */
  src: string | null;
}

/**
 * Ícone customizado (imagem enviada pelo jogador), logo abaixo do último ícone de elemento (`customIconBox` em
 * layouts/shared.ts). `size` é a largura em pixels da carta; a altura segue a proporção da imagem.
 */
export interface CustomCardIcon {
  /** Endereço no Vercel Blob, ou data URL tratado enquanto ainda não foi enviado (`artUpload.ts`). */
  src: string;
  size: number;
}

/** Faixa da largura do ícone customizado, em pixels da carta (750×1050). */
export const CUSTOM_ICON_SIZE = { min: 30, max: 320 } as const;

export interface CustomCard {
  id: string;
  layout: LayoutId;
  type: CardType;
  name: string;
  /** Elementos empilhados no canto superior direito (quantos cabem depende do layout: 2 ou 3). */
  elements: CardElement[];
  flavor: string;
  /** Texto de efeito: um bloco por linha (como `text` dos dados das cartas). */
  text: string;
  /** Ninja e Cliente. */
  characteristics: string[];
  /** Ninja e Cliente: símbolos de vila à esquerda do nome (até `MAX_VILLAGES`). Ler com `cardVillages`. */
  villages?: VillageMark[];
  /** @deprecated Cartas antigas (uma vila só); `cardVillages` converte. */
  village?: Village | null;
  /** @deprecated Cartas antigas: renegado da `village`. */
  villageRogue?: boolean;
  /** Ninja, Cliente e Missão. Texto livre ("0", "3", "X"). */
  entranceCost: string;
  handCost: string;
  entranceIcon: EntranceIcon;
  handIcon: HandIcon;
  /** Ninja: força "Combate/Suporte" saudável e ferido. */
  healthy: string;
  injured: string;
  /**
   * Atributo de Combate: moldura das kunais e nome(s) — dois atributos separados por "/"
   * ("Genjutsu/Tree"). O kanji vem da imagem do atributo (card-layouts/icons/attributes);
   * `kanji` é o texto digitado das cartas antigas, usado só se o nome não tiver imagem.
   */
  attribute: { frame: AttributeFrame; label: string; kanji?: string };
  /**
   * Jutsu: símbolos de elemento exigidos + Chakra genérico ("1", "X", ou vazio para nenhum).
   * `alternatives`: custos impressos depois de "or" (ex.: "土 | ① or ③"). Opcional: cartas antigas não têm.
   */
  jutsuCost: JutsuCostPart & { alternatives?: JutsuCostPart[] };
  /** Arte de fundo: fica atrás da moldura. */
  art: CustomCardArt;
  /**
   * Arte da frente (opcional): fica na frente da moldura e atrás do painel — ex.: o personagem
   * recortado saindo da moldura. Precisa de transparência.
   */
  artFront?: CustomCardArt;
  /** Arrastar e zoom movem as duas camadas juntas (padrão: sim). */
  artLinked?: boolean;
  /** Ícone customizado abaixo dos elementos (vale também nas alters). Sem valor: nenhum. */
  customIcon?: CustomCardIcon;
  /** Mancha preta atrás do nome (layouts com o nome no topo). Sem valor: o padrão do layout. */
  nameBanner?: boolean;
  /** Linha acima do texto de efeito (`LayoutSpec.textDivider`). Sem valor: o padrão do layout. */
  textDivider?: boolean;
  /**
   * Ajuste da fonte do nome, em pixels da carta, sobre o tamanho do layout (`NameStyle.size`):
   * negativo diminui, positivo aumenta. 0 (ou sem valor, nas cartas antigas): o tamanho do layout.
   */
  nameSize?: number;
  /** Quebra de linha do nome (`NameWrap`): automática, uma linha só ou duas linhas. Sem valor: automática. */
  nameWrap?: NameWrap;
  /** Versão alternativa do painel de dados (`LayoutSpec.panelVariants`). Sem valor: o painel padrão. */
  panelVariant?: string;
  /** Ícone alternativo do tipo (`TYPE_ICON_VARIANTS` em icons/index.ts). Sem valor: o ícone padrão. */
  typeVariant?: string;
  /** Imagem da carta original, quando importada do catálogo (para comparar o mapeamento). */
  reference?: string;
  /**
   * Posições ajustadas só nesta carta (**Ajustar posições** no criador), por cima da configuração do layout: caminho
   * do campo no layout (ex.: `name.ninja.cy`, `cost.ninja.entrance.x`) → valor, em pixels da carta. O layout não
   * muda (`cardLayout` em layouts/index.ts aplica na hora de montar). Trocar de layout apaga os ajustes.
   */
  layoutOverrides?: Record<string, number>;
  /**
   * Id da carta do catálogo de onde a carta foi importada (Importar do catálogo). Com valor, a carta salva aparece
   * como arte alternativa no detalhe dessa carta (`src/lib/altCards.ts`).
   */
  source?: string;
  /**
   * Frase que já vem impressa na arte de fundo (carta do catálogo com a impressa de fundo, `print`). Com valor, a
   * frase montada ganha um sombreado por trás que apaga de leve a impressa; o sombreado cobre o maior dos dois
   * blocos (a frase montada pode ter outro número de linhas, ex.: em PT-BR). Sem valor: sem sombreado.
   */
  printedFlavor?: string;
  /** Liga ou desliga o sombreado da frase (só vale com `printedFlavor`). Sem valor: ligado. */
  flavorShade?: boolean;
  /**
   * Carta de Token: no deck vai para a parte Tokens (1 cópia de cada, fora das 50 e do Reforço; `isTokenCard`).
   * Sem valor: não é Token.
   */
  token?: boolean;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_ART: CustomCardArt = { src: null, x: 0, y: 0, zoom: 1 };
const artKey = (layer: ArtLayer) => (layer === 'back' ? 'art' : 'artFront');

/** Camada de arte da carta (a da frente, se não existir, vem vazia). */
export function getArt(card: CustomCard, layer: ArtLayer): CustomCardArt {
  return (layer === 'back' ? card.art : card.artFront) ?? EMPTY_ART;
}

/** Camadas que o arrastar na prévia afeta: as duas quando estão ligadas, senão só a escolhida. */
function affectedLayers(card: CustomCard, layer: ArtLayer): ArtLayer[] {
  return card.artLinked ?? true ? ['back', 'front'] : [layer];
}

/** Desloca a arte ao arrastar na prévia (unidades da carta); respeita as camadas ligadas. */
export function moveArt(card: CustomCard, layer: ArtLayer, dx: number, dy: number): CustomCard {
  const next = { ...card };
  for (const l of affectedLayers(card, layer)) {
    const art = getArt(card, l);
    next[artKey(l)] = { ...art, x: art.x + dx, y: art.y + dy };
  }
  return next;
}

/** Ajusta posição e/ou zoom de uma camada só (controles da camada no editor). */
export function setArtFrame(
  card: CustomCard,
  layer: ArtLayer,
  frame: Partial<Pick<CustomCardArt, 'x' | 'y' | 'zoom'>>,
): CustomCard {
  return { ...card, [artKey(layer)]: { ...getArt(card, layer), ...frame } };
}

/** Volta uma camada para o enquadramento inicial (centralizada, sem zoom). */
export function resetArt(card: CustomCard, layer: ArtLayer): CustomCard {
  return setArtFrame(card, layer, { x: 0, y: 0, zoom: 1 });
}

/**
 * Troca a imagem de uma camada (null remove). Com as camadas ligadas, a nova imagem herda o
 * enquadramento da outra camada (para as duas ficarem alinhadas); senão começa centralizada.
 */
export function setArtImage(card: CustomCard, layer: ArtLayer, src: string | null): CustomCard {
  const other = getArt(card, layer === 'back' ? 'front' : 'back');
  const frame = (card.artLinked ?? true) && other.src ? { x: other.x, y: other.y, zoom: other.zoom } : {};
  const next: CustomCard = { ...card, [artKey(layer)]: { ...EMPTY_ART, ...frame, src } };
  // Outra arte de fundo: a frase impressa da original não está mais lá.
  if (layer === 'back') delete next.printedFlavor;
  return next;
}

/** Uma forma de pagar o custo do Jutsu: símbolos de elemento + Chakra genérico. */
export interface JutsuCostPart {
  symbols: ElementSymbol[];
  generic: string;
}

export function hasCharacteristics(type: CardType): boolean {
  return type === 'ninja' || type === 'client';
}

export function hasEntranceCost(type: CardType): boolean {
  return type !== 'jutsu';
}

export function newCustomCard(type: CardType = 'ninja', now = new Date().toISOString()): CustomCard {
  return {
    id: crypto.randomUUID(),
    layout: 'layout-01',
    type,
    name: '',
    elements: [{ element: 'fire', variant: '01' }],
    flavor: '',
    text: '',
    characteristics: [],
    villages: [],
    entranceCost: '0',
    handCost: '0',
    entranceIcon: 'entrance-01',
    handIcon: 'hand-01',
    healthy: '0/0',
    injured: '0/0',
    attribute: { frame: '01', label: '' },
    jutsuCost: { symbols: [], generic: '' },
    art: { src: null, x: 0, y: 0, zoom: 1 },
    nameSize: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/** Menor fonte do nome, em pixels da carta, por mais negativo que seja o ajuste (`nameSize`). */
const MIN_NAME_FONT_SIZE = 4;

/** Nome de cada opção de quebra de linha do nome (seletores do criador e da aba Layout). */
export const NAME_WRAP_LABEL: Record<NameWrap, string> = {
  auto: 'Automática',
  single: 'Uma linha só',
  break: 'Duas linhas',
};

/**
 * Nome com a quebra de linha escolhida (`NameWrap`): em `break`, sem quebra digitada, quebra antes do parêntese
 * final ("Hinata Hyuga (Quimono)") ou no espaço mais perto do meio; em `single`, tira as quebras digitadas.
 */
export function wrapName(name: string, wrap: NameWrap | undefined): string {
  if (wrap === 'single') return name.replace(/[ \t]*[\r\n]+[ \t]*/g, ' ');
  if (wrap !== 'break' || name.includes('\n')) return name;
  const paren = /^(.*\S)\s+(\([^()]+\))$/.exec(name);
  if (paren) return `${paren[1]}\n${paren[2]}`;
  const middle = name.length / 2;
  let best = -1;
  for (let i = 1; i < name.length; i++) {
    if (name[i] === ' ' && name[i - 1] !== ' ' && (best < 0 || Math.abs(i - middle) < Math.abs(best - middle))) best = i;
  }
  return best < 0 ? name : `${name.slice(0, best)}\n${name.slice(best + 1)}`;
}

/** Fonte do nome: a do layout (`base`) mais o ajuste da carta (`nameSize`, padrão 0). */
export function nameFontSize(base: number, nameSize: number | undefined): number {
  return Math.max(MIN_NAME_FONT_SIZE, base + (Number.isFinite(nameSize) ? (nameSize as number) : 0));
}

/**
 * Cartas gravadas antes do `nameSize` tinham `nameScale` (fração do tamanho do layout, ex.: 0.9):
 * vira o ajuste equivalente em pixels.
 */
export function migrateCustomCard(card: CustomCard & { nameScale?: number }): CustomCard {
  if (card.nameScale === undefined) return card;
  const { nameScale, ...rest } = card;
  if (rest.nameSize !== undefined) return rest;
  const base = getLayout(rest.layout).name[rest.type]?.size;
  return { ...rest, nameSize: base ? Math.round(base * (nameScale - 1) * 4) / 4 : 0 };
}

/** Característica impressa → símbolo da vila (só os nomes exatos; "Rock", "Land of Snow" etc. ficam de fora). */
const VILLAGE_BY_CHARACTERISTIC_EN: Record<string, Village> = {
  Leaf: 'leaf',
  Sand: 'sand',
  Mist: 'mist',
  Sound: 'sound',
  Cloud: 'cloud',
  Stone: 'stone',
  Rain: 'rain',
  Grass: 'grass',
  Waterfall: 'waterfall',
  Snow: 'snow',
  Star: 'star',
  'Hot Water': 'hot-water',
  Moon: 'moon',
  Whirlpool: 'whirlpool',
  Lock: 'lock',
  Artisan: 'artisan',
  Nadeshiko: 'nadeshiko',
};

/** O mesmo em PT-BR (o texto das cartas no conteúdo do jogo, ex.: "Folha") e como impresso. */
const VILLAGE_BY_CHARACTERISTIC: Record<string, Village> = Object.fromEntries(
  Object.entries(VILLAGE_BY_CHARACTERISTIC_EN).flatMap(([en, v]) => [
    [en, v],
    [CHARACTERISTICS_PTBR[en] ?? en, v],
  ]),
);

/** Vilas da carta (até `MAX_VILLAGES`), convertendo o formato antigo de uma vila só. */
export function cardVillages(card: Pick<CustomCard, 'villages' | 'village' | 'villageRogue'>): VillageMark[] {
  if (card.villages) return card.villages.slice(0, MAX_VILLAGES);
  return card.village ? [{ village: card.village, rogue: !!card.villageRogue }] : [];
}

/** Grava as vilas no formato novo (e apaga o antigo). */
export function withVillages(card: CustomCard, villages: VillageMark[]): CustomCard {
  const { village: _v, villageRogue: _r, ...rest } = card;
  return { ...rest, villages: villages.slice(0, MAX_VILLAGES) };
}

/**
 * Vila com o símbolo riscado (renegado): só os membros da Akatsuki (característica "Akatsuki"). "Rogue Ninja"
 * não risca o símbolo: a vila sai normal.
 */
const isRogue = (characteristic: string) => characteristic.startsWith('Akatsuki');

const power = (p: { combat: number | 'X'; support: number | 'X' }) => `${p.combat}/${p.support}`;
const cost = (n: number) => (n < 0 ? 'X' : String(n));

/**
 * Preenche uma carta do criador com os dados de uma carta do catálogo (os textos do conteúdo do jogo, em PT-BR).
 * A imagem do catálogo (que já tem a moldura) fica só como referência.
 *
 * Carta já escaneada (`card.layout`): vem no layout dela (se nenhum outro for pedido) e com as artes
 * extraídas, enquadradas como na impressa (sem arte extraída, a impressa faz o fundo: `print`). Os ícones e o design só valem no layout da carta: pedindo outro
 * layout, a carta vem com os ícones padrão dele (`withLayoutIcons`).
 */
export function fromCatalogCard(card: Card, now = new Date().toISOString(), layout?: LayoutId): CustomCard {
  const info = card.layout;
  const target = layout ?? info?.layout ?? 'layout-01';
  const result = withLayoutIcons(withLayout(catalogFields(card, now), target));
  if (!info) return result;
  const art = (layer: ArtLayer): CustomCardArt | undefined => {
    const placement = info.art[layer];
    const src = placement?.src
      ? placement.src
      : !placement?.print
      ? cardArtUrl(card.id, layer)
      : placement.clean
        ? cardArtUrl(card.id, 'print-clean')
        : cardImageUrl(card, 'full');
    return placement && { src, x: placement.x, y: placement.y, zoom: placement.zoom };
  };
  const front = art('front');
  const withArt: CustomCard = {
    ...result,
    art: art('back') ?? result.art,
    ...(front && { artFront: front }),
    // Fundo = a impressa: a frase dela aparece por baixo da montada.
    ...(info.art.back?.print && !info.art.back.src && { printedFlavor: card.flavor ?? '' }),
    ...(info.flavorShade === false && { flavorShade: false }),
    ...(info.customIcon && { customIcon: { ...info.customIcon } }),
    // O que a aba Editar do detalhe guarda além dos dados da carta.
    ...(info.nameText && { name: info.nameText }),
    ...(info.textMarkup !== undefined && { text: info.textMarkup }),
    ...(info.villages && { villages: info.villages.filter((v) => (VILLAGES as readonly string[]).includes(v.village)) as VillageMark[] }),
  };
  return target === info.layout ? withCardIcons(withArt, info) : withArt;
}

/** Ícones e design impressos na carta escaneada (`CardLayoutInfo`); o que a carta não tiver fica como está. */
function withCardIcons(card: CustomCard, info: CardLayoutInfo): CustomCard {
  const { icons } = info;
  const next: CustomCard = {
    ...card,
    elements: card.elements.map((el, i) => ({ ...el, variant: icons.elements[i] ?? el.variant })),
    entranceIcon: icons.entrance ?? card.entranceIcon,
    handIcon: icons.hand ?? card.handIcon,
    attribute: { ...card.attribute, frame: icons.attribute ?? card.attribute.frame },
  };
  if (icons.type !== 'default') next.typeVariant = icons.type;
  if (info.panelVariant) next.panelVariant = info.panelVariant;
  if (info.nameBanner !== undefined) next.nameBanner = info.nameBanner;
  if (info.textDivider !== undefined) next.textDivider = info.textDivider;
  if (info.layoutOverrides) next.layoutOverrides = { ...info.layoutOverrides };
  next.nameSize = info.nameSize ?? 0;
  if (info.nameWrap) next.nameWrap = info.nameWrap;
  return next;
}

function catalogFields(card: Card, now: string): CustomCard {
  const base = newCustomCard(card.type, now);
  const result: CustomCard = {
    ...base,
    name: card.name,
    elements: card.elements.slice(0, 3).map((element) => ({ element, variant: '01' })),
    flavor: card.flavor ?? '',
    text: card.text.map(catalogTextToMarkup).join('\n'),
    reference: cardImageUrl(card),
    source: card.id,
    ...(card.token && { token: true }),
  };
  if (card.type === 'jutsu') {
    const part = (o: { symbols: ElementSymbol[]; generic: number | 'X' }): JutsuCostPart => ({
      symbols: [...o.symbols],
      generic: o.generic === 'X' ? 'X' : o.generic === 0 && o.symbols.length > 0 ? '' : String(o.generic),
    });
    result.jutsuCost = part(card.cost);
    if (card.cost.alternatives?.length) result.jutsuCost.alternatives = card.cost.alternatives.map(part);
    return result;
  }
  result.entranceCost = cost(card.entranceCost);
  result.handCost = cost(card.handCost);
  if (card.type === 'mission') return result;
  result.characteristics = [...card.characteristics];
  const rogue = card.characteristics.some(isRogue);
  result.villages = [...new Set(card.characteristics.map((c) => VILLAGE_BY_CHARACTERISTIC[c]).filter(Boolean))]
    .slice(0, MAX_VILLAGES)
    .map((village) => ({ village, rogue }));
  if (card.type === 'ninja') {
    result.healthy = power(card.healthy);
    result.injured = power(card.injured);
    // Todos os atributos ("Genjutsu/Tree"); o kanji vem da imagem de cada um.
    result.attribute = { frame: '01', label: card.attributes.join('/') };
  }
  return result;
}

export type TextColor = 'red' | 'blue';

/**
 * Passa a carta para outro layout, aplicando só o que é estrutural do layout: tipos disponíveis (o tipo
 * muda para o primeiro se o layout não tiver o atual). Os elementos (até 3 em qualquer layout) e os ícones escolhidos
 * (variante dos elementos, custos, moldura do Atributo de Combate) ficam como estão: dá para misturar
 * estilos de layouts diferentes. Para usar os ícones do layout, `withLayoutIcons`.
 */
export function withLayout(card: CustomCard, layoutId: LayoutId): CustomCard {
  const spec = getLayout(layoutId);
  const { layoutOverrides: _overrides, ...rest } = card;
  return {
    ...(spec.id === card.layout ? card : rest),
    layout: spec.id,
    type: spec.types.includes(card.type) ? card.type : spec.types[0],
  };
}

/**
 * Aplica os ícones padrão do layout da carta (como nas cartas impressas nele): variante dos elementos,
 * ícones de custo e moldura do Atributo de Combate. Usado só como ponto de partida: nas cartas novas
 * e ao importar do catálogo.
 */
export function withLayoutIcons(card: CustomCard): CustomCard {
  const spec = getLayout(card.layout);
  return {
    ...card,
    elements: card.elements.map((el) => ({ ...el, variant: spec.elements.variant })),
    entranceIcon: spec.defaults.entranceIcon,
    handIcon: spec.defaults.handIcon,
    attribute: { ...card.attribute, frame: spec.attribute.defaultFrame },
  };
}

/**
 * Troca de layout no criador: a carta passa para o layout escolhido com os ícones padrão dele (os definidos no editor
 * de layouts: variante dos elementos, custos e moldura do Atributo de Combate). Escolher o mesmo layout não muda nada.
 */
export function switchLayout(card: CustomCard, layoutId: LayoutId): CustomCard {
  const next = withLayout(card, layoutId);
  return next.layout === card.layout ? next : withLayoutIcons(next);
}

/** Trecho de texto com o seu estilo. */
export interface TextRun {
  text: string;
  bold: boolean;
  color?: TextColor;
  /**
   * Ícone no meio do texto (`~1~`, `~X~`: Chakra genérico com o valor; `~fire~`, `~fogo~`: o símbolo do elemento).
   * `text` fica com o que foi digitado (é o que sai nos textos sem desenho, ex.: os dados das regras).
   */
  icon?: TextIcon;
}

export type TextIcon = { kind: 'chakra'; value: string } | { kind: 'element'; element: ElementSymbol };

/** Nomes de elemento aceitos entre tis (`~fire~`), em inglês e em português, sem acento. */
const TEXT_ICON_ELEMENTS: Record<string, ElementSymbol> = {
  fire: 'fire',
  fogo: 'fire',
  water: 'water',
  agua: 'water',
  wind: 'wind',
  vento: 'wind',
  earth: 'earth',
  terra: 'earth',
  lightning: 'lightning',
  raio: 'lightning',
  trovao: 'lightning',
  void: 'void',
  vazio: 'void',
};

/** O ícone de `~valor~`: número ou X → Chakra genérico; nome de elemento → o símbolo dele; outra coisa → nenhum. */
export function textIcon(token: string): TextIcon | null {
  const t = token.trim();
  if (/^(\d{1,2}|x)$/i.test(t)) return { kind: 'chakra', value: t.toUpperCase() };
  const element = TEXT_ICON_ELEMENTS[t.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')];
  return element ? { kind: 'element', element } : null;
}

/** Linhas de duração de Missão, impressas inteiras em negrito (ex.: "Permanent (3)"). */
const DURATION_LINE = /^\p{Lu}[\p{L} ]*\(\s*[\dX]+\s*\)$/u;
/** Rótulo no começo do bloco, impresso em negrito (ex.: "Effect:", "Requirements:", "Valid:"; em PT-BR, "Válido:"). */
const LABEL = /^(\p{Lu}[\p{L}' ]{0,30}:)(?=\s|$)/u;

/** Marcações: o par de abertura/fechamento e o que ele aplica. */
const MARKS: Record<string, { close: string; apply: (s: Style) => Style }> = {
  '[': { close: ']', apply: (s) => ({ ...s, bold: true }) },
  '{': { close: '}', apply: (s) => ({ ...s, color: 'red' }) },
  '(': { close: ')', apply: (s) => ({ ...s, color: 'blue' }) },
};

type Style = Omit<TextRun, 'text'>;

/** Caracteres de marcação que o texto do catálogo precisa escapar para saírem como impressos. */
const ESCAPE = /[\\(){}]/g;

/**
 * Converte uma linha de texto do catálogo (como impressa) para a marcação do criador, para a carta
 * importada sair igual à original: parênteses e chaves são escapados (`\(3\)`), habilidade sozinha na
 * linha → `[[NOME]]` (negrito, maiúsculas e colchetes), referência entre colchetes no meio do texto →
 * `[[...]]`, rótulo → `[Effect:]` e duração de Missão → `[Permanent \(3\)]`.
 */
export function catalogTextToMarkup(line: string): string {
  const trimmed = line.trim();
  const escaped = trimmed.replace(ESCAPE, '\\$&');
  if (/^\[[^\]]*\]$/.test(trimmed)) return `[${escaped.toUpperCase()}]`;
  if (DURATION_LINE.test(trimmed)) return `[${escaped}]`;
  return escaped.replace(/\[([^\]\n]*)\]/g, '[[$1]]').replace(LABEL, '[$1]');
}

/**
 * Posição do fechamento da marcação que abre antes de `from` (ou -1). Conta aberturas do mesmo tipo
 * para aceitar aninhamento e pula caracteres escapados. `double`: procura o fechamento duplo (`]]`).
 */
function findClose(s: string, from: number, open: string, close: string, double: boolean): number {
  let depth = 0;
  for (let i = from; i < s.length; i++) {
    const c = s[i];
    if (c === '\\') {
      i++;
    } else if (c === open) {
      depth++;
    } else if (c === close) {
      if (depth > 0) depth--;
      else if (!double) return i;
      else if (s[i + 1] === close) return i;
    }
  }
  return -1;
}

/**
 * Divide um bloco de texto em trechos com estilo. Só a marcação muda o estilo; o resto sai como foi
 * escrito (sem mudar maiúsculas). As marcações podem ser combinadas (ex.: `[{trecho}]`):
 * - `[trecho]` → negrito; `{trecho}` → vermelho; `(trecho)` → azul (a marcação não aparece);
 * - dobrada (`[[trecho]]`, `{{trecho}}`, `((trecho))`) → o mesmo estilo, mostrando os símbolos;
 * - `\` antes de um símbolo o escreve normal (ex.: `Permanent \(3\)`);
 * - `~1~` (número ou X) → ícone do Chakra genérico com o valor; `~fire~` (ou `~fogo~` etc.) → símbolo do elemento.
 */
export function parseTextBlock(line: string): TextRun[] {
  const trimmed = line.trim();
  if (!trimmed) return [];
  const runs: TextRun[] = [];
  const push = (text: string, style: Style) => {
    if (!text) return;
    const last = runs[runs.length - 1];
    if (last && !last.icon && last.bold === style.bold && last.color === style.color) last.text += text;
    else runs.push(style.color ? { text, bold: style.bold, color: style.color } : { text, bold: style.bold });
  };

  const parse = (s: string, style: Style) => {
    let buffer = '';
    const flush = () => {
      push(buffer, style);
      buffer = '';
    };
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '\\' && i + 1 < s.length) {
        buffer += s[++i];
        continue;
      }
      // `~1~`, `~fire~`: ícone no meio do texto (o que não for valor nem elemento sai como foi digitado).
      if (c === '~') {
        const end = s.indexOf('~', i + 1);
        const icon = end > i + 1 && end - i <= 16 ? textIcon(s.slice(i + 1, end)) : null;
        if (icon) {
          flush();
          runs.push({ text: s.slice(i, end + 1), bold: style.bold, ...(style.color && { color: style.color }), icon });
          i = end;
          continue;
        }
      }
      const mark = MARKS[c];
      if (mark) {
        if (s[i + 1] === c) {
          const end = findClose(s, i + 2, c, mark.close, true);
          if (end >= 0) {
            flush();
            const inner = mark.apply(style);
            push(c, inner);
            parse(s.slice(i + 2, end), inner);
            push(mark.close, inner);
            i = end + 1;
            continue;
          }
        }
        const end = findClose(s, i + 1, c, mark.close, false);
        if (end >= 0) {
          flush();
          parse(s.slice(i + 1, end), mark.apply(style));
          i = end;
          continue;
        }
      }
      buffer += c;
    }
    flush();
  };

  parse(trimmed, { bold: false });
  return runs;
}

/** Blocos de texto (linhas não vazias) já divididos em trechos. */
export function parseCardText(text: string): TextRun[][] {
  return text
    .split('\n')
    .map(parseTextBlock)
    .filter((runs) => runs.length > 0);
}
