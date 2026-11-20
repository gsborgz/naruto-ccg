/**
 * Configuração de um ícone: a imagem e o que é desenhado sobre ela (nome, números, kanji).
 *
 * Tudo é relativo ao próprio ícone, para ele ficar igual em qualquer layout. O layout só diz onde o
 * ícone fica e o tamanho (`IconPlacement` em layouts/types.ts); os textos acompanham a escala, exceto
 * o número dos custos de entrada e de mão (`CostNumberStyle`), que tem tamanho próprio.
 */

/**
 * Alinhamento de um texto ou número do ícone em relação ao ponto dele (`x`/`cx`): `left` começa no ponto, `center`
 * fica centrado nele (o padrão) e `right` termina nele. No nome de lado (lido de baixo para cima), `left` é o começo
 * da leitura (embaixo).
 */
export type IconTextAlign = 'left' | 'center' | 'right';

/**
 * Número sobre um ícone (Chakra do custo do Jutsu). Centro em frações da caixa do ícone (`x` da largura,
 * `y` da altura); fonte e contorno em frações da largura (acompanham o tamanho do ícone).
 */
export interface IconNumberStyle {
  x: number;
  y: number;
  size: number;
  strokeWidth: number;
  color: string;
  stroke: string;
  /** Sem valor: centrado. */
  align?: IconTextAlign;
}

/**
 * Nome escrito de lado no ícone (tipo e elemento), lido de baixo para cima. Centro (`cx`, `cy`), altura
 * das maiúsculas (`cap`) e comprimento do texto (`length`) em frações da largura da caixa; contorno e
 * sombra em frações de `cap`.
 */
export interface IconSideLabel {
  text: string;
  cx: number;
  cy: number;
  cap: number;
  length: number;
  color: string;
  stroke: string;
  strokeWidth: number;
  /** Peso da fonte (Montserrat). */
  weight: number;
  /** Sem valor: centrado. */
  align?: IconTextAlign;
  shadow: { color: string; opacity: number; dx: number; dy: number; blur: number };
}

/**
 * Campos de todo ícone criado na aba Ícones do editor de layouts (cópia de outro): `created` (pode ser excluído; a imagem
 * nova vai para a pasta dele) e `name`, o nome nos seletores (ex.: o do ícone alternativo do tipo).
 */
export interface CreatedIconFields {
  created?: boolean;
  name?: string;
}

/** Ícone de tipo ou de elemento: a arte e o nome escrito de lado. */
export interface NamedIconConfig extends CreatedIconFields {
  url: string;
  /** Altura / largura da caixa do ícone (a caixa em que as posições dos layouts foram calibradas). */
  aspect: number;
  /** Onde a arte fica dentro da caixa (frações da largura). */
  art: { x: number; y: number; w: number; h: number };
  label: IconSideLabel;
}

/**
 * Número dos custos de entrada e de mão. O centro (`x`, `y`) fica em frações da caixa do ícone, para
 * acompanhar a imagem; a fonte (`size`) e o contorno (`strokeWidth`) são em pixels da carta (750×1050)
 * e não mudam com o `size` do ícone no layout, que só redimensiona a imagem.
 */
export type CostNumberStyle = IconNumberStyle;

/** Ícone de custo de entrada ou de mão: a imagem e o número. */
export interface CostIconConfig extends CreatedIconFields {
  url: string;
  /** Altura / largura da caixa do ícone (a "div" do ícone; a mesma em todos os custos deixa os ícones padronizados). */
  aspect: number;
  /**
   * Onde a imagem fica dentro da caixa (frações da largura da caixa): canto (`x`, `y`) e largura (`w`); a altura
   * segue a proporção da imagem. Sem valor (ou campo faltando): a imagem começa no canto e ocupa a largura da caixa.
   */
  art?: Partial<{ x: number; y: number; w: number }>;
  number: CostNumberStyle;
}

/** Chakra genérico do custo do Jutsu: aparece na linha do custo, só com a parte útil da tela. */
export interface ChakraIconConfig extends CreatedIconFields {
  url: string;
  aspect: number;
  number: IconNumberStyle;
  /** Parte da tela que ocupa espaço na linha do custo (frações da caixa). */
  inline: { x: number; y: number; w: number; h: number };
}

/** Ponto na tela do ícone do Atributo de Combate (pixels da tela original). */
export interface CanvasPoint {
  x: number;
  y: number;
}

/**
 * Atributo de Combate (as duas kunais e o círculo ou losango): medidas em pixels da tela original
 * (`canvas`), escaladas junto com o ícone.
 */
export interface CombatAttributeIconConfig extends CreatedIconFields {
  url: string;
  canvas: { w: number; h: number };
  /** Centro e raio do círculo (ou losango) onde ficam o kanji e o nome do atributo. */
  circle: { cx: number; cy: number; r: number };
  /**
   * Força: saudável (lâmina de baixo) e ferido (lâmina de cima, girado 90°). `strokeWidth`: grossura do
   * contorno (pixels da tela, como `size`).
   */
  power: { healthy: CanvasPoint; injured: CanvasPoint; size: number; strokeWidth: number; color: string; stroke: string; align?: IconTextAlign };
  /** Nome do atributo, embaixo do kanji (ou no meio do círculo, sem kanji). */
  label: {
    /** Tamanho com um atributo (pixels da tela). */
    size: number;
    uppercase: boolean;
    color: string;
    /**
     * Grossura do contorno do nome em pixels da carta (750×1050), a parte que aparece em volta da letra
     * (0 = sem contorno), e a cor dele. Não é escalada com o ícone: o nome é pequeno, e em pixels da tela
     * um valor como 2 sumiria.
     */
    strokeWidth: number;
    stroke: string;
    /** Vários atributos (sem kanji): a fonte pode crescer até `size × multiMax`, se couber no círculo. */
    multiMax: number;
    /** Centro do nome abaixo do centro do círculo, em frações do raio, com 1, 2 e 3+ linhas (com kanji). */
    dyWithKanji: [number, number, number];
    /** Alinhamento das linhas do nome (o bloco fica centrado no círculo). Sem valor: centrado. */
    align?: IconTextAlign;
  };
  /** Kanji: tamanho e deslocamento vertical em frações do raio; `text*` para o kanji digitado (cartas antigas). */
  kanji: { size: number; dy: number; textSize: number; textColor: string; textStroke: string };
}
