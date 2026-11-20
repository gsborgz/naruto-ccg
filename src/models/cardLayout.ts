/**
 * Layout de uma carta do catálogo: o que é preciso para montá-la virtualmente com os elementos de
 * card-layouts/ (moldura, painel, ícones) e as artes extraídas da carta, em vez da imagem impressa.
 * Os valores vêm do scan das cartas (`scripts/card-scan/scan.py`, conferido contra a imagem original).
 * Os textos e valores (nome, custos, força, elementos, atributo) saem dos dados da carta.
 *
 * O layout dá só a moldura, o painel e as posições. Os ícones ficam na carta (`icons`), porque as coleções
 * mais novas misturam ícones de layouts diferentes.
 */

/**
 * Id do layout (`layout-01` a `layout-05`, os das coleções impressas, ou um criado no editor de layouts). Os layouts
 * ficam no conteúdo do jogo (Redis), editáveis pelo site.
 */
export type LayoutId = string;

/**
 * Quebra de linha do nome: `auto` (uma linha, encolhendo até 80%; se não couber, quebra), `single` (sempre numa
 * linha, encolhendo o quanto precisar) ou `break` (duas linhas: antes do parêntese final ou no espaço mais perto do
 * meio). Uma quebra digitada no nome (Enter, no criador) vale sempre, menos em `single`.
 */
export type NameWrap = 'auto' | 'single' | 'break';
export const NAME_WRAPS: readonly NameWrap[] = ['auto', 'single', 'break'];

/**
 * Variante do ícone de elemento (arquivos `element-<elemento>-<variante>` em card-layouts/icons/element).
 * O layout 1 usa a 01; a 03 é alternativa (não existe para o Vazio).
 */
export type ElementVariant = '01' | '02' | '03';

/** Ícones de custo (arquivos `cost-entrance-XX` e `cost-hand-XX` em card-layouts/icons/cost). */
export type EntranceIcon = 'entrance-01' | 'entrance-02' | 'entrance-03' | 'entrance-04';
export type HandIcon = 'hand-01' | 'hand-02' | 'hand-03';

/** Moldura do Atributo de Combate (arquivos `combat-attributes-<variante>`). */
export type AttributeFrame = '01' | '02' | '03-01' | '03-02' | '05' | '06-01' | '06-02' | '06-03' | '07';

/** Camadas de arte: `back` fica atrás da moldura; `front` na frente da moldura e atrás do painel. */
export type ArtLayer = 'back' | 'front';

/**
 * Enquadramento de uma camada de arte, o mesmo do criador de cartas (`CustomCardArt`): a imagem é escalada
 * para cobrir a carta (750×1050), centrada, e então deslocada (`x`, `y`, em unidades da carta) e ampliada
 * (`zoom`) a partir do centro dela.
 */
export interface CardArtPlacement {
  x: number;
  y: number;
  zoom: number;
  /**
   * Arte provisória: a própria carta impressa (`cardImageUrl`) no lugar da arte extraída, até ela ser feita.
   * A moldura, o painel e os textos montados ficam por cima dela.
   */
  print?: boolean;
  /**
   * Com `print`: usa a impressa sem os ícones de elemento (card-layouts/arts/<set>/<id>/print-clean.png, gerada por
   * scripts/card-extract/clean_elements.py e conferida à mão), do mesmo tamanho da impressa, então o enquadramento
   * é o mesmo. Assim o elemento montado (e o nome dele em PT-BR) não fica por cima do impresso.
   */
  clean?: boolean;
  /**
   * Imagem enviada no lugar da extraída ou da impressa (aba Editar do detalhe da carta): endereço no Vercel Blob. Com
   * ela, `print` e `clean` não valem.
   */
  src?: string;
}

/** Ícones impressos na carta (o desenho de cada um; a posição vem do layout). */
export interface CardIcons {
  /**
   * Ícone do tipo: `default` (arquivo `type-<tipo>`) ou um alternativo de `TYPE_ICON_VARIANTS`
   * (ex.: `alter` → `type-ninja-alter`).
   */
  type: string;
  /** Variante do ícone de cada elemento, na ordem de `elements` da carta. */
  elements: ElementVariant[];
  /** Ninja, Cliente e Missão. */
  entrance?: EntranceIcon;
  hand?: HandIcon;
  /** Ninja: moldura das kunais do Atributo de Combate. */
  attribute?: AttributeFrame;
}

export interface CardLayoutInfo {
  /** Moldura, painel e posições dos elementos. */
  layout: LayoutId;
  /** Design alternativo do layout (`panelVariants` em src/lib/cardMaker/layouts/). Sem valor: o padrão. */
  panelVariant?: string;
  /** Mancha atrás do nome (layouts com o nome no topo). Sem valor: o padrão do layout. */
  nameBanner?: boolean;
  /**
   * Ajuste da fonte do nome, em pixels da carta, sobre o tamanho do layout: negativo diminui, positivo
   * aumenta. 0 (ou sem valor): o tamanho do layout.
   */
  nameSize?: number;
  /** Quebra de linha do nome (`NameWrap`). Sem valor: `auto`. */
  nameWrap?: NameWrap;
  /**
   * @deprecated Só na carga inicial (src/data/sets/, com os nomes em inglês): o ajuste do nome em PT-BR, que vira o
   * `nameSize` ao gravar o conteúdo (`cardsToPtBr`). O conteúdo do jogo não tem este campo.
   */
  nameSizePtBr?: number;
  /** @deprecated Como `nameSizePtBr`, para a quebra de linha. */
  nameWrapPtBr?: NameWrap;
  /** Nome como desenhado na carta montada, quando difere do nome da carta (ex.: com uma quebra de linha digitada). */
  nameText?: string;
  /**
   * Texto de efeito com a marcação do criador (negrito, {vermelho}, (azul)), quando difere do que sai do `text` da
   * carta (`catalogTextToMarkup`). O `text` da carta fica com o mesmo texto sem marcação (busca, detalhe).
   */
  textMarkup?: string;
  /** Vilas à esquerda do nome, quando diferem das que saem das características da carta. */
  villages?: { village: string; rogue: boolean }[];
  /** Sombreado atrás da frase sobre a impressa de fundo (`CustomCard.flavorShade`). Sem valor: ligado. */
  flavorShade?: boolean;
  icons: CardIcons;
  /**
   * Artes extraídas da carta (card-layouts/arts/<set>/<id>/<camada>.png →
   * public/card-layouts/arts/<set>/<id>/<camada>.webp). Só as camadas que existem; sem arte extraída, a de
   * trás é a carta impressa (`print`).
   */
  art: Partial<Record<ArtLayer, CardArtPlacement>>;
}

/** URL da arte extraída de uma carta (gerada por `npm run cards:layouts`); a pasta da coleção é o prefixo do id. */
export function cardArtUrl(cardId: string, layer: ArtLayer | 'print-clean'): string {
  return `/card-layouts/arts/${cardId.split('-')[0]}/${cardId}/${layer}.webp`;
}
