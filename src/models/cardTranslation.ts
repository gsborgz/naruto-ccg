/** Idioma em que o app mostra os textos das cartas. `en` = como impresso. */
export type CardLanguage = 'en' | 'pt-BR';

/**
 * Tradução PT-BR de uma carta (`src/data/ptbr/sets/`). Só os textos que mudam carta a carta;
 * características, Atributos de Combate e coleções saem do glossário (`glossary.ts`).
 * Ver docs/TRADUCAO.md.
 */
export interface CardTranslation {
  /**
   * Nome em PT-BR, só quando muda (Jutsus, Missões e Ninjas descritivos, ex.: "Giant Spider").
   * Nomes de personagens ficam como impressos. Cartas com o mesmo nome em inglês têm o mesmo nome aqui.
   * Só para exibição: a regra de cópias e o "Name: X" continuam usando o nome em inglês.
   */
  name?: string;
  /** Mesma quantidade de linhas do `text` em inglês, na mesma ordem. */
  text?: string[];
  /** Frase traduzida, com as mesmas aspas do original. */
  flavor?: string;
}

export type CardTranslations = Readonly<Record<string, CardTranslation>>;

/** Textos de uma carta prontos para exibir no idioma escolhido. */
export interface LocalizedCardText {
  name: string;
  text: string[];
  flavor?: string;
  characteristics: string[];
  /** Atributos de Combate (só Ninjas). */
  attributes: string[];
  rarity?: string;
  /** `false` quando o idioma é PT-BR mas a carta ainda não tem tradução (os textos ficam em inglês). */
  translated: boolean;
}
