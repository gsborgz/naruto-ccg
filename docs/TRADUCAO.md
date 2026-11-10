# Tradução PT-BR das cartas

Os dados das cartas (`src/data/sets/`) ficam em inglês, como impressos. A versão em português fica à parte, em `src/data/ptbr/`, e só é usada na **exibição**: as regras do jogo (montagem, Baralho de Reforço, `Name: X`…) continuam lendo os dados em inglês.

No app, o seletor **EN | PT** do cabeçalho escolhe o idioma dos textos das cartas (efeitos, frases, características e raridade). A escolha fica no localStorage (`naruto-ccg:card-language`). As traduções só são baixadas quando o jogador escolhe PT. Carta sem tradução aparece em inglês, com um aviso no detalhe.

## Arquivos

- `src/data/ptbr/sets/<mesmo nome do arquivo em src/data/sets>.ts`: um objeto por coleção, com a chave sendo o `id` da carta e os campos `name` (só quando o nome muda; ver abaixo), `text` (mesmas linhas do original, na mesma ordem) e `flavor` (com as mesmas aspas do original).
- `src/data/ptbr/index.ts`: junta as coleções (`CARD_TRANSLATIONS_PTBR`) e lista as que estão completas (`TRANSLATED_SETS`).
- `src/data/ptbr/glossary.ts`: características, raridades, Atributos de Combate e nomes das coleções (iguais em todas as cartas, por isso ficam no glossário e não carta a carta).
- `src/data/ptbr/ptbr.test.ts`: confere ids, quantidade de linhas, títulos `[…]`, rótulos (`Alvo:`, `Efeito:`…), frases, se o glossário cobre tudo e se cartas com o mesmo nome em inglês têm o mesmo nome em PT-BR.

Para traduzir uma coleção nova: crie o arquivo em `sets/`, inclua em `index.ts` (no objeto e em `TRANSLATED_SETS`) e rode `npm test`.

## Uso nas cartas remasterizadas

As cartas PT-BR em alta resolução (`scripts/card-remaster/`) desenham **este mesmo texto**: `translations/<set>.json` do remaster é uma cópia de `src/data/ptbr/sets/` (a frase vai sem as aspas externas) e o `glossary.json` dele segue `glossary.ts`. Ajustes de tradução são feitos aqui e copiados para lá, nunca o contrário. Assim a carta e o app mostram o mesmo texto.

## Nomes das cartas

O rulebook PT-BR mantém os nomes em inglês, mas aqui eles são traduzidos para exibição (campo `name`) quando fazem sentido em português:

- **Jutsus e Missões**: `Shadow Clone Jutsu` → `Jutsu Clones das Sombras`, `Hokage Rocks` → `Monumento dos Hokages`, `Fire Style: Fireball Jutsu` → `Estilo Fogo: Jutsu Bola de Fogo`. Nomes japoneses ficam como estão (`Rasengan`, `Chidori`, `Kamui`).
- **Ninjas e Clientes descritivos**: `Giant Spider` → `Aranha Gigante`, `The Third Hokage` → `O Terceiro Hokage`, `Six Tails` → `Seis Caudas`, e os sufixos: `(Childhood)` → `(Infância)`, `(Sage Mode)` → `(Modo Sábio)`, `(State 2)` → `(Estado 2)`, `(Deva Path)` → `(Caminho Deva)`.
- **Personagens não mudam**: `Naruto Uzumaki`, `Kakashi Hatake`, `Gaara of the Desert`, `Might Guy`.
- O mesmo nome em inglês tem sempre o mesmo nome em PT-BR (o teste confere).
- **Citações no texto** usam o nome PT-BR da carta citada (`card de Missão "O Vale do Fim"`), inclusive partes de nome (`"Amassos" no nome`, `"Mundo" no nome`). `Name: X` vira `Nome: X` com o nome PT-BR de X, quando houver.
- **Nomes consagrados no Brasil** seguem a dublagem/mangá: `Make-Out Paradise` → `Jardim dos Amassos` (e a série: `Táticas dos Amassos`, `Violência dos Amassos`), `Body Flicker` → `Deslocamento Instantâneo`.
- **Citações impressas com o nome errado**: o texto em inglês fica como impresso (`src/data/sets/`), mas a tradução cita a carta certa:

  | Carta | Impresso | Carta citada |
  |---|---|---|
  | S17 N-815 Naruto Uzumaki | "Kakashi Hitake" | Kakashi Hatake |
  | S17 N-849 Cursed Warrior | "Ghost Samurai" | Cursed Warrior (a própria carta; é a única do tipo) |
  | S20 N-1100 Pain (Naraka Path) | "The Outer Path" | Heretical Icon (a estátua do Caminho Exterior, Ninja de Reforço) |
  | S25 N-1483 Seven Tails | Angering the Tailed Beast | Angering the Beast |
  | S28 N-1685 Madara Uchiha | Uchiha Madara | Madara Uchiha |
  | PR-034/PR-035 Naruto/Sasuke | "Final Valley" | The Final Valley |
  | S12 M-369 e S15 | "Nine-Tailed Fox Spirit" | The Nine-Tailed Fox Spirit |
- **Só exibição**: a regra de cópias, o `Name: X` das regras e a busca em inglês continuam usando o nome impresso. O detalhe da carta mostra o nome impresso logo abaixo do nome traduzido.

## Atributos de Combate e coleções

- **Atributos de Combate** (`"Kung Fu"`, `"Weapon"`, `"Flame"`…) são traduzidos pelo glossário (`COMBAT_ATTRIBUTES_PTBR`: `Weapon` → `Arma`, `Flame` → `Chama`, `Manipulation` → `Manipulação`). Ninjutsu, Taijutsu, Genjutsu e Kung Fu ficam como estão. As citações no texto (`Atributo de Combate "Arma"`) usam a mesma forma.
- **Coleções**: `SET_NAMES_PTBR` (`The Path to Hokage` → `O Caminho para Hokage`).

## O que não se traduz

- "Showdown", "Chakra", "Deck", "Jutsu", "Ninja", "Kekkei Genkai" e termos japoneses.
- Nomes de personagens (ver acima).

## Terminologia (rulebook PT-BR, docs/REGRAS.md)

| Inglês | PT-BR |
|---|---|
| card | card |
| Valid: / Requirements: / Target: / Effect: | Válido: / Requerimentos: / Alvo: / Efeito: |
| Counter / Permanent | Anulação / Permanente |
| User | Usuário |
| Village / Battlefield / Hand | Vila / Campo de Batalha / mão |
| Chakra area / Discard Pile | área de Chakra / Pilha de Descartes |
| Battle Reward (area) | Prêmio de Batalha (área de Prêmios de Batalha) |
| Reinforcement Deck | Baralho de Reforço |
| Removed from Game (Area) | Removido de Jogo (Área de Removidos de Jogo) |
| original owner | Dono Original |
| Team / Head Ninja / Back Ninja | Time / Ninja Líder / Ninja de Apoio |
| Battling / Non-Battling / Stand-By Ninja | Em Combate / Fora de Combate / Ninja Reserva |
| send out to Battle / Attack / block | enviar para a Batalha / Atacar / bloquear |
| Exchange of Jutsu / Mission Phase / Organization Phase | Troca de Jutsu / Fase de Missão / Fase de Organização |
| Combat / Support / Power / Team Power | Combate / Suporte / Poder / Poder do Time |
| healthy / injured status | Estado Saudável / Estado Ferido (ninjas "feridos") |
| Damage / give 1 Damage / heal / knocked down | Dano / cause 1 Dano / curar / Nocauteado |
| Victory / Outstanding Victory / Defeat / Complete Defeat | Vitória / Vitória Espetacular / Derrota / Derrota Completa |
| Outstanding Battle Reward / Draw | Prêmio de Batalha Espetacular / Empate |
| negate / Jutsu card being played | negar / card de Jutsu sendo usado |
| Entrance cost / Hand cost / Jutsu cost | Custo de Entrada / Custo de Mão / Custo de Jutsu |
| Rank / "Jonin" or higher Rank | Hierarquia / "Jonin" ou Hierarquia superior |
| Mental Power (Battle) | Poder Mental (Batalha Mental) |
| Ninja Blade coin / flip / heads / tails | Moeda Ninja / jogue a Moeda Ninja / cara / coroa |
| Ninja Blade coin symbolizing +1/+0 | Moeda Ninja que simboliza +1/+0 |
| Growth / Platoon / Ambush / Squad / Surge / Mastery | Crescimento / Pelotão / Emboscada / Esquadrão / Surto / Maestria |
| Poison Coin / Growth Coin | Marcador de Veneno / Marcador de Crescimento |
| Clone status | Estado de Clone |
| put in play / come into play / deploy | colocar em jogo / entrar em jogo / baixar |
| "1 Ninja card per turn" restriction | restrição de "1 card de Ninja por turno" |
| draw / shuffle / look at | compre / embaralhe / veja |
| At the beginning / end of the turn | No início / final do turno |
| during the turn / during this turn | durante o turno / durante este turno |
| gets +1/+1 / gets -1/-1 | ganha +1/+1 / recebe -1/-1 |
| chain (on the chain) | Sequência (na Sequência) |
| face up / face down | com a face para cima / com a face para baixo |
| flip a coin | jogue a Moeda Ninja |
| +1/+1 coin / -1/-1 coin / "X" coin | Marcador +1/+1 / Marcador -1/-1 / Marcador de "X" |
| Tracking / Tracked | Rastreamento / Rastreado |
| Sacrifice / Combination (X) / Charge | Sacrifício / Combinação (X) / Carregue |
| Expert [X]: | Especialista [X]: |
| Non-Unique | Não Único |
| Void (Símbolo) | Vazio |
| Senjutsu | Senjutsu (como impresso) |
| Revitalize / Inherit / Desperation / Burst / Flashpoint | Revitalizar / Herança / Desespero / Explosão / Ponto Crítico |
| Sensor / Ascendant / Shield / Evasive / Crush | Sensor / Ascendente / Escudo / Evasivo / Esmagar |
| Infiltrate / Masked / Companion / Guardian | Infiltrar / Mascarado / Companheiro / Guardião |

Marcações de momento dos efeitos ativados (S21 em diante): `[Valid | Attacker | Blocker | Mission | EOJ]` → `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`, na mesma ordem e com o mesmo custo entre parênteses. Títulos de efeito citados no texto (`[FOUR TAILS]`, `[IMPURE RESURRECTION]`) usam a tradução do título da carta (`[QUATRO CAUDAS]`, `[REENCARNAÇÃO IMPURA]`).

Características citadas entre aspas no texto usam a forma do glossário (`"Female" Ninja` → `Ninja "Feminino"`, `"Sharingan Eye"` → `"Olho Sharingan"`, `"Rogue Ninjas"` → `"Ninjas Renegados"`), para bater com o que aparece nas características da carta. Hierarquias iguais em PT ("Genin", "Jonin") ficam como estão.

## Estilo

- **Títulos `[…]`** (nome do efeito) são traduzidos, curtos, com iniciais maiúsculas: `[Love's Rival]` → `[Rival no Amor]`. Nas coleções impressas em maiúsculas (S12, S15, S18 em diante, TPs e a maioria das Promos) o título PT também fica em maiúsculas: `[TAG TEAM]` → `[DUPLA]`.
- **Efeitos**: fiéis às regras, sem resumir nem acrescentar. Na dúvida sobre o sentido de uma regra, siga `docs/REGRAS.md` e anote para o usuário em vez de chutar.
- **Frases**: português natural, no tom da fala do anime, sem traduzir ao pé da letra. Mantêm as aspas, reticências e símbolos (♥) do original. Nomes de jutsus nas falas seguem a dublagem quando conhecida ("Jutsu Clones das Sombras").
- Mantenha os números, `X`/`Y` e as aspas `"` do original.
