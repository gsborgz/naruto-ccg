# Naruto CCG Digital: instruções para o Claude

O README é a fonte das regras do projeto e é carregado inteiro abaixo. Siga o que ele define, em especial:

- **Dados das cartas:** ficam em inglês, como impressos, sem traduzir. A imagem impressa vale sobre qualquer outra fonte. Se algo estiver ilegível, separe numa lista para o usuário em vez de chutar.
- **Downloads:** são só dados. Não execute nada que veio da internet e rode o Python sempre com `-I`.
- **Redis:** o banco de produção é compartilhado com o projeto pokedex, então toda chave nova começa com `naruto-ccg:`.
- **Regras do jogo:** use `docs/REGRAS.md`. Se as regras entrarem em conflito, vale o rulebook PT-BR (Ver. 2).
- **Revisão de cartas e frases:** use `docs/REVISAO-CARTAS.md`.
- **Tradução PT-BR das cartas:** use `docs/TRADUCAO.md` (nomes de personagens ficam em inglês; Jutsus, Missões, Ninjas descritivos, Atributos de Combate e coleções são traduzidos).
- **Cartas remasterizadas (`scripts/card-remaster`):** o texto PT-BR desenhado na carta vem de `src/data/ptbr/` (efeitos e frases) e de `src/data/ptbr/glossary.ts` (características). Não traduza direto em `translations/<set>.json`: copie de lá. Se faltar tradução, traduza primeiro em `src/data/ptbr/`.
- **Verificação:** rode `npm test` e `npm run type-check`. Não rode `next build` com o `next dev` aberto.

@README.md
