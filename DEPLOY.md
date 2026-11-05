# Publicação na Vercel

Configuração única: depois disto, todo `git push` na branch principal publica sozinho, e as próximas
funcionalidades (salas de jogo incluídas) usam a mesma infraestrutura, sem nada novo para configurar.

**O que vai ser criado:**

| Peça | Onde | Para quê |
| --- | --- | --- |
| Repositório | GitHub (`gsborgz/naruto-ccg`) | Código; cada push dispara um deploy |
| Projeto | Vercel (plano Hobby, gratuito) | Site, API (`/api/...`) e imagens das cartas |
| Banco Redis | Upstash, criado **de dentro da Vercel** (Marketplace) | Códigos de compartilhamento e, depois, as salas de jogo |

O que já está no código (não precisa configurar no painel):

- `vercel.json`: funções na região **São Paulo (`gru1`)**, perto dos jogadores.
- `next.config.ts`: cache das imagens das cartas.
- `src/lib/redis.ts`: lê `UPSTASH_REDIS_REST_URL`/`TOKEN` **ou** `KV_REST_API_URL`/`TOKEN`, os dois nomes que a integração pode criar.

---

## 1. Primeiro commit e push

O remote `origin` já aponta para `https://github.com/gsborgz/naruto-ccg.git`. Se o repositório ainda não
existe no GitHub, crie-o vazio (sem README/.gitignore) com esse nome.

```bash
git branch -M main          # a Vercel usa a branch padrão do GitHub como produção
git add .
git commit -m "Primeira versão: montador de decks e compartilhamento"
git push -u origin main
```

O push sobe cerca de 330 MB (as imagens otimizadas em `public/cards`) e pode demorar alguns minutos.
As imagens originais (`cards/`, ~1,7 GB) ficam de fora pelo `.gitignore`: guarde-as em outro lugar
(backup), porque só existem na sua máquina.

## 2. Criar o projeto na Vercel

1. Entre em <https://vercel.com> com **"Continue with GitHub"** e autorize o acesso ao repositório `naruto-ccg`.
2. **Add New… → Project → Import** em `gsborgz/naruto-ccg`.
3. Na tela de configuração, deixe tudo como veio:
   - Framework Preset: **Next.js** (detectado sozinho)
   - Root Directory: `./`
   - Build/Install/Output: padrão (sem override)
   - Environment Variables: **nenhuma** (o passo 3 cuida disso)
4. **Deploy.** Em 2 a 4 minutos o site fica no ar em `https://naruto-ccg.vercel.app` (ou um nome parecido,
   se esse já existir). O montador já funciona; só compartilhar/importar ainda não, até o passo 3.

> Se o deploy falhar por **tamanho** (por causa das imagens): veja "Plano B para as imagens" no fim.

## 3. Conectar o banco (Upstash pelo Marketplace)

1. No projeto: aba **Storage → Create Database** (ou **Marketplace → Upstash**).
2. Escolha **Upstash → Upstash for Redis** e aceite os termos (cria a conta Upstash ligada à Vercel,
   e a cobrança, se um dia houver, vem pela Vercel).
3. Configure:
   - **Primary Region:** São Paulo (`sa-east-1`), a mesma área das funções (`gru1`).
     Se não aparecer, use `us-east-1` e troque `gru1` por `iad1` no `vercel.json`. O que importa é
     banco e funções ficarem perto um do outro.
   - **Plan:** Free.
   - **Eviction:** desligado (os dados não podem sumir sozinhos).
4. **Connect Project → `naruto-ccg`**, marcando os três ambientes: **Production, Preview e Development**.
   Deixe o prefixo das variáveis como vier, porque o código aceita os dois formatos.
5. Aba **Deployments →** no deploy mais recente, **⋯ → Redeploy**, para ele pegar as variáveis novas.

## 4. Conferir

No site publicado:

1. Crie um deck, adicione algumas cartas e clique em **Salvar**.
2. Em **Meus decks → Compartilhar**: deve aparecer um código `xxxxxxxx-xxxx-...`.
3. Abra o site numa janela anônima (ou em outro navegador): **Importar →** cole o código **→ Buscar →
   Importar deck**. O deck tem que aparecer com as mesmas cartas.

Se o passo 2 der "Não foi possível gerar o código", veja **Deployments → (deploy) → Logs** e confira em
**Settings → Environment Variables** se as variáveis `UPSTASH_REDIS_REST_*` ou `KV_REST_API_*` existem.

## Pronto: como fica o dia a dia

- **Publicar:** `git push` na `main` → deploy de produção automático.
- **Testar antes:** push em outra branch → a Vercel gera um link de *preview* só para aquela branch.
  Por padrão, previews só abrem com login na Vercel; produção é pública.
- **Rodar local:** continua `npm run dev` com o Redis no Docker (`compose.yaml`). O banco local e o de
  produção são separados, então nada do que você testa localmente aparece no site.
- **Salas de jogo (próxima etapa):** usam o mesmo Upstash e as mesmas rotas de API. Nenhuma configuração nova.

## Limites para ficar de olho

- **Vercel Hobby:** gratuito e para uso não comercial (jogar entre amigos está ok). Uso e limites em
  **Settings → Usage**.
- **Upstash Free:** tem um limite mensal de comandos. Compartilhar decks gasta pouquíssimo; as partidas
  vão gastar mais (a sala consulta o banco a cada ~1 s). O uso aparece no painel do banco (aba Storage).
  Se chegar perto do limite, o plano pago cobra por comando (centavos por hora de partida).

## Plano B para as imagens (só se o deploy reclamar do tamanho)

As 8 mil imagens de `public/cards` (~315 MB) vão junto no deploy. Se a Vercel recusar:

1. No projeto: **Storage → Create Database → Blob** e conecte ao projeto.
2. Suba a pasta `public/cards` para o Blob (dá para fazer com um script; me peça e eu escrevo).
3. Troque a base da URL em `cardImageUrl` (`src/models/card.ts`) pela URL do Blob e tire `public/cards` do Git.
