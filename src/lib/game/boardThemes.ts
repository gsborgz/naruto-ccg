/**
 * Temas da arena (design "Campo de Jogo", TEMAS.md: madeira, nuvens, papel, folhas, bambu, areia e água):
 * mesmo layout, tamanhos e formas em todos; mudam só as variáveis de cor e sombra, a fonte e as texturas
 * (fundo da mesa, borda e miolo do Campo de Batalha) e, nos temas de mesa clara, o fundo das zonas.
 *
 * O tema é da partida (`GameState.theme`): sorteado no início e trocado por qualquer um dos dois jogadores,
 * para os dois verem o mesmo. As texturas ficam em `public/textures/` (ladrilhos sem emenda: não ampliar
 * além de 2×, senão borram). As costas das cartas são a imagem da carta física em todos os temas.
 *
 * Dados puros (sem React): o modelo da partida importa daqui a lista de ids.
 */

export interface BoardTheme {
  id: string;
  /** Nome mostrado no seletor. */
  name: string;
  /** Variáveis --color-* e --shadow-* aplicadas na raiz da arena. */
  vars: Record<string, string>;
  fontHref: string;
  fontFamily: string;
  /** Fundo da área inteira (fora do palco escalado). */
  pageBg: string;
  /** Camada de fora do octógono do Campo de Batalha (a borda de 1px). */
  arenaBorder: string;
  /** Camada de dentro do octógono (inset 1px, chanfro de 43px). */
  arenaBg: string;
  /**
   * Fundo das zonas das linhas, para temas com a mesa clara (o "scrim" escuro translúcido que deixa as
   * cartas e os rótulos legíveis). Sem isso, o degradê padrão (neutral-900 / accent-900 até transparente).
   */
  zoneFillOpp?: string;
  zoneFillMine?: string;
}

const ZEN_OLD_MINCHO = 'https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;600;700&display=swap';
const SHIPPORI_MINCHO = 'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;600;700&display=swap';

const tex = (file: string) => `url('/textures/${file}')`;

export const BOARD_THEMES: readonly BoardTheme[] = [
  {
    id: 'madeira',
    name: 'Madeira antiga',
    fontHref: ZEN_OLD_MINCHO,
    fontFamily: "'Zen Old Mincho', serif",
    vars: {
      '--color-bg': '#1d140e',
      '--color-surface': '#2c1f15',
      '--color-text': '#ecdfc6',
      '--color-section': '#3a2819',
      '--color-section-glow': '#5a3a22',
      '--color-neutral-100': '#f4ead6',
      '--color-neutral-200': '#e6d6b8',
      '--color-neutral-300': '#d2bd98',
      '--color-neutral-400': '#b49c76',
      '--color-neutral-500': '#917a58',
      '--color-neutral-600': '#6e5b40',
      '--color-neutral-700': '#51422e',
      '--color-neutral-800': '#3b2f21',
      '--color-neutral-900': '#281e15',
      '--color-accent-100': '#fbe7dc',
      '--color-accent-200': '#f3c7ae',
      '--color-accent-300': '#e8a383',
      '--color-accent-400': '#d97b5a',
      '--color-accent-500': '#c4583a',
      '--color-accent-600': '#a0412b',
      '--color-accent-700': '#7c3121',
      '--color-accent-800': '#5b2418',
      '--color-accent-900': '#3e1a11',
      '--color-accent': '#c4583a',
      '--shadow-sm': '0 0 0 1px #3b2f21',
      '--shadow-md': '0 0 0 1px #6e5b40, 0 6px 16px rgba(0,0,0,.6)',
      '--shadow-lg': '0 0 0 1px #917a58, 0 16px 40px rgba(0,0,0,.7)',
    },
    pageBg: `radial-gradient(110% 85% at 45% 52%, transparent 35%, rgba(0,0,0,.65) 100%), ${tex('madeira-fundo.svg')} 0 0/640px 384px repeat, #1d140e`,
    arenaBorder: 'linear-gradient(180deg, #7a5a36, #4a2f1a 50%, #7a5a36)',
    arenaBg: `radial-gradient(60% 55% at 50% 50%, rgba(255,210,150,.07), transparent 70%), radial-gradient(85% 95% at 50% 50%, transparent 35%, rgba(10,5,2,.6) 100%), ${tex('madeira-arena.svg')} 0 0/640px 456px repeat`,
  },
  {
    id: 'nuvens',
    name: 'Nuvens',
    fontHref: SHIPPORI_MINCHO,
    fontFamily: "'Shippori Mincho', serif",
    vars: {
      '--color-bg': '#1b1b1f',
      '--color-surface': '#28282d',
      '--color-text': '#efe7d4',
      '--color-section': '#34323a',
      '--color-section-glow': '#4a2a2c',
      '--color-accent': '#c9443f',
      '--color-neutral-100': '#f7f0e0',
      '--color-neutral-200': '#ece2cb',
      '--color-neutral-300': '#d9cdb3',
      '--color-neutral-400': '#bab09a',
      '--color-neutral-500': '#97907f',
      '--color-neutral-600': '#767165',
      '--color-neutral-700': '#57544c',
      '--color-neutral-800': '#3e3c38',
      '--color-neutral-900': '#2a292a',
      '--color-accent-100': '#fde4e0',
      '--color-accent-200': '#f6bdb5',
      '--color-accent-300': '#ec9187',
      '--color-accent-400': '#df665c',
      '--color-accent-500': '#c9443f',
      '--color-accent-600': '#a63431',
      '--color-accent-700': '#812826',
      '--color-accent-800': '#5d1e1d',
      '--color-accent-900': '#3f1515',
      '--shadow-sm': '0 0 0 1px #3e3c38',
      '--shadow-md': '0 0 0 1px #767165, 0 6px 16px rgba(0,0,0,.6)',
      '--shadow-lg': '0 0 0 1px #97907f, 0 16px 40px rgba(0,0,0,.7)',
    },
    pageBg: `radial-gradient(110% 85% at 45% 52%, transparent 35%, rgba(0,0,0,.6) 100%), ${tex('nuvens-fundo.svg')} 0 0/240px 144px repeat, #1b1b1f`,
    arenaBorder: 'linear-gradient(180deg, var(--color-neutral-600), var(--color-accent-600))',
    arenaBg: `radial-gradient(80% 90% at 50% 50%, transparent 30%, rgba(0,0,0,.5) 100%), ${tex('nuvens-arena.svg')} 0 0/180px 108px repeat, linear-gradient(180deg, #2c2a30 0%, #252328 50%, #34252a 100%)`,
  },
  {
    // Único tema claro: as escalas são invertidas (100 = tinta escura, 900 = papel claro), então o resto
    // da arena funciona sem mudanças.
    id: 'papel',
    name: 'Papel antigo',
    fontHref: ZEN_OLD_MINCHO,
    fontFamily: "'Zen Old Mincho', serif",
    vars: {
      '--color-bg': '#e6d6b4',
      '--color-surface': '#efe3c8',
      '--color-text': '#2b2117',
      '--color-section': '#cdb68c',
      '--color-section-glow': '#e8d5ad',
      '--color-accent': '#9c3826',
      '--color-neutral-100': '#2b2117',
      '--color-neutral-200': '#3d3023',
      '--color-neutral-300': '#564533',
      '--color-neutral-400': '#725e47',
      '--color-neutral-500': '#8f785c',
      '--color-neutral-600': '#a99273',
      '--color-neutral-700': '#c2ad8b',
      '--color-neutral-800': '#d6c4a0',
      '--color-neutral-900': '#efe4cb',
      '--color-accent-100': '#3f150f',
      '--color-accent-200': '#5c1f16',
      '--color-accent-300': '#7d2b1e',
      '--color-accent-400': '#9c3826',
      '--color-accent-500': '#b4472f',
      '--color-accent-600': '#c9654c',
      '--color-accent-700': '#dc957b',
      '--color-accent-800': '#e9bfa9',
      '--color-accent-900': '#f4dccd',
      '--shadow-sm': '0 0 0 1px #c2ad8b',
      '--shadow-md': '0 0 0 1px #8f785c, 0 4px 10px rgba(70,45,20,.35)',
      '--shadow-lg': '0 0 0 1px #725e47, 0 14px 30px rgba(70,45,20,.45)',
    },
    pageBg: `radial-gradient(120% 95% at 50% 50%, transparent 45%, rgba(110,70,30,.35) 80%, rgba(70,40,15,.7) 100%), radial-gradient(18% 14% at 12% 22%, rgba(140,95,40,.18), transparent 70%), radial-gradient(22% 16% at 88% 78%, rgba(140,95,40,.16), transparent 70%), radial-gradient(14% 12% at 70% 12%, rgba(140,95,40,.12), transparent 70%), ${tex('papel.svg')} 0 0/320px 320px repeat, linear-gradient(170deg, #e4d2ab, #d9c497 55%, #ddc89d)`,
    arenaBorder: 'linear-gradient(180deg, var(--color-neutral-600), var(--color-accent-600))',
    arenaBg: `radial-gradient(85% 95% at 50% 50%, transparent 45%, rgba(120,80,35,.28) 100%), ${tex('papel.svg')} 40px 60px/260px 260px repeat, linear-gradient(180deg, #f4ead3 0%, #f1e5ca 50%, #eedfc0 100%)`,
  },
  {
    id: 'folhas',
    name: 'Folhas',
    fontHref: ZEN_OLD_MINCHO,
    fontFamily: "'Zen Old Mincho', serif",
    vars: {
      '--color-bg': '#15200f',
      '--color-surface': '#1f2c19',
      '--color-text': '#eef3e6',
      '--color-section': '#253a1d',
      '--color-section-glow': '#34521f',
      '--color-accent': '#e4b444',
      '--color-neutral-100': '#eef3e6',
      '--color-neutral-200': '#dbe5cf',
      '--color-neutral-300': '#c0cfb0',
      '--color-neutral-400': '#9fb18d',
      '--color-neutral-500': '#7f926d',
      '--color-neutral-600': '#627452',
      '--color-neutral-700': '#47573b',
      '--color-neutral-800': '#313e29',
      '--color-neutral-900': '#212b1c',
      '--color-accent-100': '#fff4d6',
      '--color-accent-200': '#fbe3a2',
      '--color-accent-300': '#f1cc6c',
      '--color-accent-400': '#e4b444',
      '--color-accent-500': '#cc9a2c',
      '--color-accent-600': '#a67b22',
      '--color-accent-700': '#7f5d1b',
      '--color-accent-800': '#5b4315',
      '--color-accent-900': '#3c2c0f',
      '--shadow-sm': '0 0 0 1px #313e29',
      '--shadow-md': '0 0 0 1px #627452, 0 6px 16px rgba(0,0,0,.55)',
      '--shadow-lg': '0 0 0 1px #7f926d, 0 16px 40px rgba(0,0,0,.65)',
    },
    pageBg: `radial-gradient(115% 90% at 45% 52%, transparent 35%, rgba(3,8,2,.7) 100%), ${tex('folhas-fundo.svg')} 0 0/260px 260px repeat, #15200f`,
    arenaBorder: 'linear-gradient(180deg, var(--color-neutral-600), var(--color-accent-600))',
    arenaBg: `radial-gradient(85% 95% at 50% 50%, transparent 40%, rgba(4,10,3,.5) 100%), ${tex('folhas-arena.svg')} 40px 70px/220px 220px repeat, linear-gradient(180deg, #1f3318 0%, #1b2d15 50%, #21361a 100%)`,
  },
  {
    id: 'bambu',
    name: 'Bambu',
    fontHref: ZEN_OLD_MINCHO,
    fontFamily: "'Zen Old Mincho', serif",
    vars: {
      '--color-bg': '#1a170c',
      '--color-surface': '#27230f',
      '--color-text': '#efe9d2',
      '--color-section': '#38331a',
      '--color-section-glow': '#4d4620',
      '--color-accent': '#5fa04a',
      '--color-neutral-100': '#f5f1df',
      '--color-neutral-200': '#e6dfc2',
      '--color-neutral-300': '#d0c69e',
      '--color-neutral-400': '#b1a679',
      '--color-neutral-500': '#90865b',
      '--color-neutral-600': '#706843',
      '--color-neutral-700': '#534d31',
      '--color-neutral-800': '#3b3723',
      '--color-neutral-900': '#282518',
      '--color-accent-100': '#e6f6dc',
      '--color-accent-200': '#c3e7b0',
      '--color-accent-300': '#9dd385',
      '--color-accent-400': '#7bbd63',
      '--color-accent-500': '#5fa04a',
      '--color-accent-600': '#4b823a',
      '--color-accent-700': '#3a642d',
      '--color-accent-800': '#2a4821',
      '--color-accent-900': '#1c3016',
      '--shadow-sm': '0 0 0 1px #3b3723',
      '--shadow-md': '0 0 0 1px #706843, 0 6px 16px rgba(0,0,0,.6)',
      '--shadow-lg': '0 0 0 1px #90865b, 0 16px 40px rgba(0,0,0,.7)',
    },
    pageBg: `radial-gradient(110% 85% at 45% 52%, transparent 35%, rgba(0,0,0,.65) 100%), ${tex('bambu-fundo.svg')} 0 0/448px 420px repeat, #1a170c`,
    arenaBorder: 'linear-gradient(180deg, #9a8a4a, #5a4e24 50%, #9a8a4a)',
    arenaBg: `radial-gradient(60% 55% at 50% 50%, rgba(230,240,170,.07), transparent 70%), radial-gradient(85% 95% at 50% 50%, transparent 35%, rgba(10,5,2,.6) 100%), ${tex('bambu-arena.svg')} 0 0/456px 456px repeat`,
  },
  {
    // Deserto (paleta do Gaara): a mesa é clara, então as zonas têm o fundo escuro translúcido.
    id: 'areia',
    name: 'Areia',
    fontHref: ZEN_OLD_MINCHO,
    fontFamily: "'Zen Old Mincho', serif",
    vars: {
      '--color-bg': '#1f1318',
      '--color-surface': '#2c1c22',
      '--color-text': '#f6eee0',
      '--color-section': '#3e2228',
      '--color-section-glow': '#5c2a2a',
      '--color-accent': '#c0412f',
      '--color-neutral-100': '#f6eee0',
      '--color-neutral-200': '#e9dcc4',
      '--color-neutral-300': '#d4c0a0',
      '--color-neutral-400': '#b39c80',
      '--color-neutral-500': '#8f7466',
      '--color-neutral-600': '#6e5150',
      '--color-neutral-700': '#523a40',
      '--color-neutral-800': '#3c2830',
      '--color-neutral-900': '#2a1b22',
      '--color-accent-100': '#fde3dc',
      '--color-accent-200': '#f6b8aa',
      '--color-accent-300': '#ec8c7a',
      '--color-accent-400': '#db5f4c',
      '--color-accent-500': '#c0412f',
      '--color-accent-600': '#9d3226',
      '--color-accent-700': '#7a261f',
      '--color-accent-800': '#591c18',
      '--color-accent-900': '#3d1412',
      '--shadow-sm': '0 0 0 1px #3c2830',
      '--shadow-md': '0 0 0 1px #6e5150, 0 6px 16px rgba(0,0,0,.6)',
      '--shadow-lg': '0 0 0 1px #8f7466, 0 16px 40px rgba(0,0,0,.7)',
    },
    pageBg: `linear-gradient(180deg, rgba(30,8,12,.62) 0%, rgba(30,8,12,.18) 30%, rgba(30,8,12,.18) 68%, rgba(30,8,12,.66) 100%), radial-gradient(110% 85% at 45% 52%, transparent 45%, rgba(25,6,10,.5) 100%), ${tex('dunas-fundo.svg')} 0 0/640px 400px repeat, #1f1318`,
    arenaBorder: 'linear-gradient(180deg, #d9c08f, #7a261f 50%, #d9c08f)',
    arenaBg: `radial-gradient(85% 95% at 50% 50%, transparent 40%, rgba(40,10,16,.45) 100%), linear-gradient(rgba(74,30,32,.5), rgba(62,24,28,.56)), ${tex('papel.svg')} 0 0/320px 320px repeat, ${tex('dunas-fundo.svg')} 0 0/640px 400px repeat`,
    zoneFillOpp: 'linear-gradient(180deg, rgba(42,27,34,.88), rgba(42,27,34,.5))',
    zoneFillMine: 'linear-gradient(0deg, rgba(61,20,18,.9), rgba(42,27,34,.55))',
  },
  {
    // Água: a mesa é clara, então as zonas têm o fundo escuro translúcido.
    id: 'agua',
    name: 'Água',
    fontHref: SHIPPORI_MINCHO,
    fontFamily: "'Shippori Mincho', serif",
    vars: {
      '--color-bg': '#0a1a33',
      '--color-surface': '#10264a',
      '--color-text': '#eef7ff',
      '--color-section': '#123360',
      '--color-section-glow': '#1d4c8a',
      '--color-accent': '#5cc8f0',
      '--color-neutral-100': '#eef7ff',
      '--color-neutral-200': '#d6ebfb',
      '--color-neutral-300': '#b4d6f2',
      '--color-neutral-400': '#8cb8e0',
      '--color-neutral-500': '#6896c4',
      '--color-neutral-600': '#4a77a6',
      '--color-neutral-700': '#335b85',
      '--color-neutral-800': '#213f62',
      '--color-neutral-900': '#142a46',
      '--color-accent-100': '#e3f8ff',
      '--color-accent-200': '#bfeefd',
      '--color-accent-300': '#93e0fa',
      '--color-accent-400': '#6dd2f5',
      '--color-accent-500': '#4ebfe8',
      '--color-accent-600': '#3299c9',
      '--color-accent-700': '#2475a1',
      '--color-accent-800': '#1a5579',
      '--color-accent-900': '#113a54',
      '--shadow-sm': '0 0 0 1px #213f62',
      '--shadow-md': '0 0 0 1px #4a77a6, 0 6px 16px rgba(2,10,30,.55)',
      '--shadow-lg': '0 0 0 1px #6896c4, 0 16px 40px rgba(2,10,30,.65)',
    },
    pageBg: `radial-gradient(60% 50% at 85% 8%, rgba(255,255,255,.18), transparent 70%), radial-gradient(110% 85% at 45% 52%, transparent 50%, rgba(5,20,50,.35) 100%), ${tex('agua-fundo.svg')} 0 0/512px 512px repeat, #0a1a33`,
    arenaBorder: 'linear-gradient(180deg, #d6f2ff, #2475a1 50%, #d6f2ff)',
    arenaBg: `radial-gradient(85% 95% at 50% 50%, transparent 40%, rgba(4,16,40,.5) 100%), linear-gradient(rgba(8,28,64,.55), rgba(6,22,52,.62)), ${tex('agua-arena.svg')} 0 0/512px 512px repeat`,
    zoneFillOpp: 'linear-gradient(180deg, rgba(10,32,66,.88), rgba(10,32,66,.5))',
    zoneFillMine: 'linear-gradient(0deg, rgba(14,48,96,.9), rgba(10,32,66,.55))',
  },
];

export const BOARD_THEME_IDS: readonly string[] = BOARD_THEMES.map((t) => t.id);

/** Tema usado quando a partida não tem um (partidas criadas antes dos temas). */
export const DEFAULT_BOARD_THEME = 'madeira';

export function boardTheme(id: string | undefined): BoardTheme {
  return BOARD_THEMES.find((t) => t.id === id) ?? BOARD_THEMES.find((t) => t.id === DEFAULT_BOARD_THEME)!;
}
