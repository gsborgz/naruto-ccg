# Tradução PT-BR das cartas

Os dados das cartas (`src/data/sets/`) ficam em inglês, como impressos. A versão em português fica à parte, em `src/data/ptbr/`, e só é usada na **exibição**: as regras do jogo (montagem, Baralho de Reforço, `Name: X`…) continuam lendo os dados em inglês.

No app, o seletor **EN | PT** do cabeçalho escolhe o idioma dos textos das cartas (efeitos, frases, características e raridade). A escolha fica no localStorage (`naruto-ccg:card-language`). As traduções só são baixadas quando o jogador escolhe PT. Carta sem tradução aparece em inglês, com um aviso no detalhe.

## Arquivos

- `src/data/ptbr/sets/<mesmo nome do arquivo em src/data/sets>.ts`: um objeto por coleção, com a chave sendo o `id` da carta e os campos `text` (mesmas linhas do original, na mesma ordem) e `flavor` (com as mesmas aspas do original).
- `src/data/ptbr/index.ts`: junta as coleções (`CARD_TRANSLATIONS_PTBR`) e lista as que estão completas (`TRANSLATED_SETS`).
- `src/data/ptbr/glossary.ts`: características e raridades (iguais em todas as cartas, por isso ficam no glossário e não carta a carta).
- `src/data/ptbr/ptbr.test.ts`: confere ids, quantidade de linhas, títulos `[…]`, rótulos (`Alvo:`, `Efeito:`…), frases e se o glossário cobre todas as características.

Para traduzir uma coleção nova: crie o arquivo em `sets/`, inclua em `index.ts` (no objeto e em `TRANSLATED_SETS`) e rode `npm test`.

## Uso nas cartas remasterizadas

As cartas PT-BR em alta resolução (`scripts/card-remaster/`) desenham **este mesmo texto**: `translations/<set>.json` do remaster é uma cópia de `src/data/ptbr/sets/` (a frase vai sem as aspas externas) e o `glossary.json` dele segue `glossary.ts`. Ajustes de tradução são feitos aqui e copiados para lá, nunca o contrário. Assim a carta e o app mostram o mesmo texto.

## O que não se traduz

- **Nomes das cartas**, inclusive Jutsus e Missões, e nomes citados no texto (`"Kakashi Hatake"`, `"Shooting Star"`). O rulebook PT-BR também mantém os nomes em inglês (ex.: "Fire Style: Fire Ball Jutsu"), e os efeitos se referem a outras cartas pelo nome.
- **Atributos de Combate** (`"Kung Fu"`, `"Flame"`, `"Beast"`…): o rulebook PT-BR os mantém em inglês (REGRAS.md 4.11).
- `Name: X` vira `Nome: X`, com X em inglês (é o nome de outra carta).
- "Showdown", "Chakra", "Deck", "Jutsu", "Ninja", "Kekkei Genkai" e termos japoneses.

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

Características citadas entre aspas no texto usam a forma do glossário (`"Female" Ninja` → `Ninja "Feminino"`, `"Sharingan Eye"` → `"Olho Sharingan"`, `"Rogue Ninjas"` → `"Ninjas Renegados"`), para bater com o que aparece nas características da carta. Hierarquias iguais em PT ("Genin", "Jonin") ficam como estão.

## Estilo

- **Títulos `[…]`** (nome do efeito) são traduzidos, curtos, com iniciais maiúsculas: `[Love's Rival]` → `[Rival no Amor]`.
- **Efeitos**: fiéis às regras, sem resumir nem acrescentar. Na dúvida sobre o sentido de uma regra, siga `docs/REGRAS.md` e anote para o usuário em vez de chutar.
- **Frases**: português natural, no tom da fala do anime, sem traduzir ao pé da letra. Mantêm as aspas, reticências e símbolos (♥) do original. Nomes de jutsus nas falas seguem a dublagem quando conhecida ("Jutsu Clones das Sombras").
- Mantenha os números, `X`/`Y` e as aspas `"` do original.
