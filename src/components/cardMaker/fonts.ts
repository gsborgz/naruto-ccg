import { Montserrat, Open_Sans, Trirong } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Fontes escolhidas comparando com os exemplos do layout 1 (card-layouts/examples/layout-01):
 * - Naruto CCG Title (fonts/naruto-ccg-title.ttf): nome da carta. Fonte própria, redesenhada a
 *   partir dos nomes impressos nas cartas (média de milhares de letras recortadas de S01–S27,
 *   gerada por scripts/card-font/). Escala: font-size 50 dá a altura de maiúscula impressa no
 *   layout 1. X e V foram montados a partir de Y, K e A (poucas ou nenhuma amostra). Caracteres que
 *   não aparecem nos nomes impressos (0–3, 5–9, `:`, `,`, `?`, `()`, acentos) caem na Trirong;
 * - Trirong 700: números e o "or" dos custos (serifa pesada, larguras próximas das impressas);
 * - Open Sans 600/700: efeito, características e frase (quebra as linhas nos mesmos pontos);
 *   800 (ExtraBold) nos trechos em negrito do efeito (`TEXT_BOLD_WEIGHT`);
 * - Montserrat 800: nome escrito de lado nos ícones de tipo e elemento ("NINJA", "WATER"...).
 */
export const titleFont = localFont({ src: './fonts/naruto-ccg-title.ttf', weight: '400', variable: '--font-card-title' });
export const nameFont = Trirong({ weight: '700', subsets: ['latin'], variable: '--font-card-name' });
export const bodyFont = Open_Sans({ weight: ['600', '700', '800'], subsets: ['latin'], variable: '--font-card-body' });
export const iconLabelFont = Montserrat({ weight: '800', subsets: ['latin'], variable: '--font-card-icon-label' });

/** Peso do negrito no texto de efeito (`[trecho]`). A Open Sans vai até 800. */
export const TEXT_BOLD_WEIGHT = 800;

export const CARD_FONT_VARIABLES = `${titleFont.variable} ${nameFont.variable} ${bodyFont.variable} ${iconLabelFont.variable}`;
