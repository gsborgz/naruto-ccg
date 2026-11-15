# Naruto CCG Digital

Esse projeto é uma versão digital do clássico Naruto CCG (publicado entre 2006 a 2013 pela Bandai). A ideia do projeto é funcionar como um "Pokemon TCG Live" para Naruto CCG, que possa ser rodado diretamente no navegador, já que a ideia é usar para jogar entre amigos.

Hoje o app tem o catálogo de cartas e o montador de decks: o jogador monta quantos decks quiser com as cartas disponíveis, seguindo as regras de montagem do jogo original. Os decks ficam no localStorage do navegador e podem ser compartilhados por um código (UUID) gravado num banco simples, como no projeto pokedex.

Publicado em <https://naruto-ccg.vercel.app> (deploy automático a cada push na `main`).

Na pasta `docs/` estão os manuais oficiais (PDF), as regras consolidadas (`docs/REGRAS.md`), o guia de publicação (`docs/DEPLOY.md`), o processo de revisão das cartas contra as imagens e das frases (`docs/REVISAO-CARTAS.md`), as convenções da tradução PT-BR (`docs/TRADUCAO.md`) e a especificação da próxima etapa, as salas de jogo (`docs/SALAS.md`).

A ideia futuramente é ter um layout dinâmico para as cartas, com o sistema "montando" a carta virtualmente usando o layout + ícones + descrições + tipagens + efeitos. Por enquanto as cartas usam as imagens oficiais, com tipos, custos e efeitos cadastrados.

## Como rodar

Requer Node.js e Docker (para o Redis local).

```bash
npm install
cp .env.example .env.local   # só na primeira vez
npm run dev                  # sobe o Redis local (Docker) e o app em http://localhost:3000
npm test                     # regras de montagem, catálogo, compartilhamento e salas
npm run type-check
npm run services:down        # derruba o Redis local
npm run cards:layouts        # recria public/card-layouts a partir de card-layouts/ (molduras e ícones do criador de cartas e artes das cartas escaneadas)
```

Publicação (Vercel + Upstash): ver [docs/DEPLOY.md](docs/DEPLOY.md).

## Funcionalidades

- **Cartas** (`/cards`): catálogo com busca por nome, característica ou efeito, filtros por coleção, tipo e elemento, ordenação e detalhe de cada carta.
- **Meus decks** (`/`): criar, editar, duplicar, excluir, compartilhar e importar decks.
- **Jogar** (`/jogar` e `/salas/<uuid>`): criar uma sala só com o apelido, enviar o código (ou o link) para um amigo e, dentro da sala, cada um escolhe o deck e marca **Pronto**. Quando os dois estão prontos, a sala abre a **arena** com os decks embaralhados e a mão inicial: cada um arrasta as próprias cartas entre as zonas, compra, embaralha e busca cartas no deck (as regras de turno ainda não existem). Prévia local em `/arena`. Detalhes em [docs/SALAS.md](docs/SALAS.md).
- **Criar carta** (`/criar`): monta cartas nos layouts 1 a 5 a partir das molduras e ícones de `card-layouts/` (tipo, elementos, custos, vila, Atributo de Combate com o kanji tirado de `card-layouts/icons/attributes`, força, textos e frase), com a arte enviada pelo jogador (arraste para enquadrar). Dá para partir de uma carta do catálogo (**Importar do catálogo** ou `/criar?importar=<id>&layout=layout-02`) e comparar com a imagem original. As cartas ficam no localStorage (`naruto-ccg:custom-cards`). Cada layout tem a sua configuração em `src/lib/cardMaker/layouts/` (`layout01.ts` a `layout05.ts`), onde cada ícone tem só a posição e o tamanho (`{ x, y, size }`); o resto do ícone (proporção, nome de lado, números de custo e de força, nome e kanji do atributo) fica num arquivo por ícone em `src/lib/cardMaker/icons/`, relativo ao próprio ícone, para ficar igual em todos os layouts. A página `/criar/calibrar?layout=layout-02&ids=...` mostra lado a lado a carta montada, a original e as duas sobrepostas.
- **Montador** (`/decks/<id>`): cartas disponíveis à esquerda, com +/− em cada uma, e o deck à direita (por tipo, com contagem e validação das regras).
  - As alterações ficam num rascunho e só são gravadas no botão **Salvar**.
  - Ao sair com alterações não salvas (links do app ou "voltar" do navegador), o app pergunta se quer **Salvar**, **Descartar** ou continuar editando. Ao fechar ou recarregar a aba, aparece o aviso padrão do navegador.

## Compartilhar decks

Os decks ficam no localStorage. Para passar para outro navegador ou para um amigo, a tela **Meus decks** tem:

- **Compartilhar** (em cada deck) e **Compartilhar coleção** (todos os decks): enviam uma cópia para o servidor, que grava no Redis e devolve um UUID.
- **Importar**: busca o UUID e adiciona os decks como novos (não apaga nada).

O código é um retrato do momento: editar o deck depois não muda o que foi compartilhado. Mesmo esquema do projeto pokedex: `@upstash/redis` (API REST da Upstash); local via `compose.yaml` (Redis + `serverless-redis-http` nas portas 6381/8078).

- O cliente lê `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` **ou** `KV_REST_API_URL`/`KV_REST_API_TOKEN`. Em produção são as `KV_*`, criadas pela integração Upstash da Vercel.
- O banco de produção é **compartilhado com o projeto pokedex**, então toda chave gravada começa com `naruto-ccg:` (ex.: `naruto-ccg:share:<uuid>`). Mantenha esse prefixo em chaves novas.
- Código: `src/app/api/shares`, `src/lib/deckShare.ts` (validação), `src/lib/shareClient.ts`, `src/lib/redis.ts`.

## Cartas

O catálogo tem todas as coleções, com as imagens e a lista oficial do [CCG Trader](https://www.ccgtrader.net/games/naruto-ccg). Os dados de cada carta são conferidos contra a imagem e ficam em inglês, como impressos.

- Imagens originais: `cards/<set>/<id>.png`, já sem marca d'água, onde o id é o código oficial em minúsculas (ex.: `cards/s01/s01-n-001.png` = set S01, Ninja 001). **Ficam só na máquina local** (fora do Git pelo `.gitignore`, ~1,7 GB); o repositório guarda apenas as versões otimizadas de `public/cards/`.
- Dados: um arquivo por coleção em `src/data/sets/` (ex.: `s01-the-path-to-hokage.ts`), reunidos em `src/data/cards.ts`; nomes das coleções em `src/data/sets.ts`.
- **Textos em PT-BR:** o seletor **EN | PT** do cabeçalho mostra nomes (Jutsus, Missões e Ninjas descritivos), efeitos, frases, características, Atributos de Combate e coleções traduzidos. As traduções ficam em `src/data/ptbr/` (uma por coleção, só para exibição; as regras leem os dados em inglês) e seguem [docs/TRADUCAO.md](docs/TRADUCAO.md). Todas as coleções (S01–S29, TP1–TP4 e Promos) estão traduzidas.
- Se alguma imagem de `cards/` mudar, rode `npm run cards:images` para gerar os WebP em `public/cards/<set>/` (tamanho cheio, usado no detalhe da carta) e `public/cards/<set>/thumbs/` (miniatura, usada nas grades). Para gerar só algumas coleções, passe as pastas: `npm run cards:images -- s01 s07` (recria só `public/cards/s01/` e `public/cards/s07/`; sem argumentos, recria tudo). O app monta o caminho com `cardImageUrl` (`src/models/card.ts`).
- **Cartas montadas:** as cartas já escaneadas têm `layout` nos dados da coleção (`CardLayoutInfo` em `src/models/cardLayout.ts`): o layout (moldura, painel e posições), o design alternativo (se houver), o ajuste da fonte do nome (`nameSize`, em px sobre o tamanho do layout: negativo diminui, positivo aumenta, 0 = o do layout; o mesmo campo existe no criador; `nameSizePtBr` é o ajuste do nome traduzido, usado quando o nome muda em PT-BR; com `npm run dev`, o detalhe da carta em **Montada** mostra um slider que ajusta esse tamanho e grava `nameSize` ou, com o nome traduzido na tela, `nameSizePtBr` direto no arquivo da coleção, via `/api/dev/card-layout`, que dá 404 fora do desenvolvimento), os ícones impressos (`icons`: tipo, variante de cada elemento, ícones de custo e moldura do Atributo de Combate) e o enquadramento das artes extraídas. Os ícones ficam na carta, e não no layout, porque as coleções mais novas misturam ícones de layouts diferentes. As artes ficam em `card-layouts/arts/<set>/<id>/` (só local): `back.png` fica atrás da moldura e `front.png` (opcional, com transparência) na frente da moldura e atrás do painel. `npm run cards:layouts` gera os WebP em `public/card-layouts/arts/<set>/<id>/`. O scan (`python -I scripts/card-scan/scan.py s01-n-001 s01-j-001`) identifica o layout comparando a carta com as molduras e painéis de cada layout, identifica os ícones comparando as variantes de cada um na posição do layout (lida da configuração em `src/lib/cardMaker/layouts/` pelo Node), calcula o enquadramento das artes (pontos SIFT + ajuste fino) e grava uma montagem de conferência em `.tmp-card-scan/`. Ele imprime o trecho `layout: {...}` para colar no arquivo da coleção. O enquadramento é o mesmo do criador (`x`, `y` e `zoom` sobre o "cobrir" da carta de 750×1050). No detalhe da carta, **Original | Montada** alterna entre a imagem impressa e a carta montada; `/criar/calibrar?ids=s01-n-001,s01-j-001` mostra a comparação lado a lado. As coleções S01 a S10 (todas no layout 1) estão escaneadas, ainda sem artes extraídas (da S02 à S10 com `--layout layout-01 --skip-icons`, que não identifica os ícones e deixa os padrão do layout; `node scripts/card-scan/apply.ts <arquivo da coleção> <scan.json>` grava o resultado nas cartas que ainda não têm `layout`): as cartas usam a própria carta impressa como arte de fundo (`print: true` no enquadramento, gerado pelo scan quando a carta não tem arte em `card-layouts/arts/`), com a moldura, o painel e os textos montados por cima (a frase é desenhada de novo, no idioma escolhido, com um sombreado em volta das letras que apaga de leve a impressa no fundo: `printedFlavor` na carta do criador, que dá para desligar no editor). Ao extrair a arte de uma carta, rode o scan de novo e troque o `art` dela (`--print` ignora as artes extraídas e volta para a impressa).
  - **Impressa sem os elementos:** `tools/.venv-upscale/Scripts/python.exe -I scripts/card-extract/clean_elements.py <ids>` apaga os ícones de elemento (disco + nome de lado) da impressa com o LaMa, nas posições do layout e com os elementos dos dados, e grava em `.tmp-card-extract/clean-elements/` (com a comparação em `_compare/`). As aprovadas na conferência visual vão para `card-layouts/arts/<set>/<id>/print-clean.png` e ganham `clean: true` ao lado do `print: true` (o scan põe sozinho quando o arquivo existe); a carta montada usa essa imagem, no mesmo enquadramento, com o elemento montado por cima. O LaMa pode apagar ou borrar desenho que passava por baixo do ícone; mesmo assim a versão limpa é usada (os defeitos são ajustados aos poucos). A S01 inteira está limpa.
- **Cartas remasterizadas:** gere uma restauração em 2×, fiel às cores, formatos e desenho original. Reconstrua os textos com base nos dados da coleção e confira os ícones com atenção redobrada. Detalhes em [docs/REMASTERIZACAO.md](docs/REMASTERIZACAO.md).

Coleções: **S01 — The Path to Hokage** (127 cartas), **S02 — Coils of the Snake** (131 cartas), **S03 — Curse of the Sand** (148 cartas), **S04 — Revenge and Rebirth** (114 cartas), **S05 — The Dream Legacy** (115 cartas), **S06 — Eternal Rivalry** (113 cartas), **S07 — Quest for Power** (161 cartas), **S08 — Battle of Destiny** (151 cartas), **S09 — The Chosen** (169 cartas), **S10 — Lineage of the Legends** (208 cartas), **S11 — Approaching Wind** (163 cartas), **S12 — A New Chronicle** (172 cartas), **S13 — Fateful Reunion** (156 cartas), **S14 — Emerging Alliance** (145 cartas), **S15 — Foretold Prophecy** (178 cartas), **S16 — Broken Promise** (158 cartas), **S17 — Will of Fire** (177 cartas), **S18 — Fangs of the Snake** (132 cartas), **S19 — Path of Pain** (112 cartas), **S20 — Tales of the Gallant Sage** (120 cartas), **S21 — Shattered Truth** (120 cartas), **S22 — Weapons of War** (119 cartas), **S23 — Invasion** (120 cartas), **S24 — Sage's Legacy** (120 cartas), **S25 — Kage Summit** (120 cartas), **S26 — Avenger's Wrath** (120 cartas), **S27 — Hero's Ascension** (132 cartas), **S28 — Ultimate Ninja Storm 3** (120 cartas), **S29 — Shinobi's Dream** (120 cartas), **TP1 — Tournament Pack 1** (58 cartas; das 60, N-209 Nawaki e N-547 Sasuke Uchiha ficaram de fora por terem os mesmos dados de S05 N-209 e S13 N-547)., **TP2 — Tournament Pack 2** (30 cartas; as outras 34 do pack são as mesmas cartas do TP1, com a mesma imagem e os mesmos dados)., **TP3 — Tournament Pack 3** (60 cartas)., **TP4 — Tournament Pack 4** (37 cartas; as outras 23 do pack são reimpressões de cartas do S01–S17 com a mesma imagem e os mesmos dados)., **PR — Naruto CCG: Promos** (129 cartas; das 132 do CCG Trader, PS-001 a PS-003 ficaram de fora por terem os mesmos dados de S01 N-001 a N-003). Total: 4.355 cartas.

## Roadmap

- **MVP 1 (pronto)** — lista de cartas com filtros e montagem de decks salvos no localStorage.
- **MVP 2 (pronto)** — compartilhamento por código (API + Redis, como no projeto pokedex): um deck ou a coleção inteira, importável em outro navegador.
- **MVP 3 (pronto)** — salas de jogo: criar uma sala, enviar o código (UUID) para um amigo entrar e, dentro da sala, escolher os decks e marcar "Pronto". Especificação em [docs/SALAS.md](docs/SALAS.md).
- **MVP 4 (próximo)** — a partida em si, dentro da sala (motor do jogo no servidor, cada jogador vê só o que pode ver).
- **Depois** — cartas montadas dinamicamente (criador pronto para os 5 layouts das coleções).

## Estrutura

- `docs/` — documentação: regras (`REGRAS.md`, `Regras Naruto CCG.md/.html`, manuais em PDF e imagens em `rules-img/`), publicação (`DEPLOY.md`) e especificação das salas de jogo (`SALAS.md`).
- `src/data/cards.ts` — catálogo das cartas (junta os arquivos de `src/data/sets/`).
- `src/lib/deckRules.ts` — regras de montagem do rulebook PT-BR (`docs/Naruto CCG - Rulebook PTBR.pdf`, p. 10 e 43–44): exatamente 50 cartas, qualquer quantidade de cada tipo, até 3 cartas com o mesmo nome. O nome é o impresso completo, com o que estiver entre parênteses; a característica `Name: X` não conta na montagem, só em jogo (`deckName` e `getInPlayNames` em `src/models/card.ts`). Também cuida do Baralho de Reforço (`docs/REGRAS.md` 4.17): cartas com a característica `Squad` ou `Reinforcement` (`isReinforcementCard`) vão para ele, não para o Deck; são até 15, com até 3 por nome, e não contam nas 50. As duas partes ficam no mesmo mapa `cards` do deck e `deckPartOf` diz a parte de cada carta.
- `src/lib/cardFilters.ts` — busca, filtros e ordenação do catálogo (com PT-BR ativo, busca nos dois idiomas).
- `src/data/ptbr/` — tradução PT-BR (por coleção + glossário); `src/lib/cardLanguage.tsx` guarda o idioma escolhido e carrega as traduções sob demanda; `src/lib/cardLocale.ts` monta os textos de cada carta.
- `src/lib/deckStore.ts` — decks no localStorage (`naruto-ccg:decks`, com `version` para migrações); gravação só via `deckActions.save`.
- `src/lib/useLeaveGuard.ts` — aviso de alterações não salvas ao sair do montador.
- `src/lib/deckShare.ts`, `src/lib/shareClient.ts`, `src/lib/redis.ts` e `src/app/api/shares/` — compartilhamento por código.
- `src/lib/rooms/` e `src/app/api/rooms/` — salas de jogo (regras puras em `model.ts`, Redis em `store.ts`, navegador em `client.ts`/`useRoom.ts`).
- `src/lib/cardMaker/` e `src/components/cardMaker/` — criador de cartas: modelo e marcação do texto (`model.ts`), configuração de cada layout (`layouts/`: `types.ts`, `shared.ts` com as funções que posicionam os ícones, `layoutXX.ts` com posição e tamanho de cada ícone), configuração de cada ícone (`icons/`: um arquivo por ícone com os textos dele; vilas e kanjis de custo, sem texto, em `village.ts` e `cost-element.ts`), localStorage (`store.ts`) e a carta montada em HTML (`CardRender.tsx`, desenhada em 750×1050 e escalada).
- `card-layouts/` — elementos visuais extraídos das cartas (molduras por layout, ícones e exemplos). O app usa as versões WebP de `public/card-layouts/`, geradas por `npm run cards:layouts`. Ícones em tela padronizada (tipo, custo, Atributo de Combate) são posicionados pela tela; os demais são recortados pela área útil.
- `src/app/` — páginas: `/` (Meus decks), `/cards` (catálogo), `/decks/[id]` (montador), `/jogar` e `/salas/[id]` (salas), `/criar` (criador de cartas). Componentes em `src/components/`.
- `compose.yaml` — Redis local para desenvolvimento; `vercel.json` — região das funções (`gru1`, São Paulo).
- `scripts/review-set/` — revisão de coleções e frases (ver `docs/REVISAO-CARTAS.md`). **Só local**, fora do Git.
