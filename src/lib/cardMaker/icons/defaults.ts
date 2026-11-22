import type { CombatAttributeIconConfig, IconNumberStyle, IconSideLabel, AttributePairStyle } from './types.ts';

/** Pasta pública dos ícones (gerada por `npm run cards:layouts`). */
export const ICON_ASSETS = '/card-layouts/icons';
export const iconUrl = (group: string, file: string) => `${ICON_ASSETS}/${group}/${file}.webp`;

/**
 * Estilos de partida, espalhados (`...`) nos arquivos de cada ícone. Para mudar um ícone só, sobrescreva
 * o campo no arquivo dele.
 */

/** Nome de lado nos ícones de tipo e elemento: branco com contorno escuro e sombra. */
export const SIDE_LABEL_STYLE: Omit<IconSideLabel, 'text' | 'cx' | 'cy' | 'cap' | 'length'> = {
  color: '#f6f3ee',
  stroke: '#2a1810',
  strokeWidth: 0.14,
  weight: 800,
  // Sombra para a direita da carta (para "baixo" do texto deitado).
  shadow: { color: '#1b0f0a', opacity: 0.85, dx: 0.12, dy: 0.04, blur: 0.06 },
};

/** Números dos custos: brancos com contorno escuro. */
export const NUMBER_STYLE: Pick<IconNumberStyle, 'color' | 'stroke'> = { color: '#fff', stroke: '#1c1c1c' };

/**
 * Sombra atrás do kanji e do nome do Atributo de Combate, para ficarem legíveis em qualquer moldura
 * (ex.: kanji branco sobre o dourado). Duas camadas: uma justa (`tight`), que contorna o desenho, e uma
 * difusa (`soft`). Tamanhos em frações do raio do círculo do atributo; para mais ou menos sombra,
 * mude `tight`/`soft` ou a opacidade da cor.
 */
export const ATTRIBUTE_SHADOW = { color: 'rgba(20, 10, 4, 0.9)', tight: 0.06, soft: 0.2 };

/** Atributo de Combate: o que é igual em todas as molduras. */
/** Dois atributos, nos ícones que ainda não têm medidas próprias (`CombatAttributeIconConfig.pair`). */
export const ATTRIBUTE_PAIR_DEFAULT: AttributePairStyle = {
  kanjiSize: 0.95,
  kanjiGap: 0.95,
  kanjiDy: -0.2,
  slashSize: 0.75,
  labelDy: 0.56,
  labelScale: 0.8,
};

export const ATTRIBUTE_TEXT_STYLE: {
  power: Pick<CombatAttributeIconConfig['power'], 'strokeWidth' | 'color' | 'stroke'>;
  label: Pick<CombatAttributeIconConfig['label'], 'color' | 'stroke' | 'multiMax' | 'dyWithKanji'>;
  kanji: CombatAttributeIconConfig['kanji'];
} = {
  // Contorno de 7 px com a tela de 1215 px exibida em 333 px (cada moldura repete o valor no arquivo dela).
  power: { strokeWidth: 25.5, color: '#fff', stroke: '#1c1c1c' },
  label: { color: '#fbf6ea', stroke: '#1c1c1c', multiMax: 1.35, dyWithKanji: [0.62, 0.58, 0.5] },
  // Tela do kanji de 256×256 com o desenho ocupando ~65%.
  kanji: { size: 1.7, dy: -0.12, textSize: 1.05, textColor: '#fbf6ea', textStroke: 'rgba(60,30,10,0.55)' },
};
