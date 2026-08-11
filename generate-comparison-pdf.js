import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const projectDir = 'E:\\PROJETOS\\Fabulosa-Ecommerce';
const outputDir = path.join(projectDir, 'docs');

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

const comparison = [
  { type: 'heading', text: 'COMPARATIVO: ROADMAP ESTRATÉGICO vs PROPOSTA DE MELHORIAS' },
  { type: 'subheading', text: 'Análise de alinhamento, lacunas e convergências' },

  { type: 'heading', text: '1. RESUMO EXECUTIVO' },
  { type: 'text', text: 'Ambos os documentos compartilham a mesma visão: evoluir o FabuLoja de uma landing page estática para uma aplicação full-stack profissional, mantendo o modelo "catálogo + WhatsApp leads" (sem checkout tradicional). O Roadmap Estratégico é mais estruturado em fases sequenciais de aprendizado; a Proposta de Melhorias é mais técnica e orientada a entrega imediata de valor.' },

  { type: 'heading', text: '2. MAPEAMENTO DE ALINHAMENTO POR FASE/PILAR' },
  { type: 'table', headers: ['Roadmap (Fase)', 'Proposta (Pilar)', 'Status', 'Observações'], colWidths: [110, 110, 70, 255], rows: [
    ['Fase 0: Base Atual', '—', '✅ Alinhado', 'Ambos partem do estado atual como baseline'],
    ['Fase 1: Foundation Front-End', 'Pilar 1: Arquitetura + Pilar 4: Qualidade', '✅ Forte', 'TS migration, ESLint/Prettier, component extraction, testes básicos'],
    ['Fase 2: Backend Foundation', 'Pilar 1 (extensão) + Pilar 2 (Core Commerce)', '✅ Alinhado', 'API REST, Zod, validação, error handling — base para catálogo dinâmico'],
    ['Fase 3: PostgreSQL + Prisma', 'Pilar 1 (data layer)', '✅ Alinhado', 'Modelagem relacional, migrations, paginação — substitui hardcoded data'],
    ['Fase 4: Auth + AuthZ', 'Pilar 2 (Admin) + Pilar 5 (A11y/Security)', '✅ Alinhado', 'RBAC, HTTP-only cookies, proteção de rotas admin'],
    ['Fase 5: Painel Admin', 'Pilar 2 (Admin/Catalog)', '✅ Alinhado', 'CRUD produtos/categorias, config WhatsApp, gestão imagens'],
    ['Fase 6: WhatsApp + Leads', 'Pilar 2 (Checkout WhatsApp) + Pilar 3 (Analytics)', '✅ Forte', 'Event tracking: view → click → lead → redirect — mensagens dinâmicas'],
    ['Fase 7: Analytics', 'Pilar 3 (SEO/Analytics)', '✅ Alinhado', 'Métricas de intenção: views, clicks, conversão, filtros temporais'],
    ['Fase 8: Qualidade + Segurança', 'Pilar 4 (Qualidade) + Pilar 5 (A11y)', '✅ Forte', 'Rate limiting, CORS, security headers, secrets, logs, deps review'],
    ['Fase 9: Testes', 'Pilar 4 (Testes)', '✅ Alinhado', 'Unit + Integration + E2E — fluxo completo login→admin→produto→lead'],
    ['Fase 10: Docker + CI/CD', 'Pilar 4 (CI/CD)', '✅ Alinhado', 'Dockerfile, Compose, GitHub Actions: lint→typecheck→test→build→deploy'],
    ['Fase 11: Produção + Observabilidade', 'Pilar 3 (Performance) + Pilar 4 (Deploy)', '✅ Alinhado', 'HTTPS, monitoring, backup, API docs, logs produção'],
  ]},

  { type: 'heading', text: '3. CONVERGÊNCIAS PRINCIPAIS' },
  { type: 'list', items: [
    'Modelo de negócio idêntico: Catálogo digital → Lead WhatsApp (sem payment gateway inicial)',
    'Stack tecnológica convergente: React/TS/Vite/Tailwind + Node/TS/Fastify + PostgreSQL/Prisma',
    'Arquitetura em camadas: Controller → Service → Data Access (separation of concerns)',
    'Qualidade como requisito não-funcional: TypeScript strict, ESLint, Prettier, Husky, CI/CD',
    'Testes em pirâmide: Unit → Integration → E2E (Playwright/Vitest)',
    'Segurança prática: Zod validation, HTTP-only cookies, RBAC, rate limiting, security headers',
    'Observabilidade: Logs estruturados, métricas de negócio (leads/conversão), monitoring',
    'Deploy profissional: Docker, GitHub Actions, staging + production environments'
  ]},

  { type: 'heading', text: '4. LACUNAS E COMPLEMENTARIDADES' },
  { type: 'subheading', text: '4.1 Roadmap tem, Proposta não tem (ou menos explícito)' },
  { type: 'list', items: [
    'Fase 4: Autenticação/Autorização completa (RBAC, cookies HTTP-only, 401/403) — Proposta menciona "Auth (Fase 2)" mas sem detalhes',
    'Fase 5: Painel Admin com CRUD completo, gestão de imagens, configurações da loja — Proposta foca mais no front-end público',
    'Fase 6/7: Event tracking granular (product_view, buy_click, whatsapp_redirect) + Analytics de intenção — Proposta menciona "analytics" mas não detalha eventos',
    'Fase 8: Security hardening explícito (CORS, rate limiting, headers, secrets, dependency review)',
    'Critério de Consolidação: "consegue explicar e defender decisões técnicas" — foco em aprendizado/mastery',
    'Escopo negativo explícito: "Fora do escopo inicial" evita over-engineering'
  ]},
  { type: 'subheading', text: '4.2 Proposta tem, Roadmap não tem (ou menos explícito)' },
  { type: 'list', items: [
    'Pilar 3: Performance/SEO/CWV detalhado (LCP/INP/CLS targets, image optimization, code-splitting, JSON-LD, sitemap, meta tags dinâmicas)',
    'Pilar 5: Acessibilidade WCAG 2.1 AA detalhada (focus trap, skip links, reduced motion, contrast audit, live regions)',
    'Pilar 2: Catálogo inteligente no front-end (busca debounced, filtros, ordenação, paginação/infinite scroll, estados vazios, skeletons)',
    'Pilar 2: Product Detail Pages (PDP) com galeria, variantes, cross-sell, Web Share API',
    'Pilar 1: Estrutura de pastas proposta com separação ui/layout/hooks/context/data/types/utils/styles',
    'Pilar 1: Hooks customizados (useScrollToSection, useProductModal, useCart, useCollections)',
    'Pilar 4: Visual regression testing (Chromatic/Playwright screenshots)',
    'Environment config template (.env.example) com variáveis específicas',
    'Roadmap de implementação em 6 fases com esforço estimado e prioridade',
    'Tabela de impacto projetado (Lighthouse scores, bundle size, conversão, manutenibilidade)'
  ]},

  { type: 'heading', text: '5. SÍNTESE: ROADMAP UNIFICADO RECOMENDADO' },
  { type: 'text', text: 'A melhor abordagem é seguir o Roadmap Estratégico como espinha dorsal (fases sequenciais de aprendizado) e incorporar os detalhamentos técnicos da Proposta de Melhorias em cada fase correspondente.' },
  { type: 'table', headers: ['Fase Unificada', 'Foco Principal', 'Entregas-Chave (combinadas)'], colWidths: [120, 120, 305], rows: [
    ['1. Foundation', 'TS + Qualidade + Estrutura', 'TS strict, ESLint/Prettier/Husky, CI, component extraction (ui/layout/hooks/context), types Product/Category/Store, test setup (Vitest/RTL), duplicate data cleanup'],
    ['2. Backline API', 'API REST + Validação', 'Fastify + TS, Zod schemas, Controller→Service→DataAccess, error handling, env config, OpenAPI docs, health checks'],
    ['3. Data Layer', 'PostgreSQL + Prisma', 'Schema Store/Category/Product/Settings, migrations, indexes, pagination, seed script, Prisma Studio'],
    ['4. Auth + Admin', 'Segurança + Gestão', 'Register/login admin, bcrypt, JWT/cookies HTTP-only, RBAC (ADMIN), protected routes, 401/403, Admin Panel: Dashboard, CRUD Produtos/Categorias, image upload, WhatsApp config, Store settings'],
    ['5. Leads + Analytics', 'Eventos + Métricas', 'product_view, buy_click, whatsapp_redirect events, session context, dynamic WhatsApp msg, Analytics: views/clicks/leads/conversion por produto/período, dashboard admin'],
    ['6. Front-end Polish', 'UX + Performance + SEO + A11y', 'PDP (/produto/:id), busca/filtros/ordenacao/paginacao, skeletons, code-splitting, image optimization (LQIP), meta tags dinâmicas, JSON-LD, sitemap, CWV targets, WCAG AA: focus trap, skip links, reduced motion, contrast, live regions'],
    ['7. Hardening', 'Segurança + Qualidade', 'Rate limiting, CORS, security headers (helmet), secrets audit, dependency review, logs estruturados (pino), error tracking (Sentry)'],
    ['8. Testes Completos', 'Cobertura + Confiança', 'Unit (business logic, hooks, services), Integration (API+DB, auth, products), E2E (login→admin→create→store→lead→WhatsApp), Visual regression'],
    ['9. Docker + CI/CD', 'Entrega Automatizada', 'Dockerfile API, docker-compose (api+db), GitHub Actions: lint→typecheck→test→build→deploy preview→deploy prod'],
    ['10. Produção', 'Operação Real', 'Frontend (Vercel/Netlify), API (Railway/Render/Fly), PostgreSQL managed, HTTPS, env vars, monitoring, backup/restore, API docs, runbooks']
  ]},

  { type: 'heading', text: '6. PRÓXIMOS PASSOS IMEDIATOS (FASE 1)' },
  { type: 'list', items: [
    '1.1 Instalar TypeScript + @types/react + @types/node + tsconfig.json (strict mode)',
    '1.2 Renomear arquivos .jsx → .tsx progressivamente (main, App, components)',
    '1.3 Criar src/types/{product,category,store,cart,api}.ts com interfaces',
    '1.4 Extrair ProductCard → src/components/ui/ProductCard.tsx',
    '1.5 Extrair ProductModal → src/components/ui/ProductModal.tsx',
    '1.6 Mover collections para src/data/collections.ts (tipado)',
    '1.7 Criar hooks: useScrollToSection, useProductModal, useCollections',
    '1.8 Configurar ESLint (airbnb-typescript) + Prettier + Husky + lint-staged',
    '1.9 Adicionar scripts: "typecheck": "tsc --noEmit", "lint:fix", "format"',
    '1.10 GitHub Actions CI: lint → typecheck → test → build',
    '1.11 Testes básicos: ProductCard, useScrollToSection, formatters'
  ]},

  { type: 'heading', text: '7. CONCLUSÃO' },
  { type: 'text', text: 'Os dois documentos são altamente complementares. O Roadmap Estratégico fornece a sequência pedagógica e os marcos de consolidação; a Proposta de Melhorias fornece a especificação técnica detalhada para execução. Juntos, formam um plano completo para transformar o FabuLoja em um case full-stack de referência.' }
];

async function main() {
  console.log('Gerando PDF: Comparativo...');
  await createPDF(
    'COMPARATIVO E SÍNTESE\nRoadmap Estratégico vs Proposta de Melhorias\nFabuLoja',
    comparison,
    'comparativo-roadmap-vs-proposta.pdf'
  );
  console.log('✓ comparativo-roadmap-vs-proposta.pdf gerado');
  console.log('\n✅ PDF salvo em:', outputDir);
}

main().catch(console.error);