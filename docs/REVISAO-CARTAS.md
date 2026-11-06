# Revisão de uma coleção (dados × imagem) e frases (flavor)

Processo para revisar uma coleção já importada. Foi feito pela primeira vez no **S01** (2026-11-06). As etapas são:

1. conferir cada carta do TS contra a imagem impressa;
2. corrigir o que estiver errado;
3. separar numa lista o que precisa de revisão humana;
4. gravar a frase acima da caixa de texto (campo `flavor`).

Faça **uma coleção por vez**, na ordem (S01, S02, …).

> Os scripts ficam em [scripts/review-set/](../scripts/review-set/) e as imagens originais em `cards/<set>/`. As duas pastas são **só locais**, fora do Git (`.gitignore`), e os links para elas não abrem no GitHub. Rode o Python sempre com `-I`.

## Preparação

Use uma pasta de trabalho **fora do projeto**, uma por coleção (ex.: `../review-work/s02`, chamada de `$W` abaixo).

```bash
node scripts/review-set/dump_set.ts S02 $W/cards.json     # cartas da coleção, como estão no catálogo
python -I scripts/review-set/sheets.py data $W            # $W/sheets/dNN.png (3 cartas por folha) + $W/data.txt
```

- **Folha de dados:** cada linha mostra o símbolo de elemento (canto superior direito) e a caixa de texto com o rodapé ampliada 2×.
- **`data.txt`:** traz os dados do TS de cada folha (`== d00`, `== d01`, …), para comparar lado a lado.
- **Outro tamanho de imagem:** as coordenadas valem para imagens 429×600 (CCG Trader). Se a coleção tiver outro tamanho ou layout, use `sheets.py crop $W <y0> <y1> <ids…>` para recortar a faixa que precisar.

## 1. Conferir carta a carta

Abra cada folha e compare **todos os campos** com o impresso:

| Campo | O que olhar |
|---|---|
| `name` | Nome completo, com parênteses. |
| `elements` | Símbolo(s) no canto superior direito, na ordem impressa (de cima para baixo). |
| `entranceCost` / `handCost` | Estrela azul (entrada) e cartas vermelhas (mão). |
| `healthy` / `injured` (Ninja) | Poder saudável embaixo e ferido na lateral direita (rotacionado). |
| `characteristics` | Linha vermelha abaixo do nome, na ordem impressa. |
| `attributes` (Ninja) | Ícone redondo no canto inferior direito (a palavra em inglês embaixo do kanji). |
| `cost` (Jutsu) | Ícones abaixo do nome: símbolos de elemento e o círculo vermelho com o genérico (número ou X). |
| `text` | Um item por bloco impresso. Os títulos de efeito ficam no item próprio entre colchetes, na grafia já usada na coleção (no S01 são Title Case, embora o impresso seja em maiúsculas). |
| `rarity` | Pontos depois do copyright no rodapé. |

**Pontos de raridade** (S01): nenhum = Common; 1 = Uncommon; 2 = Rare; 3 = Super Rare; ponto **vermelho** = Starter Deck. Para ver de perto: `sheets.py footer $W <ids…>` (4×). Coleções posteriores podem usar outro padrão; veja as anotações por set na memória e no README.

**Varredura de texto:** procure espaços duplos, espaços no início ou no fim e caracteres fora do ASCII nos campos `name`, `text` e `characteristics`. Antes do flavor, o S01 não tinha nenhum.

## 2. Corrigir

Corrija direto no `src/data/sets/<set>.ts` quando a imagem deixar claro o valor certo.

- **A imagem impressa vale** sobre os dados.
- **Erros de impressão óbvios** podem ser limpos quando atrapalham o uso. Ex.: S01 J-003 imprime `"Male""` e o TS guarda `"Male"`. Anote cada caso no relatório final.
- **Diferenças só de layout** não mudam os dados. Ex.: S01 M-023 imprime "Permanent Target:" na mesma linha, e o TS mantém "Permanent" como item próprio, como nas outras Missões permanentes.
- Depois de editar, rode `npm run type-check` e `npm test`.

## 3. Lista para revisão humana

**Não chute.** Se algo não estiver legível, ou se a imagem não permitir confirmar um dado, coloque a carta numa lista para o usuário com:

- o id;
- o campo;
- o que está no TS;
- o que dá ou não dá para ver na imagem.

Exemplos do S01:

- **J-025 Shadow Clone Jutsu:** a imagem era de outra impressão, sem número nem ponto de raridade. O usuário pediu para completar o rodapé seguindo o TS (veja "Corrigir uma imagem" abaixo).
- **J-033 (flavor em kanji):** sequência longa e pequena demais. O usuário conferiu com uma fonte externa e bateu.

## 4. Frases (`flavor`)

Muitas cartas têm uma frase entre aspas logo acima da caixa de texto (fala do anime). Ela vai no campo opcional `flavor` (ver `BaseCard` em [src/models/card.ts](../src/models/card.ts)).

```bash
python -I scripts/review-set/sheets.py quotes $W              # $W/sheets/qNN.png, 7 frases por folha
python -I scripts/review-set/sheets.py crop $W 300 388 <ids…>  # frases de 3 linhas que saíram cortadas em cima
```

1. **Transcreva** as frases num JSON `{id: frase}` em `$W/flavor.json` (use o Write; heredoc com aspas costuma quebrar).
2. **Grave no TS:**
   ```bash
   python -I scripts/review-set/add_flavor.py src/data/sets/<set>.ts $W/flavor.json
   ```
   O script coloca `flavor: "..."` antes de `image:` em cada carta e regrava todas as frases a cada execução, então pode rodar de novo à vontade. Ele falha se o JSON tiver um id que não existe no TS.

**Convenções** (as mesmas do S01):

- **Aspas:** a frase fica **como impressa, com as aspas**. Ex.: `flavor: "\"Ugh!\""`.
- **Mais de uma fala:** ficam na mesma string, cada uma com suas aspas. Ex.: `"\"Horse! Tiger!!\" \"I'll pinpoint the target!\""`.
- **Pontuação:** apóstrofo `'`; reticências `...`; o coração vira `♥`. Frases só de pontos ficam assim mesmo (`"\"......\""`).
- **Erros de impressão:** mantenha, porque é o texto da carta (ex.: "there's a quite a few", "No hand!!"). A exceção é espaço sobrando (ex.: antes da aspa final), que pode ser removido.
- **Kanji:** grave como impresso. Se não estiver legível, vai para a lista de revisão.
- **Carta sem frase:** não recebe o campo.
- **Conferência de fim de lote:** confira se o número de frases bate com o número de cartas que têm frase.

## Corrigir uma imagem (só quando o usuário pedir)

Exemplo do S01 J-025: rodapé sem número e sem raridade.

- **Não redesenhe.** Monte o rodapé com pedaços de outras cartas **da mesma coleção e do mesmo tipo**, nas mesmas coordenadas.
- **Número inteiro de uma carta só:** pegue o número completo de uma carta que tenha os mesmos dígitos (ex.: "025" da M-025), para manter o espaçamento original. Juntar dígitos de cartas diferentes deixa o número desalinhado.
- **Alinhamento:** confira com uma carta vizinha, linha e coluna dos dígitos.
- **Backup:** guarde o PNG original fora do projeto.
- **Só esta carta:** gere os dois WebP só dela, com os parâmetros do [scripts/optimize-card-images.mjs](../scripts/optimize-card-images.mjs) (750×1050 `inside` q85 e thumb 300×420 `cover` q80). Não rode `npm run cards:images`: ele apaga e recria `public/cards` de todas as coleções.

## Relatório final

Ao terminar a coleção, informe ao usuário:

- quantas cartas foram conferidas, por tipo;
- as correções feitas (id, campo, antes → depois) e os erros de impressão mantidos ou limpos;
- a lista para revisão humana;
- quantas frases foram gravadas e as que ficaram em dúvida.

Commit só quando o usuário pedir.

## Prompt para outra janela

```text
Revise a coleção <CÓDIGO> seguindo exatamente docs/REVISAO-CARTAS.md, etapas 1 a 4, com os scripts de
scripts/review-set/ (pasta de trabalho fora do projeto, ex.: ../review-work/<código em minúsculas>).
- Confira TODAS as cartas contra a imagem e corrija no TS o que estiver errado.
- Não chute: o que não der para confirmar vai para a lista de revisão humana.
- Grave o flavor de todas as cartas que têm frase.
- Ao final, me passe o relatório (correções, lista para revisão, frases em dúvida). Não faça commit.
```
