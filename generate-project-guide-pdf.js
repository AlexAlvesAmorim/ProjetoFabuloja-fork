import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const projectDir = 'E:\\PROJETOS\\Fabulosa-Ecommerce';
const outputDir = path.join(projectDir, 'docs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createPDF(title, content, filename) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(path.join(outputDir, filename));
    doc.pipe(stream);

    doc.fontSize(24).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(10).font('Helvetica').fillColor('#666')
      .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });
    doc.moveDown(1);

    doc.fillColor('#000');

    content.forEach(section => {
      if (section.type === 'heading') {
        doc.moveDown(0.5);
        doc.fontSize(16).font('Helvetica-Bold').text(section.text);
        doc.moveDown(0.3);
        doc.strokeColor('#e0e0e0').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
      } else if (section.type === 'subheading') {
        doc.moveDown(0.3);
        doc.fontSize(13).font('Helvetica-Bold').text(section.text);
        doc.moveDown(0.2);
      } else if (section.type === 'text') {
        doc.fontSize(11).font('Helvetica').text(section.text, { align: 'justify' });
        doc.moveDown(0.3);
      } else if (section.type === 'list') {
        section.items.forEach(item => {
          doc.fontSize(11).font('Helvetica').text(`• ${item}`, { indent: 20 });
        });
        doc.moveDown(0.3);
      } else if (section.type === 'code') {
        doc.moveDown(0.2);
        doc.fontSize(9).font('Courier').fillColor('#333')
          .text(section.text, { indent: 20, lineGap: 2 });
        doc.fillColor('#000');
        doc.moveDown(0.3);
      } else if (section.type === 'table') {
        const colWidths = section.colWidths || [150, 345];
        let y = doc.y;
        section.headers.forEach((header, i) => {
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#fff')
            .text(header, 50 + colWidths.slice(0, i).reduce((a,b)=>a+b,0), y, { width: colWidths[i], align: 'left' });
        });
        doc.rect(50, y, colWidths.reduce((a,b)=>a+b,0), 20).fill('#2c3e50');
        y += 20;

        section.rows.forEach((row, rowIndex) => {
          if (y > 750) {
            doc.addPage();
            y = 50;
          }
          const bgColor = rowIndex % 2 === 0 ? '#f8f9fa' : '#fff';
          doc.rect(50, y, colWidths.reduce((a,b)=>a+b,0), 18).fill(bgColor);
          row.forEach((cell, i) => {
            doc.fontSize(9).font('Helvetica').fillColor('#333')
              .text(String(cell), 50 + colWidths.slice(0, i).reduce((a,b)=>a+b,0), y + 4, { width: colWidths[i], align: 'left' });
          });
          y += 18;
        });
        doc.y = y + 10;
        doc.fillColor('#000');
        doc.moveDown(0.5);
      }
    });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

const projectGuideContent = [
  { type: 'heading', text: 'GUIA COMPLETO DO PROJETO FABULOSA E-COMMERCE' },
  { type: 'subheading', text: 'Arquitetura, Tecnologias e Decisões Técnicas' },
  { type: 'text', text: 'Este documento explica o projeto Fabulosa E-commerce (Fork: ProjetoFabuloja-fork), detalhando cada tecnologia escolhida, o motivo da escolha e como tudo se conecta.' },
  { type: 'text', text: 'Data: ' + new Date().toLocaleString('pt-BR') },

  { type: 'heading', text: '1. VISÃO GERAL DA ARQUITETURA' },
  { type: 'text', text: 'O projeto segue uma arquitetura moderna de aplicação full-stack desacoplada:' },
  { type: 'list', items: [
    'Frontend: React 19 + Vite 7 + TypeScript (SPA)',
    'Backend: Fastify + TypeScript (API REST)',
    'Database: PostgreSQL + Prisma ORM',
    'Cache: Redis (sessões, rate limiting futuro)',
    'Deploy: Docker Compose (dev) / Docker multi-stage (prod)',
    'CI/CD: GitHub Actions (lint → typecheck → build)',
  ]},
  { type: 'text', text: 'Padrão: Frontend e Backend separados, comunicando via API REST + cookies HttpOnly.' },

  { type: 'heading', text: '2. FRONTEND - TECNOLOGIAS E PORQUÊ' },
  { type: 'subheading', text: 'React 19 + TypeScript' },
  { type: 'list', items: [
    'React 19: Concurrent features, Server Components ready, melhor performance',
    'TypeScript strict mode: Type safety em compile-time, refactoring seguro, autocomplete',
    'Vite 7: Build ultra-rápido, HMR instantâneo, tree-shaking nativo, ESM moderno',
  ]},
  { type: 'subheading', text: 'Tailwind CSS 4' },
  { type: 'list', items: [
    'Utility-first: Desenvolvimento rápido, consistência visual, bundle pequeno (purge automático)',
    'JIT compiler: Build rápido, apenas CSS usado',
    'Design system: Tokens de cor, spacing, typography centralizados',
    'Responsive first: Mobile-first nativo, breakpoints intuitivos',
  ]},
  { type: 'subheading', text: 'React Router DOM 7' },
  { type: 'list', items: [
    'Data loading: loaders/actions para data fetching declarativo',
    'Type-safe routes: Tipagem automática de params/query',
    'Lazy loading: Code-splitting automático por rota',
  ]},
  { type: 'subheading', text: 'Lucide React' },
  { type: 'list', items: [
    'Tree-shakeable: Importa apenas ícones usados',
    'Consistência: Mesmo estilo visual em todo app',
    'SVG inline: Sem requests extras, estilável via CSS',
  ]},
  { type: 'subheading', text: 'Vitest + React Testing Library' },
  { type: 'list', items: [
    'Vitest: Nativo Vite, rápido, ESM nativo, compatível Jest API',
    'RTL: Testes centrados no usuário (queries por role/label/text)',
    'happy-dom: DOM leve, rápido, sem JSDOM pesado',
  ]},

  { type: 'heading', text: '3. BACKEND - TECNOLOGIAS E PORQUÊ' },
  { type: 'subheading', text: 'Fastify' },
  { type: 'list', items: [
    'Performance: 2x mais rápido que Express, baixo overhead',
    'Schema validation: Integração nativa com JSON Schema / Zod',
    'TypeScript first: Tipagem nativa de rotas, hooks, plugins',
    'Plugin ecosystem: Helmet, CORS, Rate-limit, Multipart, Sensible nativos',
    'Async/await nativo: Sem callback hell, error handling via try/catch',
  ]},
  { type: 'subheading', text: 'Prisma ORM' },
  { type: 'list', items: [
    'Type-safe: Queries tipadas end-to-end (schema → tipos TS)',
    'Migrations: Versionamento de schema, rollback seguro',
    'Relations: Type-safe joins, include/select tipados',
    'Performance: Query optimization, connection pooling, prepared statements',
    'Developer experience: Prisma Studio, autocomplete, type hints',
  ]},
  { type: 'subheading', text: 'Zod Validation' },
  { type: 'list', items: [
    'Schema-first: Validação declarativa, inferência de tipos automática',
    'Runtime + compile-time: Valida em runtime, tipa em compile-time',
    'Composability: .extend(), .partial(), .pick(), .omit() reutilizáveis',
    'Fastify integration: fastify-type-provider-zod integra nativamente',
  ]},
  { type: 'subheading', text: 'JWT + HttpOnly Cookies' },
  { type: 'list', items: [
    'HttpOnly: Imune a XSS (JavaScript não acessa)',
    'SameSite=Strict: CSRF protection nativo',
    'Secure: Apenas HTTPS em produção',
    'Short expiry + refresh token pattern (futuro): Segurança em camadas',
  ]},
  { type: 'subheading', text: 'Sharp Image Processing' },
  { type: 'list', items: [
    'WebP output: 30% menor que JPEG, qualidade visual equivalente',
    'Resize on upload: 800px max, previne uploads gigantes',
    'Metadata stripping: Remove EXIF/GPS (privacidade)',
    'Pipeline streaming: Baixo uso de memória',
  ]},

  { type: 'heading', text: '4. BANCO DE DADOS - POSTGRESQL + PRISMA' },
  { type: 'subheading', text: 'Modelos Principais' },
  { type: 'code', text: `// User - Admin do painel
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  name          String
  role          Role     @default(ADMIN)
  lastLoginAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([email])
}

enum Role { ADMIN CUSTOMER }

// Store - Configuração da loja
model Store {
  id             String   @id @default(cuid())
  name           String
  whatsappNumber String
  email          String?
  phone          String?
  address        String?
  businessHours  Json?
  socialLinks    Json?
  categories     Category[]
  settings       StoreSettings?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// Category - Categorias de produtos
model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  label     String
  storeId   String
  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  products  Product[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([storeId])
}

// Product - Produtos do catálogo
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Decimal  @db.Decimal(10, 2)
  image       String
  details     String?
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([categoryId])
  @@index([active])
}

// LeadEvent - Tracking de intenção de compra
model LeadEvent {
  id            String     @id @default(cuid())
  productId     String
  productName   String
  productPrice  Decimal    @db.Decimal(10, 2)
  eventType     EventType
  sessionId     String
  ipAddress     String?
  userAgent     String?
  referrer      String?
  createdAt     DateTime   @default(now())
  @@index([productId])
  @@index([eventType])
  @@index([sessionId])
  @@index([createdAt])
}

enum EventType { PRODUCT_VIEW BUY_CLICK WHATSAPP_REDIRECT }`},

  { type: 'subheading', text: 'Por que PostgreSQL?' },
  { type: 'list', items: [
    'ACID compliance: Transações confiáveis, consistência garantida',
    'JSONB: Flexibilidade para dados semi-estruturados (businessHours, socialLinks)',
    'Extensões: pg_trgm (busca textual), uuid-ossp, citext',
    'Confiabilidade: 25+ anos, usado por empresas críticas',
    'Escalabilidade: Partitioning, read replicas, connection pooling (PgBouncer)',
  ]},

  { type: 'heading', text: '5. SEGURANÇA IMPLEMENTADA' },
  { type: 'table', headers: ['Camada', 'Implementação', 'Proteção'], colWidths: [100, 200, 245], rows: [
    ['SQL Injection', 'Prisma ORM (parametrized queries)', 'Impossível via ORM'],
    ['XSS', 'HttpOnly cookies + CSP + React escape', 'Token inacessível via JS'],
    ['CSRF', 'SameSite=Strict + Origin check', 'Requests cross-origin bloqueados'],
    ['Input Validation', 'Zod schemas em todos endpoints', 'Dados inválidos rejeitados cedo'],
    ['Rate Limiting', '@fastify/rate-limit (100 req/min/IP)', 'DoS/Brute force mitigado'],
    ['Headers', 'Helmet + CSP restritivo', 'Clickjacking, MIME sniffing, XSS'],
    ['File Upload', 'Sharp reprocessa + MIME validation', 'Polyglots, EXIF, scripts removidos'],
    ['Secrets', 'Env vars + .gitignore', 'Nenhum secret no Git'],
    ['Auth', 'JWT + bcrypt (12 rounds) + HttpOnly', 'Session hijacking difícil'],
  ]},

  { type: 'heading', text: '6. ADMIN PANEL - FUNCIONALIDADES' },
  { type: 'table', headers: ['Módulo', 'Funcionalidades', 'Tecnologias'], colWidths: [100, 200, 245], rows: [
    ['Auth', 'Login, logout, sessão persistente', 'JWT + HttpOnly cookie, ProtectedRoute'],
    ['Dashboard', 'KPIs, produtos recentes', 'Stats cards, tabela paginada'],
    ['Produtos', 'CRUD completo, busca, paginação', 'Modal form, validação Zod, status toggle'],
    ['Categorias', 'CRUD, contagem produtos', 'Modal create/edit, delete com validação'],
    ['Analytics', 'KPIs, top produtos, filtro data', 'Date range, conversion rate badges, tabela ordenável'],
  ]},
  { type: 'subheading', text: 'Componentes Reutilizáveis' },
  { type: 'list', items: [
    'AdminLayout: Sidebar colapsível, logo, navegação ativa, logout',
    'ProductForm: Modal criar/editar, select categoria, preview imagem, validação',
    'CategoriesPage: Tabela, modal criar, busca, delete com validação',
    'AnalyticsPage: Filtro data, 4 KPIs cards, tabela top 10 com badges coloridos',
  ]},

  { type: 'heading', text: '7. LEAD TRACKING & ANALYTICS' },
  { type: 'subheading', text: 'Eventos Rastreados (useProductModal)' },
  { type: 'list', items: [
    'PRODUCT_VIEW: Usuário abre modal do produto',
    'BUY_CLICK: Usuário clica "Quero comprar"',
    'WHATSAPP_REDIRECT: Usuário clica "Comprar pelo WhatsApp"',
  ]},
  { type: 'subheading', text: 'Payload Enviado para /api/lead-events' },
  { type: 'code', text: `{
  productId: "uuid",
  productName: "Camisa Lacoste",
  productPrice: 90.00,
  eventType: "PRODUCT_VIEW" | "BUY_CLICK" | "WHATSAPP_REDIRECT",
  sessionId: "uuid-v4",           // sessionStorage
  referrer: "https://google.com/", // document.referrer
  ipAddress: "auto",              // backend
  userAgent: "Mozilla/5.0..."     // backend
}`},
  { type: 'subheading', text: 'Analytics Dashboard' },
  { type: 'list', items: [
    '4 KPIs: Views, Cliques, WhatsApp Redirects, Taxa Conversão',
    'Filtro por data (início/fim)',
    'Top 10 produtos: Views, Clicks, WhatsApp, Conversão %',
    'Badges coloridos: Verde (≥5%), Amarelo (2-5%), Vermelho (<2%)',
  ]},

  { type: 'heading', text: '8. PWA (PROGRESSIVE WEB APP)' },
  { type: 'list', items: [
    'vite-plugin-pwa: registerType: "autoUpdate"',
    'Service Worker: generateSW (Workbox)',
    'Manifest: name, icons (72-512px), theme_color #0ea5e9, display: standalone',
    'Runtime Caching (Workbox):',
    '  - Google Fonts: CacheFirst (1 ano)',
    '  - API: NetworkFirst (24h, timeout 10s)',
    '  - Imagens produtos: CacheFirst (30 dias)',
    'Precache: ~68 entries (~2.9 MB)',
    'Ícones: 8 tamanhos (72-512px) em public/icons/',
  ]},

  { type: 'heading', text: '9. DEVOPS & CI/CD' },
  { type: 'table', headers: ['Componente', 'Arquivo', 'Detalhes'], colWidths: [100, 180, 265], rows: [
    ['Docker API', 'server/Dockerfile', 'Multi-stage: deps → builder → runner (Alpine, non-root)'],
    ['Docker Web', 'Dockerfile', 'Multi-stage: deps → builder → runner (nginx/preview)'],
    ['Docker Compose', 'docker-compose.yml', 'Postgres 16 + Redis 7 + API + Web, healthchecks'],
    ['CI/CD', '.github/workflows/ci.yml', 'lint → typecheck → build (Node 20, ubuntu-latest)'],
    ['Pre-commit', '.husky/pre-commit', 'lint-staged (ESLint + Prettier)'],
    ['Prisma', 'prisma/schema.prisma', 'Migrations versionadas, seed.ts'],
    ['Scripts', 'package.json', 'dev, build, lint, format, test, prisma:*'],
  ]},

  { type: 'heading', text: '10. ESTRUTURA DE PASTAS COMPLETA' },
  { type: 'code', text: `Fabulosa-Ecommerce/
├── docs/                          # 5 PDFs técnicos
├── public/
│   ├── icons/                     # 8 ícones PWA (72-512px)
│   └── uploads/                   # Imagens upload (Sharp WebP)
├── server/                        # Backend Fastify
│   ├── prisma/
│   │   ├── schema.prisma          # Models completos
│   │   └── seed.ts                # Seed: store, 2 cats, 32 produtos, admin
│   ├── src/
│   │   ├── config/index.ts        # Env validation (Zod)
│   │   ├── controllers/           # Auth, Product, Category, LeadEvent
│   │   ├── middleware/            # auth (JWT cookie+header), errorHandler
│   │   ├── repositories/          # Prisma queries encapsuladas
│   │   ├── routes/                # index.ts + upload.ts
│   │   ├── services/              # Business logic (separation of concerns)
│   │   ├── schemas/               # Zod validation schemas
│   │   ├── types/                 # Types compartilhados
│   │   ├── utils/                 # logger, prisma client singleton
│   │   └── index.ts               # App entry point
│   ├── Dockerfile                 # Multi-stage Alpine
│   ├── docker-entrypoint.sh       # Migrate + seed on start
│   └── package.json
├── src/                           # Frontend React 19 + Vite 7
│   ├── components/
│   │   ├── admin/                 # Admin panel completo
│   │   ├── layout/                # Navbar, Footer
│   │   ├── sections/              # Hero, About, ProductCatalog
│   │   └── ui/                    # ProductCard, ProductModal
│   ├── contexts/admin/            # AuthContext (HttpOnly cookies)
│   ├── data/collections.ts        # Dados tipados (fallback)
│   ├── hooks/                     # useProductModal, useCollections, useScrollToSection
│   ├── lib/api.ts                 # API client (credentials: include)
│   ├── types/                     # api.ts, index.ts
│   ├── App.tsx                    # Routes: / + /admin/*
│   └── main.tsx
├── tests/                         # Testes
│   ├── e2e/                       # Playwright
│   └── unit/                      # Vitest
├── docker-compose.yml             # Postgres + Redis + API + Web
├── Dockerfile                     # Frontend multi-stage
├── .github/workflows/ci.yml       # Lint → Typecheck → Build → Test
├── .husky/pre-commit              # lint-staged
├── eslint.config.js               # Flat config TS + React
├── .prettierrc                    # Code style
├── tsconfig.json                  # Strict TS + path aliases
├── vite.config.ts                 # React + Tailwind + PWA
└── package.json`},

  { type: 'heading', text: '11. COMANDOS ESSENCIAIS' },
  { type: 'subheading', text: 'Desenvolvimento Local' },
  { type: 'code', text: `# Terminal 1 - API
cd server
cp .env.example .env
# Configure DATABASE_URL, JWT_SECRET
docker compose up -d postgres redis
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev`},
  { type: 'subheading', text: 'Docker (Produção/Staging)' },
  { type: 'code', text: `docker compose up -d --build
# Frontend: http://localhost:5173
# API: http://localhost:3000
# Admin: http://localhost:5173/admin/login
# Demo: admin@fabulosamodas.com / admin123`},
  { type: 'subheading', text: 'Testes' },
  { type: 'code', text: `# Frontend
npm run test           # Vitest watch
npm run test:run       # Vitest CI
npm run test:coverage  # Coverage report

# E2E
npm run test:e2e       # Playwright
npm run test:e2e:ui    # Playwright UI

# Backend
cd server
npm run test           # Vitest watch
npm run test:run       # Vitest CI`},

  { type: 'heading', text: '11. DECISÕES TÉCNICAS CHAVE (ADR-STYLE)' },
  { type: 'table', headers: ['Decisão', 'Opção Escolhida', 'Alternativas', 'Justificativa'], colWidths: [100, 100, 120, 225], rows: [
    ['Frontend Framework', 'React 19', 'Vue 3, Svelte', 'Ecossistema maduro, equipe familiar, Concurrent features'],
    ['Build Tool', 'Vite 7', 'Webpack, Next.js', 'Dev server instantâneo, ESM nativo, plugin ecosystem'],
    ['Language', 'TypeScript Strict', 'JavaScript, Flow', 'Type safety, refactoring seguro, DX superior'],
    ['Styling', 'Tailwind CSS 4', 'CSS Modules, Styled Components', 'Utility-first, bundle pequeno, design system nativo'],
    ['Backend Framework', 'Fastify', 'Express, NestJS', 'Performance 2x, validação nativa, TS-first'],
    ['Database', 'PostgreSQL', 'MySQL, MongoDB', 'ACID, JSONB, extensões, confiabilidade enterprise'],
    ['ORM', 'Prisma', 'TypeORM, Drizzle, Knex', 'Type-safety end-to-end, migrations, DX'],
    ['Validation', 'Zod', 'Joi, Yup, class-validator', 'Type inference, composability, Fastify integration'],
    ['Auth', 'JWT + HttpOnly Cookie', 'localStorage, Session', 'XSS-proof, CSRF-proof, mobile-friendly'],
    ['Image Processing', 'Sharp', 'JimP, ImageMagick', 'Performance, WebP, streaming, metadata stripping'],
    ['Testing', 'Vitest + Playwright', 'Jest + Cypress', 'Vite-native, ESM, faster, modern API'],
    ['PWA', 'vite-plugin-pwa', 'Workbox manual, next-pwa', 'Integrado Vite, auto-update, Workbox abstraction'],
    ['Container', 'Docker Multi-stage', 'VM, Serverless', 'Reprodutível, leve, cache layers, security'],
    ['CI/CD', 'GitHub Actions', 'GitLab CI, CircleCI', 'Gratuito p/ público, integração nativa GH'],
  ]},

  { type: 'heading', text: '12. PRÓXIMOS PASSOS (ROADMAP)' },
  { type: 'list', items: [
    '1. Banco PostgreSQL real (Neon/Supabase/Railway) + DATABASE_URL',
    '2. JWT_SECRET forte (openssl rand -base64 32) para produção',
    '3. Domínio real + HTTPS + CORS_ORIGIN no .env',
    '4. Testes: Vitest (unit), Playwright (E2E), Coverage >80%',
    '5. Sentry (error tracking) + Pino structured logs',
    '6. Deploy: Railway/Render (API) + Vercel/Netlify (Web) + PostgreSQL managed',
    '7. Phase 6: WhatsApp Lead Tracking completo + Analytics avançado',
    '8. Phase 7: Image upload no ProductForm (dropzone + preview + Sharp)',
    '9. Phase 8: Wishlist, compartilhamento, comparação produtos',
    '10. Phase 9: Testes automatizados + CI/CD deploy automático',
  ]},
];

async function main() {
  console.log('Gerando PDF do guia do projeto...');
  await createPDF(
    'GUIA COMPLETO DO PROJETO\nFabulosa E-commerce - Arquitetura & Decisões Técnicas',
    projectGuideContent,
    'guia-projeto-fabuloja.pdf'
  );
  console.log('✅ PDF gerado em docs/guia-projeto-fabuloja.pdf');
}

main().catch(console.error);