import type { CardType } from '../../../models/card.ts';
import type { AttributeFrame, ElementVariant, EntranceIcon, HandIcon, LayoutId, TextColor } from '../model.ts';

/**
 * Configuração de um layout de carta: onde cada elemento fica e com que estilo.
 *
 * Coordenadas em pixels de uma carta de 750×1050 (o tamanho dos exemplos em card-layouts/examples);
 * as molduras (1060×1484) têm a mesma proporção. Cada layout tem um arquivo próprio nesta pasta,
 * calibrado contra os exemplos dele (ver `/criar/calibrar`).
 */

/**
 * Onde um ícone fica no layout: canto superior esquerdo da caixa do ícone (`x`, `y`) e largura da caixa
 * (`size`), em pixels da carta. O resto (proporção, textos, números) é do próprio ícone, em
 * src/lib/cardMaker/icons/, e escala junto.
 */
export interface IconPlacement {
  x: number;
  y: number;
  size: number;
}

/** Caixa calculada de um ícone na carta. */
export interface IconBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Custos de entrada e de mão. */
export interface CostLayout {
  entrance: IconPlacement;
  hand: IconPlacement;
}

export interface NameStyle {
  /** `left`: x é a margem esquerda; `center`: x é o centro. */
  align: 'left' | 'center';
  x: number;
  /** Centro vertical da linha do nome. */
  cy: number;
  maxWidth: number;
  /**
   * Altura máxima do bloco do nome, centrado em `cy`, quando ele quebra em mais de uma linha
   * (padrão: 1,5 × `size`).
   */
  maxHeight?: number;
  size: number;
  color: string;
  /** Contorno (ex.: Jutsu, letras claras com borda escura). */
  stroke?: string;
  /** Versalete (ex.: layout 3, "THE 6TH HOKAGE"). */
  smallCaps?: boolean;
  /**
   * Parênteses no fim do nome numa 2ª linha menor (layout 3: "SUSANO'O" / "(SASUKE)"):
   * tamanho da fonte e distância do centro da 2ª linha ao centro do nome.
   */
  parenthesesBelow?: { size: number; dy: number };
  /**
   * Fonte dos parênteses no fim do nome ("Hinata Hyuga (Kimono)"), em fração da fonte do nome. Sem valor:
   * `NAME_PARENTHESES_SCALE` (vale em todos os layouts; para mudar num só, ponha o campo aqui).
   */
  parenthesesScale?: number;
}

export interface CharacteristicsStyle {
  x: number;
  cy: number;
  maxWidth: number;
  size: number;
  color: string;
  separator: string;
}

export interface TextBoxStyle {
  x: number;
  /** Topo da primeira linha. */
  top: number;
  w: number;
  /** Limite inferior: o texto encolhe para caber. */
  bottom: number;
  size: number;
  lineHeight: number;
  /** Espaço entre blocos. */
  gap: number;
  color: string;
  stroke?: string;
  /** Peso da fonte (padrão 600). */
  weight?: number;
}

/**
 * Linha que separa o texto de efeito do nome e das características (traço de pincel), sempre logo acima da caixa de
 * texto: acompanha a posição e a largura dela (`TextBoxStyle`).
 */
export interface TextDividerStyle {
  /** Distância do centro da linha ao topo da caixa de texto. */
  gap: number;
  /** Quanto a linha fica mais curta que a caixa de texto, de cada lado (negativo: mais comprida). */
  inset: number;
  /** Espessura no meio do traço (as pontas afinam). A cor fica em `LayoutSpec.textDividerColor`. */
  thickness: number;
  /** Vem ligada nas cartas do layout (a carta pode ligar ou desligar: `CustomCard.textDivider`). */
  default: boolean;
}

export interface FlavorStyle {
  x: number;
  w: number;
  /** Base do bloco: a frase cresce para cima a partir daqui. */
  bottom: number;
  size: number;
  lineHeight: number;
}

export interface JutsuCostStyle {
  /** Começo da linha e centro vertical. */
  x: number;
  cy: number;
  /** Largura dos kanjis de elemento (tela quadrada). */
  elementSize: number;
  /** Largura da caixa do Chakra genérico (o número vem do ícone, em icons/cost/chakra-any.ts). */
  chakraSize: number;
  /** Separador "|": tamanho e margens (o "|" fica colado no símbolo anterior). */
  separatorSize: number;
  separatorMargin: string;
  /** "or" entre custos alternativos: tamanho, margens e cor. */
  orSize: number;
  orMargin: string;
  orColor: string;
  /** Cor do separador "|". */
  color: string;
}

export interface LayoutSpec {
  id: LayoutId;
  /** Nome no seletor do criador. */
  label: string;
  /** Tipos de carta que o layout tem. */
  types: CardType[];
  /** Moldura por tipo (URL). Sem moldura (arte de corpo inteiro): o tipo fica de fora. */
  frame: Partial<Record<CardType, string>>;
  /** Painel de dados por tipo (URL). */
  panel: Partial<Record<CardType, string>>;
  /**
   * Designs alternativos do layout, com a mesma geometria: o painel e, se tiver, a moldura
   * (ex.: layout 3 com a borda vermelha; layout 4 roxo). A carta escolhe um pelo `id`
   * (`CustomCard.panelVariant`); sem escolha, valem `panel` e `frame`.
   */
  panelVariants?: {
    id: string;
    label: string;
    panel: Partial<Record<CardType, string>>;
    frame?: Partial<Record<CardType, string>>;
  }[];
  /** Nome do design padrão no seletor (quando há `panelVariants`). */
  panelLabel?: string;
  typeIcon: Record<CardType, IconPlacement>;
  elements: {
    /** Ícone no 1º espaço; `overrides` para um ícone específico (chave `<elemento>-<variante>`). */
    pos: IconPlacement;
    overrides?: Partial<Record<string, IconPlacement>>;
    /** Distância vertical entre um espaço e o seguinte. */
    slotDy: number;
    /** Variante dos ícones usada pelo layout. */
    variant: ElementVariant;
  };
  cost: Record<'ninja' | 'client' | 'mission', CostLayout>;
  /** Só nos layouts com Jutsu. */
  jutsuCost?: JutsuCostStyle;
  /** Kunais do Atributo de Combate (a força, o kanji e o nome vêm da moldura, em icons/combat-attributes/). */
  attribute: IconPlacement & { defaultFrame: AttributeFrame };
  /** Ícone de vila: caixa da tela padronizada de 1254×1254 (a da Nuvem, mais larga, fica centrada nela). */
  village: IconPlacement;
  name: Record<CardType, NameStyle>;
  characteristics: Record<'ninja' | 'client', CharacteristicsStyle>;
  /** Texto de efeito por tipo; sem entrada, o layout não tem texto de efeito (ex.: layout 5). */
  textBox: Partial<Record<CardType, TextBoxStyle>>;
  /** Cores dos trechos marcados no texto: `{vermelho}` e `(azul)`. */
  markColor: Record<CardType, Record<TextColor, string>>;
  flavor: Record<CardType, FlavorStyle>;
  /**
   * Mancha de pincel atrás do nome (layouts com o nome no topo): centro, largura e se vem ligada.
   * A carta pode ligar ou desligar (`CustomCard.nameBanner`).
   */
  nameBanner?: { cx: number; cy: number; w: number; default: boolean };
  /** Linha acima do texto de efeito. Sem valor: `TEXT_DIVIDER_DEFAULT` (layouts/index.ts). */
  textDivider?: TextDividerStyle;
  /**
   * Cor da linha acima do texto por tipo de carta (cada tipo tem o seu painel), gravada no registro do layout só
   * quando alguém define no editor de layouts. Tipo sem valor: `TEXT_DIVIDER_COLOR` (o vermelho).
   */
  textDividerColor?: Partial<Record<CardType, string>>;
  /** Ícones de custo usados pelo layout (aplicados ao escolher o layout). */
  defaults: { entranceIcon: EntranceIcon; handIcon: HandIcon };
}
