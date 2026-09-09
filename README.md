# Fabulosa E-Commerce (Fabuloja) — loja full-stack com API, admin e Docker

![CI](https://github.com/AlexAlvesAmorim/ProjetoFabuloja-fork/actions/workflows/ci.yml/badge.svg)
![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-4-000000?logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white)
![Playwright](https://img.shields.io/badge/e2e-Playwright-45ba4b?logo=playwright&logoColor=white)

E-commerce de moda feminina/masculina com **front SPA + API própria + banco + admin**,
empacotado em **Docker Compose**. Projeto nascido como estudo, refatorado até virar base
profissional — e reaproveitado como fundação do [99Food Analytics](https://github.com/AlexAlvesAmorim/99Food-Analytics).

> Fork de evolução do [Fabuloja original](https://github.com/AlexAlvesAmorim/Fabuloja) — esta branch/fork **é a main atual**.

---

## 📖 Sobre

Catálogo completo com identidade visual de moda, painel administrativo protegido por login,
CRUD de produtos e categorias (nome, tamanho, cor, preço, descrição), upload de imagens e
analytics de eventos por produto (visualizações, cliques, redirecionamentos).

- 🔐 **Admin com auth real:** login/logout, JWT + cookies, rotas protegidas por permissão
- 🛒 **CRUD completo:** produtos e categorias, com validação ponta a ponta
- 🖼️ **Upload de imagens:** multipart + processamento com `sharp`
- 📊 **Analytics de eventos:** comportamento por produto para decisão de vitrine
- 🛡️ **Segurança:** validação `Zod` + `fastify-type-provider-zod`, sanitização anti-XSS, `helmet`, `rate-limit`, CORS estrito
- 🐳 **Infra como código:** `docker-compose.yml` sobe web + api + PostgreSQL + Redis
- 🧪 **Testes em 3 níveis:** Vitest no front, Vitest na API e Playwright e2e
- 🧹 **Padrão profissional:** ESLint + Prettier + Husky + lint-staged, `.env.example` versionado

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Front | React 19 + TypeScript + Vite 7 + Tailwind 4 + React Router 7 |
| API | Node.js 20 + Fastify 4 + Zod + JWT (`jsonwebtoken` + `@fastify/cookie`) |
| Banco | PostgreSQL + Prisma ORM 5 (+ seed) · Redis (cache/filas) |
| Upload | `multer`/`@fastify/multipart` + `sharp` |
| Qualidade | Vitest (front + api), Testing Library, Playwright e2e, ESLint, Prettier, Husky |
| Infra | Docker + Docker Compose, PWA (`vite-plugin-pwa`) |

### Estrutura

```
./                 # front SPA (src/, public/, tests/e2e, playwright.config.ts)
server/
├── src/           # API Fastify (rotas, plugins, serviços)
├── prisma/        # schema, migrations, seed.ts
├── vitest.server.config.ts
└── Dockerfile
docker-compose.yml # api + web + postgres + redis
docs/              # guias do projeto
```

---

## 🚀 Rodando local

### Opção A — tudo no Docker (recomendado)

```bash
cp server/.env.example server/.env   # ajuste POSTGRES_*, JWT_SECRET, etc.
docker compose up --build
# web → http://localhost:5173 · api → http://localhost:3000
```

### Opção B — front + api separados

```bash
# API
cd server
npm ci
npm run db:setup        # generate + migrate + seed
npm run dev             # tsx watch

# FRONT (outro terminal, na raiz)
npm ci
npm run dev             # vite
```

### Scripts úteis

```bash
# raiz (front)
npm run build | preview | lint | lint:fix | format | typecheck
npm run test:run        # vitest run
npm run test:e2e        # playwright test

# server/
npm run build | start | lint | format
npm run test            # vitest run
npm run prisma:studio   # banco visual
```

Requisitos: Node 20+, Docker + Compose para a Opção A. Sem chaves externas.

---

## 🧪 Testes e CI

- Front: `npm run test:run` (Vitest + Testing Library, `happy-dom`/`jsdom`) + `npm run test:e2e` (Playwright)
- API: `cd server && npm test` (Vitest)
- CI (`.github/workflows/ci.yml`): `lint` → `format:check` → `typecheck` → `build` em push/PR para `main`/`develop`

---

## 🗺️ Roadmap

- [ ] Subir API + banco para ambiente público (Render/Fly + Postgres gerenciado) e colar a URL aqui
- [ ] Cobertura de testes publicada (badge codecov)
- [ ] Checkout/pagamento (Pix/cartão) — em estudo
- [ ] Unificar `Fabuloja` antigo como redirect para este fork

---

Feito por **Alex Alves Amorim** — [GitHub](https://github.com/AlexAlvesAmorim) · [LinkedIn](https://linkedin.com/in/alex-a-amorim)
