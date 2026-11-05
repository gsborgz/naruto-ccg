export type CardType = 'ninja' | 'jutsu' | 'mission' | 'client';

/** Símbolos elementais impressos no canto superior direito da carta. `void` (無) aparece a partir do S19. */
export type ElementSymbol = 'lightning' | 'fire' | 'wind' | 'water' | 'earth' | 'void';

/**
 * Atributo de combate do Ninja (ícone no canto inferior direito), como impresso
 * (ex.: "Ninjutsu", "Weapon", "Kung Fu", "Illusion", "Mist"). O jogo tem muitos.
 */
export type CombatAttribute = string;

export interface Power {
  /** `'X'` quando a carta imprime X (ex.: S20 N-1062 "X/0"); o valor vem do texto da carta. */
  combat: number | 'X';
  support: number;
}

interface BaseCard {
  /** Identificador interno, estável. Não usar o número impresso (há números repetidos entre cartas). */
  id: string;
  /** Nome exibido, como impresso na carta. Para a regra de cópias, ver `deckName`. */
  name: string;
  type: CardType;
  elements: ElementSymbol[];
  /** Número impresso (ex.: "001", "US072", "PR-065"). Apenas informativo. */
  number: string;
  /** Código do set (ex.: "S01", "TP1"); nomes em `src/data/sets.ts`. */
  set: string;
  /** Raridade, como no CCG Trader (ex.: "Common", "Super Rare", "Starter Deck"). */
  rarity?: string;
  /** Texto de efeito, uma linha por bloco impresso. */
  text: string[];
  /** Nome do arquivo da imagem, sem extensão (ver `cardImageUrl`). */
  image: string;
}

export interface NinjaCard extends BaseCard {
  type: 'ninja';
  entranceCost: number;
  handCost: number;
  characteristics: string[];
  healthy: Power;
  injured: Power;
  attributes: CombatAttribute[];
}

/** Uma forma de pagar o custo de um Jutsu: símbolos específicos + Chakra genérico. */
export interface JutsuCostOption {
  /** Símbolos exigidos no Chakra (ex.: dois Raios). */
  symbols: ElementSymbol[];
  /** Quantidade de Chakra genérico, ou "X" quando o jogador escolhe quanto pagar. */
  generic: number | 'X';
  /**
   * Quantos ícones "X" estão impressos (ex.: "X | X" = 2). Ausente = 1.
   * Todos os X têm o mesmo valor, e para cada X move-se essa quantidade de Chakras (REGRAS.md 3.5.3).
   */
  xCount?: number;
}

export interface JutsuCost extends JutsuCostOption {
  /**
   * Custos alternativos impressos depois de "or" (a partir do S15): o jogador escolhe qual pagar.
   * Ex.: "土 | 1 or 水 | 1" → custo principal 土+1 e alternativa 水+1; "土土 or 3" → alternativa 3 genérico.
   * Não está nos livros de regras; alguns textos se referem a ela ("If the higher cost of this Jutsu was paid").
   */
  alternatives?: JutsuCostOption[];
}

export interface JutsuCard extends BaseCard {
  type: 'jutsu';
  cost: JutsuCost;
}

export interface MissionCard extends BaseCard {
  type: 'mission';
  entranceCost: number;
  handCost: number;
}

export interface ClientCard extends BaseCard {
  type: 'client';
  entranceCost: number;
  handCost: number;
  characteristics: string[];
}

export type Card = NinjaCard | JutsuCard | MissionCard | ClientCard;

/**
 * Nome da carta para a regra "até 3 cartas com o mesmo nome" na montagem do deck
 * (rulebook PT-BR, "Nome de um Card", p. 43–44):
 * - é o nome impresso completo, incluindo o que estiver entre parênteses
 *   ("Naruto Uzumaki (Sage Mode)" ≠ "Naruto Uzumaki");
 * - a característica "Name: X" NÃO conta na montagem (ela vale só em jogo, ver `getInPlayNames`).
 */
export function deckName(card: Pick<Card, 'name'>): string {
  return card.name;
}

/** Chave de comparação do nome: ignora maiúsculas e espaços extras (diferenças de transcrição). */
export function deckNameKey(card: Pick<Card, 'name'>): string {
  return card.name.trim().replace(/\s+/g, ' ').toLowerCase();
}

const NAME_PREFIX = 'Name:';

/**
 * Nomes da carta EM JOGO (rulebook PT-BR, p. 44, (B)): o nome impresso mais cada "Name: X" das
 * características. Serve para a regra da Vila (não pode haver 2 Ninjas/Clientes com o mesmo nome) e
 * para efeitos que procuram cartas por nome. Não é usado na montagem do deck.
 */
export function getInPlayNames(card: Card): string[] {
  const extra =
    'characteristics' in card
      ? card.characteristics
          .filter((c) => c.startsWith(NAME_PREFIX))
          .map((c) => c.slice(NAME_PREFIX.length).trim())
          .filter(Boolean)
      : [];
  return [card.name, ...extra];
}

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  ninja: 'Ninja',
  jutsu: 'Jutsu',
  mission: 'Missão',
  client: 'Cliente',
};

export const ELEMENT_LABEL: Record<ElementSymbol, string> = {
  lightning: 'Raio',
  fire: 'Fogo',
  wind: 'Vento',
  water: 'Água',
  earth: 'Terra',
  void: 'Vazio',
};

export const ELEMENT_KANJI: Record<ElementSymbol, string> = {
  lightning: '雷',
  fire: '火',
  wind: '風',
  water: '水',
  earth: '土',
  void: '無',
};

/**
 * URL da imagem otimizada da carta (gerada por `npm run cards:images`).
 * As imagens ficam numa pasta por set: /cards/<set>/<id>.webp e /cards/<set>/thumbs/<id>.webp.
 */
export function cardImageUrl(card: Pick<Card, 'set' | 'image'>, size: 'full' | 'thumb' = 'full'): string {
  const dir = `/cards/${card.set.toLowerCase()}`;
  return size === 'thumb' ? `${dir}/thumbs/${card.image}.webp` : `${dir}/${card.image}.webp`;
}
