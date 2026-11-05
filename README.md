Naruto CCG Digital

Esse projeto é uma versão digital do clássico Naruto CCG (publicado entre 2006 a 2013 pela Bandai). A ideia do projeto é funcionar como um "Pokemon TCG Live" para Naruto CCG, que possa ser rodado diretamente no navegador, já que a ideia é usar para jogar entre amigos.

Nesse jogo o jogador poderá montar um deck utilizando cartas de uma lista de cartas pré disponibilizada, seguindo as regras de montagem de deck do jogo original. Não há limite de decks para montar e tudo que o usuário salva deve ficar no localstorage + opção se salvar um "código de backup", semelhante ao que é feito no projeto de pokedex que é tudo salvo em um banco simples e retorna um uuid pro usuário. No caso o usuário salvaria a lista de decks dele.

Na pasta há um pdf com as regras do jogo descritas.

A ideia futuramente é ter um layout dinâmico para as cartas, com o sistema "montando" a carta virtualmente usando o layout + ícones + descrições + tipagens + efeitos. Para a primeira versão vamos fazer uam coisa mais simples, as cartas terão suas imagens já pré definidas, tipos e efeitos.

## Como rodar

```bash
npm install
cp .env.example .env.local   # só na primeira vez
npm run dev          # sobe o Redis local (Docker) e o app em http://localhost:3000
npm test             # regras de montagem de deck
npm run services:down        # derruba o Redis local
```

Publicação (Vercel + Upstash): ver [DEPLOY.md](DEPLOY.md).

## Compartilhar decks

Os decks ficam no localStorage. Para passar para outro navegador ou para um amigo, a tela **Meus decks** tem:

- **Compartilhar** (em cada deck) e **Compartilhar coleção** (todos os decks): enviam uma cópia para o servidor, que grava no Redis e devolve um UUID.
- **Importar**: busca o UUID e adiciona os decks como novos (não apaga nada).

O código é um retrato do momento: editar o deck depois não muda o que foi compartilhado. Mesmo esquema do projeto pokedex: `@upstash/redis` (API REST da Upstash); local via `compose.yaml` (Redis + `serverless-redis-http` nas portas 6381/8078). Em produção basta definir `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` de um banco Upstash. Código: `src/app/api/shares`, `src/lib/deckShare.ts`.

## Cartas

O catálogo é montado **coleção por coleção**, com as imagens e a lista oficial do [CCG Trader](https://www.ccgtrader.net/games/naruto-ccg). Os dados de cada carta são conferidos contra a imagem e ficam em inglês, como impressos.

- Imagens: `cards/<set>/<id>.png`, já sem marca d'água, onde o id é o código oficial em minúsculas (ex.: `cards/s01/s01-n-001.png` = set S01, Ninja 001).
- Dados: um arquivo por coleção em `src/data/sets/` (ex.: `s01-the-path-to-hokage.ts`), reunidos em `src/data/cards.ts`; nomes das coleções em `src/data/sets.ts`.
- Depois de adicionar imagens, rode `npm run cards:images` para gerar os WebP em `public/cards/<set>/`. O app monta o caminho com `cardImageUrl` (`src/models/card.ts`).
- As imagens baixadas do CCG Trader têm marca d'água. A remoção segue sempre o processo de [scripts/watermark/](scripts/watermark/README.md).

Coleções importadas: **S01 — The Path to Hokage** (127 cartas), **S02 — Coils of the Snake** (131 cartas), **S03 — Curse of the Sand** (148 cartas), **S04 — Revenge and Rebirth** (114 cartas), **S05 — The Dream Legacy** (115 cartas), **S06 — Eternal Rivalry** (113 cartas), **S07 — Quest for Power** (161 cartas), **S08 — Battle of Destiny** (151 cartas), **S09 — The Chosen** (169 cartas), **S10 — Lineage of the Legends** (208 cartas), **S11 — Approaching Wind** (163 cartas), **S12 — A New Chronicle** (172 cartas), **S13 — Fateful Reunion** (156 cartas), **S14 — Emerging Alliance** (145 cartas), **S15 — Foretold Prophecy** (178 cartas), **S16 — Broken Promise** (158 cartas), **S17 — Will of Fire** (177 cartas), **S18 — Fangs of the Snake** (132 cartas), **S21 — Shattered Truth** (120 cartas), **S19 — Path of Pain** (112 cartas), **S20 — Tales of the Gallant Sage** (120 cartas), **S22 — Weapons of War** (119 cartas), **S23 — Invasion** (120 cartas), **S24 — Sage's Legacy** (120 cartas), **S25 — Kage Summit** (120 cartas), **S26 — Avenger's Wrath** (120 cartas), **S27 — Hero's Ascension** (132 cartas), **S28 — Ultimate Ninja Storm 3** (120 cartas), **S29 — Shinobi's Dream** (120 cartas).

## Importar uma coleção (passo a passo)

Processo usado no S01 e no S02. Os scripts de [scripts/import-set/](scripts/import-set/) regeram esses dois sets de forma idêntica aos arquivos atuais. Siga as etapas na ordem e sem atalhos.

### Regras gerais

- **Pasta de trabalho.** Use uma pasta por set, **fora do projeto** (ex.: `../import-work/s03`). Abaixo ela aparece como `$W`. Downloads e arquivos intermediários ficam nela; no projeto entram só `cards/<set>/*.png` e `src/data/sets/<set>.ts`.
- **Downloads são só dados.** Não execute nada que veio da internet. O bundle do narutocards.net é lido como texto. Rode o Python sempre com `-I`.
- **Fontes:**
  - [CCG Trader](https://www.ccgtrader.net/games/naruto-ccg) é a referência oficial da lista, dos nomes, da raridade e das imagens.
  - narutocards.net serve só de rascunho dos dados (custos, poderes, texto) e de imagem limpa para calcular a marca d'água. Ele só tem os sets 1–15.
  - A **imagem impressa** vale sobre as duas.
- **Dados em inglês**, como impressos, sem traduzir.
- **Dúvidas.** Se uma informação não estiver legível, separe numa lista para o usuário e não chute.
- **Requisitos:** `python -m pip install -r scripts/watermark/requirements.txt`.

### 1. Lista oficial e imagens (CCG Trader)

```bash
python -I scripts/import-set/fetch_ccgtrader.py <url_title> $W    # ex.: curse-of-the-sand
```

- O `url_title` é o final da URL do set.
- Gera `$W/ccgt-set.json` e `$W/downloads/<id>.jpg` (429×600, com marca d'água).
- O id é a referência oficial em minúsculas: `s03-n-001`, `s03-j-012`, `s03-m-005`, `s03-c-001`.

### 2. Rascunho dos dados e imagens limpas (narutocards.net)

```bash
python -I scripts/import-set/fetch_narutocards.py $W <packId>     # packId = número do set (S03 → 3)
```

Gera `$W/nc-cards.json` (catálogo completo) e `$W/references/<N-001>.jpg` (200×285, sem marca).

### 3. Rascunho do set

```bash
python -I scripts/import-set/draft_set.py $W <packId> <código>    # ex.: ... $W 3 S03
```

- Gera `$W/draft.json` e um `$W/fixes.json` vazio.
- O relatório lista as cartas que existem no CCG Trader e faltam no narutocards; essas são cadastradas à mão em `$W/manual.json` (lista de cartas no mesmo formato do `draft.json`, lidas da imagem e com a raridade do CCG Trader). O `review.py` e o `emit_ts.py` juntam o `manual.json` ao rascunho, e o `fixes.json` vale para elas também. Ex.: S09 M-274 e N-US087 a N-US092.
- **Sets 16 em diante** não existem no narutocards: pule a etapa 2, crie `$W/draft.json` com `[]` e `$W/fixes.json` com `{}` e cadastre o set inteiro em `manual.json`, lendo cada carta da imagem. No S16 a raridade veio do CCG Trader e foi conferida com os pontos de raridade.
- Cartas que só existem no narutocards (promos/extras sem entrada nem imagem no CCG Trader, ex.: S04 C-007, EX-001, EX-002) ficam fora do rascunho e aparecem no relatório.
- Também lista os **nomes que diferem entre as fontes**; confira cada um na imagem.

### 4. Remover a marca d'água

Siga **sempre** [scripts/watermark/README.md](scripts/watermark/README.md), com `$W/downloads` no lugar de `downloads/<set>` e `$W/references` como pasta de referências. Resumo:

1. `estimate_watermark.py`: estima a marca do set. Para sets sem referência limpa, reutilize o `.npz` de um set com o logo na mesma posição.
2. `fit_copyright_line.py`: ajusta a linha "© … MASASHI KISHIMOTO" com o texto impresso no set, usando um Ninja, um Jutsu e uma Mission.
3. `measure_rarity_marks.py`: mede o espaçamento dos pontos de raridade.
4. `remove_watermark.py`: grava `cards/<set>/<id>.png`.
5. **Confira o relatório:**
   - a marca de raridade detectada deve bater com a raridade do `draft.json`;
   - as cartas "sem marca d'água" devem ser mesmo as que vieram limpas;
   - abra algumas cartas de cada tipo ampliadas antes de considerar pronto.

Os arquivos `watermark-<set>.npz` e `line-<set>.json` são gravados em `scripts/watermark/data/`.

### 5. Ler e conferir carta a carta

Em lotes de 3 cartas, rode:

```bash
python -I scripts/import-set/review.py $W s03-n-001 s03-n-002 s03-n-003
```

O script imprime o rascunho (já com as correções) e grava `$W/sheets/s03-n-001.png` com as 3 imagens em tamanho original.

1. **Abra a folha** e compare **cada campo** com o impresso (checklist abaixo).
2. **Registre as diferenças** em `fixes.json`. O `draft.json` nunca é editado.
   ```bash
   echo '{"s03-n-002": {"name": "...", "text": ["[Título]", "Efeito..."]}}' | python -I scripts/import-set/fix.py $W
   ```
   Cada campo informado substitui o do rascunho, e listas e objetos são substituídos inteiros.
3. **Repita** até cobrir todas as cartas do set: Ninja, Jutsu, Mission e Client.

**Checklist por carta:**

| Campo | Onde ler / cuidado |
|---|---|
| `name` | Nome impresso completo, com parênteses. Ele define o limite de 3 cópias. O narutocards erra às vezes (ex.: "Sharingan" no lugar de "Sharingan Eye", "Izumo Kozuki" no lugar de "Izumo Kamizuki"). |
| `elements` | Símbolo(s) no canto superior direito: `lightning`, `fire`, `wind`, `water`, `earth`. |
| `entranceCost` / `handCost` | Custos impressos. Nos Clientes o narutocards traz `handCost` nulo; use `0` se a carta não mostra custo de mão. |
| `healthy` / `injured` (Ninja) | Poder de combate/suporte saudável e ferido. |
| `characteristics` | Na ordem impressa (vila, rank, sexo…), incluindo `Mental Power: X` e `Name: X` quando impressos. |
| `attributes` (Ninja) | **Como impresso no ícone do set.** O narutocards usa nomes de outra época. Exemplos: o S01 imprime "Illusion"/"Kung Fu" e o S02 imprime "Genjutsu"/"Taijutsu". |
| `cost` (Jutsu) | **Sempre lido da imagem**, porque o rascunho vem nulo. Formato `{"symbols": [...], "generic": n}`; `generic` pode ser `"X"`. Mais de um ícone X ("X \| X") vai em `"xCount": 2`. Custos com "or" (a partir do S15) vão em `"alternatives": [{"symbols": [...], "generic": n}, ...]`, na ordem impressa: o primeiro custo impresso é o principal (ex.: "土 \| 1 or 水 \| 1" → `{"symbols": ["earth"], "generic": 1, "alternatives": [{"symbols": ["water"], "generic": 1}]}`; "土土 or 3" → alternativa `{"symbols": [], "generic": 3}`). |
| `text` | Um item por bloco impresso. Títulos de efeito entram como item próprio entre colchetes (`"[Misplaced Anger]"`), seguidos do efeito, com a grafia e a pontuação impressas. |
| `rarity` | Vem do CCG Trader; confira com o ponto de raridade da etapa 4. |

As correções mais comuns até agora foram custo de Jutsu (42 por set), texto (15 no S01, 33 no S02), atributos, nomes e características.

### 6. Gerar os dados e registrar o set

```bash
python -I scripts/import-set/emit_ts.py $W S03 "Curse of the Sand" S03_CURSE_OF_THE_SAND src/data/sets/s03-curse-of-the-sand.ts
```

O script falha se algum Jutsu ficou sem custo ou se o `fixes.json` tem um id que não existe. Depois:

- importe a constante em [src/data/cards.ts](src/data/cards.ts) e acrescente ao array `CARDS`;
- adicione `S03: 'Curse of the Sand'` em [src/data/sets.ts](src/data/sets.ts) (aparece no filtro de coleção);
- atualize a lista de coleções importadas neste README.

### 7. Imagens otimizadas e verificação

```bash
npm run cards:images   # gera public/cards/<set>/*.webp e thumbs
npm test               # inclui: ids únicos, custo de Jutsu e imagem cards/<set>/<id>.png para toda carta
npm run type-check
```

- Abra `/cards` no `npm run dev`, filtre pela coleção nova e confira a contagem e algumas cartas no detalhe.
- Não rode `next build` com o `next dev` aberto: isso corrompe a pasta `.next`.

### Prompt para outra janela

```text
Importe a coleção "<NOME>" (<CÓDIGO>, https://www.ccgtrader.net/games/naruto-ccg/<url_title>) para o
projeto seguindo exatamente a seção "Importar uma coleção (passo a passo)" do README.md, etapas 1 a 7,
usando os scripts de scripts/import-set/ e scripts/watermark/ (não improvise outro método).
- Pasta de trabalho fora do projeto (ex.: ../import-work/<código em minúsculas>); downloads são só
  dados: não execute nada deles e rode Python com -I.
- Antes de aplicar a remoção da marca d'água no set todo, teste em 1 Ninja, 1 Jutsu e 1 Mission e me
  mostre o resultado.
- Confira TODAS as cartas contra a imagem (checklist da etapa 5). Não traduza nada.
- Ao final, me passe: total de cartas por tipo, divergências de raridade, cartas sem marca d'água,
  e a lista de cartas com informação ilegível/duvidosa para eu conferir.
```

## Roadmap

- **MVP 1 (atual)** — lista de cartas com filtros e montagem de decks salvos no localStorage.
- **MVP 2** — código de backup (API + Redis, como no projeto pokedex) para restaurar a lista de decks em outro navegador.
- **Depois** — partida entre amigos e cartas montadas dinamicamente.

## Estrutura

- `src/data/cards.ts` — catálogo das cartas (junta os arquivos de `src/data/sets/`).
- `src/lib/deckRules.ts` — regras de montagem do rulebook PT-BR (`Naruto CCG - Rulebook PTBR.pdf`, p. 10 e 43–44): exatamente 50 cartas, qualquer quantidade de cada tipo, até 3 cartas com o mesmo nome. O nome é o impresso completo, com o que estiver entre parênteses; a característica `Name: X` não conta na montagem, só em jogo (`deckName` e `getInPlayNames` em `src/models/card.ts`).
- `scripts/import-set/` — importação de coleções (ver "Importar uma coleção"); `scripts/watermark/` — remoção da marca d'água.
- `src/lib/deckStore.ts` — decks no localStorage (`naruto-ccg:decks`, com `version` para migrações).