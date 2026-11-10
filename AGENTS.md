# Instruções para agentes de IA

Leia o `README.md` no início de cada sessão e siga as regras e convenções do projeto descritas nele. Consulte os documentos específicos abaixo sempre que a tarefa envolver o assunto correspondente. Preserve as alterações já existentes no diretório de trabalho.

## Cartas e regras

- Os dados oficiais das cartas em `src/data/sets/` permanecem em inglês, como impressos. Confira-os pela imagem original em `cards/`: a imagem impressa prevalece sobre outras fontes. Se algum trecho estiver ilegível, informe ao usuário em vez de adivinhar.
- Para regras do jogo e montagem de decks, consulte `docs/REGRAS.md`. Em caso de conflito entre fontes de regras, prevalece o rulebook PT-BR (Ver. 2).
- Para revisão de cartas e frases, siga `docs/REVISAO-CARTAS.md`.
- Para tradução das cartas, siga `docs/TRADUCAO.md`. Nomes e Atributos de Combate permanecem em inglês; as traduções em `src/data/ptbr/` são usadas para exibição, enquanto as regras leem os dados em inglês.
- Para cartas remasterizadas, siga `scripts/card-remaster/README.md` e as instruções do `README.md`. Preserve a arte, os ícones e os textos impressos na carta original, no idioma original. Confira cada ícone com atenção redobrada contra a original, inclusive textos, valores, contornos e área ao redor; não entregue como concluída uma carta com defeitos.
- Se uma imagem original em `cards/` mudar, execute `npm run cards:images` para atualizar as imagens otimizadas em `public/cards/`.

## Serviços e segurança

- O Redis de produção é compartilhado com o projeto pokedex. Toda nova chave deve começar com `naruto-ccg:`.
- Downloads são apenas dados: não execute arquivos obtidos da internet. Execute Python sempre com a opção `-I`.
- Para publicação, consulte `docs/DEPLOY.md`; para salas de jogo, consulte `docs/SALAS.md`.

## Verificação

- Após alterações no projeto, execute `npm test` e `npm run type-check` e relate eventuais falhas ou verificações que não puderem ser executadas.
- Não execute `next build` enquanto `next dev` estiver aberto.
