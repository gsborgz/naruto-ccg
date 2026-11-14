import { cardImageUrl, type Card, type CardType, type ElementSymbol } from '../../models/card.ts';
import { getLayout } from './layouts/index.ts';

/**
 * Carta criada no criador de cartas (`/criar`). É só visual: não entra nos decks nem nas regras.
 * Os valores ficam como texto (ex.: custo "X", força "7/2") porque a carta é montada como impressa.
 */

export type LayoutId = 'layout-01' | 'layout-02' | 'layout-03' | 'layout-04' | 'layout-05';

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

/**
 * Variante do ícone de elemento (arquivos `element-<elemento>-<variante>`). O layout 1 usa a 01; a 03 é
 * alternativa (não existe para o Vazio).
 */
export type ElementVariant = '01' | '02' | '03';

export interface CardElement {
  element: ElementSymbol;
  variant: ElementVariant;
}

export type EntranceIcon = 'entrance-01' | 'entrance-02' | 'entrance-03' | 'entrance-04';
export type HandIcon = 'hand-01' | 'hand-02' | 'hand-03';

/** Moldura do Atributo de Combate (arquivos `combat-attributes-<variante>`). */
export type AttributeFrame = '01' | '02' | '03-01' | '03-02' | '05' | '06-01' | '06-02' | '06-03' | '07';
export const ATTRIBUTE_FRAMES: AttributeFrame[] = ['01', '02', '03-01', '03-02', '05', '06-01', '06-02', '06-03', '07'];

export interface CustomCardArt {
  /** Imagem como data URL (reduzida no upload), ou null sem arte. */
  src: string | null;
  /** Deslocamento em unidades da carta (750×1050) e zoom sobre o enquadramento "cobrir". */
  x: number;
  y: number;
  zoom: number;
}

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
  /** Mancha preta atrás do nome (layouts com o nome no topo). Sem valor: o padrão do layout. */
  nameBanner?: boolean;
  /** Versão alternativa do painel de dados (`LayoutSpec.panelVariants`). Sem valor: o painel padrão. */
  panelVariant?: string;
  /** Ícone alternativo do tipo (`TYPE_ICON_VARIANTS` em icons/index.ts). Sem valor: o ícone padrão. */
  typeVariant?: string;
  /** Imagem da carta original, quando importada do catálogo (para comparar o mapeamento). */
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export type ArtLayer = 'back' | 'front';

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
  return { ...card, [artKey(layer)]: { ...EMPTY_ART, ...frame, src } };
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
    createdAt: now,
    updatedAt: now,
  };
}

/** Característica impressa → símbolo da vila (só os nomes exatos; "Rock", "Land of Snow" etc. ficam de fora). */
const VILLAGE_BY_CHARACTERISTIC: Record<string, Village> = {
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

/** "Rogue Ninja", "Rogue Ninja (Jonin)" etc. */
const isRogue = (characteristic: string) => characteristic.startsWith('Rogue Ninja');

const power = (p: { combat: number | 'X'; support: number | 'X' }) => `${p.combat}/${p.support}`;
const cost = (n: number) => (n < 0 ? 'X' : String(n));

/**
 * Preenche uma carta do criador com os dados de uma carta do catálogo (texto em inglês, como impresso).
 * A arte não vem junto (a imagem do catálogo já tem a moldura); ela fica só como referência.
 */
export function fromCatalogCard(card: Card, now = new Date().toISOString(), layout: LayoutId = 'layout-01'): CustomCard {
  return withLayoutIcons(withLayout(catalogFields(card, now), layout));
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
  return {
    ...card,
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

/** Trecho de texto com o seu estilo. */
export interface TextRun {
  text: string;
  bold: boolean;
  color?: TextColor;
}

/** Linhas de duração de Missão, impressas inteiras em negrito (ex.: "Permanent (3)"). */
const DURATION_LINE = /^[A-Z][A-Za-z ]*\(\s*[\dX]+\s*\)$/;
/** Rótulo no começo do bloco, impresso em negrito (ex.: "Effect:", "Requirements:", "Valid:"). */
const LABEL = /^([A-Z][A-Za-z' ]{0,30}:)(?=\s|$)/;

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
 * - `\` antes de um símbolo o escreve normal (ex.: `Permanent \(3\)`).
 */
export function parseTextBlock(line: string): TextRun[] {
  const trimmed = line.trim();
  if (!trimmed) return [];
  const runs: TextRun[] = [];
  const push = (text: string, style: Style) => {
    if (!text) return;
    const last = runs[runs.length - 1];
    if (last && last.bold === style.bold && last.color === style.color) last.text += text;
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
