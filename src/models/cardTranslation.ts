/** Idioma em que o app mostra os textos das cartas. `en` = como impresso. */
export type CardLanguage = 'en' | 'pt-BR';

/**
 * Tradução PT-BR de uma carta (`src/data/ptbr/sets/`). Só os textos que mudam carta a carta;
 * as características saem do glossário (`translateCharacteristic`). Nome e Atributos de Combate
 * ficam em inglês (ver docs/TRADUCAO.md).
 */
export interface CardTranslation {
  /** Mesma quantidade de linhas do `text` em inglês, na mesma ordem. */
  text?: string[];
  /** Frase traduzida, com as mesmas aspas do original. */
  flavor?: string;
}

export type CardTranslations = Readonly<Record<string, CardTranslation>>;

/** Textos de uma carta prontos para exibir no idioma escolhido. */
export interface LocalizedCardText {
  text: string[];
  flavor?: string;
  characteristics: string[];
  rarity?: string;
  /** `false` quando o idioma é PT-BR mas a carta ainda não tem tradução (os textos ficam em inglês). */
  translated: boolean;
}
