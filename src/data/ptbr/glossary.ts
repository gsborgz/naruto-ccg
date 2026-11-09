/**
 * Termos fixos EN → PT-BR (docs/TRADUCAO.md). Usados na exibição; as regras do jogo continuam
 * lendo os termos em inglês dos dados (`Squad`, `Name: X`…).
 *
 * Fontes: rulebook PT-BR Ver. 2 (docs/REGRAS.md) e o glossário do remaster (scripts/card-remaster).
 * "Name: X" e "Mental Power: X" são tratados em `translateCharacteristic` e não entram na tabela.
 */
export const CHARACTERISTICS_PTBR: Readonly<Record<string, string>> = {
  // Hierarquias (REGRAS.md 4.10)
  'Ninja Academy Student': 'Estudante da Academia',
  Genin: 'Genin',
  Chunin: 'Chunin',
  'Special Jonin': 'Jonin Especial',
  Anbu: 'Anbu',
  Jonin: 'Jonin',
  Satoosa: 'Satoosa',
  Sannin: 'Sannin',
  'Village Leader': 'Líder da Vila',
  '(Genin)': '(Genin)',
  '(Jonin)': '(Jonin)',
  'Rogue Ninja': 'Ninja Renegado',
  'Rogue Ninja (Chunin)': 'Ninja Renegado (Chunin)',
  'Rogue Ninja (Jonin)': 'Ninja Renegado (Jonin)',
  'Ninja Hunter': 'Caçador Ninja',

  // Gênero
  Male: 'Masculino',
  Female: 'Feminino',

  // Regras especiais (REGRAS.md 6.x)
  Growth: 'Crescimento',
  Platoon: 'Pelotão',
  Ambush: 'Emboscada',
  Squad: 'Esquadrão',
  Surge: 'Surto',
  Mastery: 'Maestria',
  Reinforcement: 'Reforço',
  'Clone Status': 'Estado de Clone',
  'State 1': 'Estado 1',
  'State 2': 'Estado 2',

  // Vilas e países
  Leaf: 'Folha',
  Sand: 'Areia',
  Mist: 'Névoa',
  Sound: 'Som',
  Cloud: 'Nuvem',
  Stone: 'Pedra',
  Rock: 'Rocha',
  Rain: 'Chuva',
  Waterfall: 'Cachoeira',
  Snow: 'Neve',
  Star: 'Estrela',
  Takumi: 'Takumi',
  'Leaf Academy': 'Academia da Folha',
  'Land of Fire': 'País do Fogo',
  'Land of Wind': 'País do Vento',
  'Land of Waves': 'País das Ondas',
  'Land of Snow': 'País da Neve',
  'Land of Birds': 'País dos Pássaros',
  'Land of Bird': 'País do Pássaro',
  'Land of Greens': 'País dos Vegetais',
  'Land of Iron': 'País do Ferro',
  'Land of Moon': 'País da Lua',
  'Land of Rivers': 'País dos Rios',
  'Land of Rice Fields': 'País dos Arrozais',
  'Land of the Sea': 'País do Mar',
  'Land of Udon': 'País do Udon',
  'Land of Forest': 'País da Floresta',
  'Land of Mountains': 'País das Montanhas',

  // Olhos e linhagens
  'Sharingan Eye': 'Olho Sharingan',
  Byakugan: 'Byakugan',
  Byuakugan: 'Byakugan',
  Rinnegan: 'Rinnegan',
  'Main Branch': 'Família Principal',

  // Organizações, clãs e grupos
  Akatsuki: 'Akatsuki',
  Hebi: 'Hebi',
  Taka: 'Taka',
  'The Foundation': 'Raiz',
  'The Four Sound Ninja': 'Os Quatro Ninjas do Som',
  'The Found Sound Ninja': 'Os Quatro Ninjas do Som',
  Quartet: 'Quarteto',
  '12 Shinobi Guardians': '12 Ninjas Guardiões',
  'Four Celestials': 'Quatro Celestiais',
  'Three Criminals': 'Três Criminosos',
  'Magaki Group': 'Grupo Magaki',
  'Ryudoin Brothers': 'Irmãos Ryudoin',
  'Fuma Clan': 'Clã Fuma',
  'Tsuchigumo Clan': 'Clã Tsuchigumo',
  'Uemon Clan': 'Clã Uemon',
  'Kurama Clan': 'Clã Kurama',
  'Kedoin Clan': 'Clã Kedoin',
  'Senju Clan': 'Clã Senju',
  'Kurosuki Family': 'Família Kurosuki',
  'Akagi Family': 'Família Akagi',
  'Wasabi Family': 'Família Wasabi',
  'Wagarashi Family': 'Família Wagarashi',
  Gelel: 'Gelel',
  Legion: 'Legião',
  Rashomon: 'Rashomon',
  Circus: 'Circo',

  // Funções e ocupações
  Medical: 'Médico',
  'Dark Medical': 'Médico Sombrio',
  Proctor: 'Examinador',
  'Puppet Master': 'Mestre de Marionetes',
  Puppet: 'Marionete',
  Prisoner: 'Prisioneiro',
  Samurai: 'Samurai',
  Knight: 'Cavaleiro',
  Lord: 'Senhor',
  Lady: 'Dama',
  Prince: 'Príncipe',
  Princess: 'Princesa',
  Priestess: 'Sacerdotisa',
  Actress: 'Atriz',
  Celebrity: 'Celebridade',
  Thief: 'Ladrão',
  'Ex-Bandit': 'Ex-Bandido',
  'Bounty Hunter': 'Caçador de Recompensas',
  Wanted: 'Procurado',
  Wanderer: 'Andarilho',
  'Itinerant Ninja': 'Ninja Itinerante',
  'Ninja Dropout': 'Ninja Desistente',
  'Haze Ninja': 'Ninja da Bruma',
  'Cooking Ninja': 'Ninja Cozinheiro',
  Advisor: 'Conselheiro',
  Master: 'Mestre',
  President: 'Presidente',
  "Feudal Lord's Wife": 'Esposa do Senhor Feudal',
  Photographer: 'Fotógrafo',
  Boatman: 'Barqueiro',
  Director: 'Diretor',
  Boss: 'Chefe',
  Tactician: 'Estrategista',
  Messenger: 'Mensageiro',
  Guard: 'Guarda',
  Spy: 'Espião',
  'Cursed Warrior': 'Guerreiro Amaldiçoado',
  Ogre: 'Ogro',

  // Bestas, animais e espíritos
  Jinchuriki: 'Jinchuriki',
  'Tailed Beast': 'Besta com Caudas',
  'Tailed Beast Form': 'Forma de Besta com Caudas',
  Animal: 'Animal',
  'Ninja Dog': 'Cão Ninja',
  'Ninja Toad': 'Sapo Ninja',
  'Ninja Cat': 'Gato Ninja',
  'Tortoise Ninja': 'Tartaruga Ninja',
  'Sea Monster': 'Monstro Marinho',
  Snake: 'Cobra',
  Slug: 'Lesma',
  Pig: 'Porco',
  Cat: 'Gato',
  Tiger: 'Tigre',
  Falcon: 'Falcão',
  Weasel: 'Doninha',
  Insect: 'Inseto',
  Spirit: 'Espírito',
  Soul: 'Alma',
  'Fox Spirit': 'Espírito da Raposa',
  'Cat Spirit': 'Espírito do Gato',
  'Turtle Spirit': 'Espírito da Tartaruga',

  // Outros
  'Secret Pills': 'Pílulas Secretas',
  Vow: 'Juramento',
  Lock: 'Tranca',
};

export const RARITY_PTBR: Readonly<Record<string, string>> = {
  Common: 'Comum',
  Uncommon: 'Incomum',
  Rare: 'Rara',
  'Super Rare': 'Super Rara',
  'Starter Deck': 'Deck Inicial',
  'Super Rare (Starter Deck)': 'Super Rara (Deck Inicial)',
  Promo: 'Promo',
};

const NAME_PREFIX = 'Name:';
const MENTAL_POWER = /^Mental Power:\s*(.+)$/;

/**
 * Característica em PT-BR. "Name: X" vira "Nome: X" com o nome em inglês (os nomes das cartas não
 * são traduzidos, e X é o nome de outra carta). Termo fora do glossário fica como impresso.
 */
export function translateCharacteristic(characteristic: string): string {
  if (characteristic.startsWith(NAME_PREFIX)) return `Nome: ${characteristic.slice(NAME_PREFIX.length).trim()}`;
  const mental = MENTAL_POWER.exec(characteristic);
  if (mental) return `Poder Mental: ${mental[1]}`;
  return CHARACTERISTICS_PTBR[characteristic] ?? characteristic;
}

export function translateRarity(rarity: string): string {
  return RARITY_PTBR[rarity] ?? rarity;
}
