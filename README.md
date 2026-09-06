# Rallyne Silva Fotografia — Portfólio + Painel Administrativo

Site de portfólio para a fotógrafa Rallyne Silva ([@rallynefotografia](https://www.instagram.com/rallynefotografia)),
com uma área pública (visitantes veem os ensaios/eventos) e uma área privada,
acessada por login, onde é possível cadastrar novos eventos com título, local
e fotos.

O projeto é dividido em duas partes independentes, com responsabilidades separadas:

```
├── frontend/   → Aplicação Angular (site público + painel administrativo)
└── backend/    → API Node.js/Express (autenticação, dados dos eventos e
                  armazenamento físico das fotos no servidor)
```

O frontend nunca acessa arquivos ou dados diretamente — ele sempre fala com o
backend através da API HTTP. O backend nunca sabe nada sobre telas ou
componentes — ele só expõe rotas REST e guarda os dados/fotos em disco.

---

## 1. Estrutura do frontend (Angular 17, standalone components)

```
frontend/src/app/
├── core/          → serviços, modelos, guarda de rota e interceptor HTTP
│                    (auth.service, event.service, auth.guard, auth.interceptor)
├── shared/        → componentes reutilizáveis (navbar, footer, lightbox)
├── layout/        → layout público (navbar + conteúdo + footer)
└── features/
    ├── home/                  → página inicial
    ├── portfolio/             → lista pública de eventos + galeria de um evento
    ├── auth/login/            → tela de login da fotógrafa
    └── admin/                 → painel: layout, lista de eventos, formulário
                                  de criar/editar evento (com upload de fotos)
```

## 2. Estrutura do backend (Node.js + Express)

```
backend/
├── src/
│   ├── config/env.js          → leitura centralizada das variáveis de ambiente
│   ├── data/                  → "banco de dados" em arquivo JSON (events.json)
│   ├── middleware/             → autenticação (JWT), upload (multer), erros
│   ├── controllers/            → regras de negócio de auth e de eventos
│   ├── routes/                 → rotas REST (/api/auth, /api/events)
│   └── app.js / server.js      → montagem do Express / inicialização local
├── api/index.js                → ponto de entrada para rodar como função
│                                  serverless na Vercel (reaproveita app.js)
└── uploads/                    → **pasta física onde as fotos ficam guardadas**
```

---

## 3. Rodando localmente

### Backend

```bash
cd backend
npm install
cp .env.example .env      # depois edite o .env com suas próprias credenciais
npm run dev                # inicia em http://localhost:3000
```

Credenciais padrão de acesso ao painel (definidas em `.env`, **troque antes de
publicar**):

```
ADMIN_USERNAME=rallyne
ADMIN_PASSWORD=troque-esta-senha
```

Ao subir uma foto pelo painel, o arquivo é salvo fisicamente em
`backend/uploads/` e fica acessível publicamente em `http://localhost:3000/uploads/arquivo.jpg`.
Os metadados (título, local, data, lista de fotos) ficam em
`backend/src/data/events.json`.

### Frontend

```bash
cd frontend
npm install
npm start                  # inicia em http://localhost:4200
```

Por padrão, `src/environments/environment.ts` aponta para
`http://localhost:3000/api` — ou seja, já funciona com o backend local acima
sem nenhuma configuração extra.

Acesse:
- `http://localhost:4200/` → site público
- `http://localhost:4200/portfolio` → galeria de todos os eventos
- `http://localhost:4200/login` → login da fotógrafa
- `http://localhost:4200/admin/eventos` → painel (depois de logada)

---

## 4. Publicando no Vercel

### Frontend (recomendado publicar no Vercel — é um site estático)

1. Antes de gerar o build, edite `frontend/src/environments/environment.prod.ts`
   e troque `apiUrl` pela URL pública do seu backend, por exemplo:
   ```ts
   apiUrl: 'https://api-rallynefotografia.onrender.com/api'
   ```
   (o Angular gera arquivos estáticos, então essa URL fica fixa no build —
   se o endereço do backend mudar, é preciso gerar um novo build).
2. Crie um projeto na Vercel apontando para a pasta `frontend/`.
3. O arquivo `frontend/vercel.json` já está configurado:
   - `buildCommand`: `npm run build:prod`
   - `outputDirectory`: `dist/rallyne-fotografia/browser`
   - rewrite de todas as rotas para `index.html` (necessário para o roteamento do Angular)

### Backend — leia isto antes de escolher onde publicar

O pedido original é que **as fotos fiquem guardadas dentro do servidor de
hospedagem** (disco físico). O código do backend faz exatamente isso — usa
`multer` para salvar cada foto em `backend/uploads/`.

**Isso funciona perfeitamente em qualquer host com disco persistente**, por
exemplo Render, Railway, um VPS ou similar. Nesses casos, basta:
1. Subir a pasta `backend/` como um serviço Node comum (`npm install && npm start`).
2. Configurar as variáveis de ambiente do `.env.example` no painel do host.
3. Apontar `CORS_ORIGIN` para a URL do site publicado no Vercel.

**Atenção com a Vercel especificamente:** o arquivo `backend/vercel.json` e
`backend/api/index.js` incluídos aqui permitem publicar o backend também na
Vercel, como Função Serverless. Porém é importante saber que **funções
serverless da Vercel têm sistema de arquivos temporário (efêmero)** — ele não
é compartilhado entre as várias instâncias da função e pode ser apagado a
qualquer momento (novo deploy, instância "fria" etc.). Ou seja: publicando o
backend assim, **as fotos enviadas podem sumir depois de um tempo**, o que
não seria confiável para o portfólio de verdade.

Duas formas de resolver isso, dependendo do que você preferir:
- **Opção simples (recomendada):** publicar só o frontend na Vercel e o
  backend em um serviço com disco persistente (Render, Railway, um VPS). É a
  forma mais fiel ao pedido de "guardar as fotos no servidor".
- **Opção 100% Vercel:** trocar o armazenamento local por um serviço de
  arquivos compatível com serverless, como o Vercel Blob Storage ou um bucket
  S3/Cloudflare R2. Nesse caso as fotos deixam de ficar em `backend/uploads`
  e passam a ficar num serviço de armazenamento de objetos — posso montar essa
  versão se você preferir seguir 100% na Vercel.

---

## 5. Segurança antes de publicar de verdade

- Troque `ADMIN_PASSWORD` e `JWT_SECRET` no `.env` de produção — os valores do
  `.env.example` são só para desenvolvimento.
- `CORS_ORIGIN` deve conter exatamente a URL do site publicado (pode ter mais
  de uma, separada por vírgula).
- O login atual é de usuário único (a própria fotógrafa) — é suficiente para
  o uso descrito, mas se no futuro mais de uma pessoa for gerenciar o
  portfólio, vale migrar para uma tabela de usuários com senha própria por
  pessoa.
