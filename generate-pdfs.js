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

const currentAnalysis = [
  { type: 'heading', text: '1. VISÃO GERAL DO PROJETO' },
  { type: 'text', text: 'O "Fabulosa Modas" é um e-commerce de moda (landing page single-page) desenvolvido com React 19, Vite 7 e TailwindCSS 4. O projeto apresenta uma vitrine de produtos masculinos e femininos com navegação por abas, modal de detalhes do produto e integração com WhatsApp para finalização de compra.' },
  { type: 'text', text: 'Tecnologias principais: React 19.1.0, React Router DOM 7.10.0, Vite 7.0.3, TailwindCSS 4.1.17, Lucide React 0.534.0 (ícones).' },
  { type: 'text', text: 'Estrutura: Single Page Application (SPA) com roteamento client-side, componente único de página (App.jsx) que renderiza todas as seções sequencialmente.' },

  { type: 'heading', text: '2. ARQUITETURA E ESTRUTURA DE ARQUIVOS' },
  { type: 'text', text: 'src/\n├── main.jsx                 # Entry point\n├── App.jsx                  # Componente raiz + roteamento + loading\n├── index.css                # Tailwind + font-face + keyframes\n├── utils/scrollToSection.js # Utilitário de scroll suave\n└── components/\n    ├── NavTopPage.jsx       # Navbar fixa com menu mobile\n    ├── HeroPage.jsx         # Hero section com background img\n    ├── AboutPage.jsx        # Sobre a empresa (3 cards)\n    ├── MainLandingPage.jsx  # Produtos (253 linhas, dados hardcoded)\n    ├── FooterPage.jsx       # Rodapé com contato e redes sociais\n    └── modules/Global.css   # Reset CSS global (não utilizado)' },

  { type: 'heading', text: '3. FUNCIONALIDADES IMPLEMENTADAS' },
  { type: 'subheading', text: '3.1 Navegação e Layout' },
  { type: 'list', items: [
    'Navbar fixa com backdrop-blur e mudança de estilo no scroll',
    'Menu hambúrguer responsivo para mobile',
    'Scroll suave para seções (home, produtos, sobre, footer)',
    'Loading screen com pré-carregamento de imagens (950ms mínimo)',
    'Transição de blur no conteúdo durante loading'
  ]},
  { type: 'subheading', text: '3.2 Hero Section' },
  { type: 'list', items: [
    'Background responsivo (picture element: desktop/mobile)',
    'Overlay gradient escuro para legibilidade',
    'Título com fonte customizada "Sufrimeda" e gradient text',
    'Dois CTAs para coleções masculina/feminina com navegação por URL (?aba=)',
    'Indicador de scroll animado (seta bounce)'
  ]},
  { type: 'subheading', text: '3.3 Seção Sobre' },
  { type: 'list', items: [
    'Banner com gradient overlay e texto heroico',
    '3 cards de valores: Paixão pela Moda, Estilo Único, Comunidade',
    'Hover effect com elevação e sombra',
    'Texto final com destaque da marca'
  ]},
  { type: 'subheading', text: '3.4 Catálogo de Produtos' },
  { type: 'list', items: [
    'Abas "Moda Masculina" / "Moda Feminina" com estado em URL',
    'Grid responsivo: 1 col (mobile) → 4 col (desktop)',
    '32 produtos masculinos + 32 produtos femininos (hardcoded)',
    'ProductCard com hover: zoom imagem, overlay "VER DETALHES", botão carrinho',
    'Modal de detalhes com imagem, preço, descrição, botão WhatsApp'
  ]},
  { type: 'subheading', text: '3.5 Footer' },
  { type: 'list', items: [
    'Contato: telefone, email, endereço',
    'Horário de funcionamento',
    'Redes sociais (Instagram, Facebook, Twitter/X)',
    'Créditos de desenvolvimento'
  ]},

  { type: 'heading', text: '4. DADOS DE PRODUTOS (HARDCODED)' },
  { type: 'table', headers: ['Coleção', 'Qtd Produtos', 'Faixa de Preço', 'Observações'], colWidths: [100, 80, 120, 245], rows: [
    ['Masculina', '32', 'R$ 87,00 - R$ 100,00', 'Marcas: Lacoste, Hugo Boss, Ecko, Nike, Adidas, Calvin Klein, Ralph Lauren, Oakley'],
    ['Feminina', '32', 'R$ 87,00 - R$ 100,00', 'Conjuntos: Boho Chic, Cropped+Jeans, Jaqueta+Saia, Tricô+Short, Total Jeans, Florido'],
  ]},
  { type: 'text', text: 'Problema crítico: Muitos produtos duplicados (ex: "Camisa Lacoste" aparece 3x com IDs 1, 9, 17). IDs femininos também duplicados (40-44 repetidos como 49-53).' },

  { type: 'heading', text: '5. ASSETS E RECURSOS ESTÁTICOS' },
  { type: 'list', items: [
    'Imagens: /manvitrine/ (32 arquivos), /womanvitrine/ (18 arquivos), showcase desktop/mobile',
    'Formatos: .webp, .avif (modernos, boa compressão)',
    'Fonte customizada: /fonts/sufrimeda.woff2 + .ttf + .png',
    'Total estimado de assets: ~50+ arquivos de imagem'
  ]},

  { type: 'heading', text: '6. BUILD E PERFORMANCE' },
  { type: 'table', headers: ['Métrica', 'Valor'], colWidths: [200, 295], rows: [
    ['Build time', '3.68s'],
    ['JS bundle (gzipped)', '79.51 kB (257.83 kB raw)'],
    ['CSS bundle (gzipped)', '6.63 kB (38.91 kB raw)'],
    ['HTML', '0.47 kB (0.30 kB gzipped)'],
    ['Total modules transformed', '1.676'],
    ['Vulnerabilidades npm audit', '14 (2 low, 1 moderate, 11 high)']
  ]},

  { type: 'heading', text: '7. PONTOS POSITIVOS (STRENGTHS)' },
  { type: 'list', items: [
    'Stack moderna e performática (React 19, Vite 7, Tailwind 4)',
    'Design visual atraente com gradient texts, glassmorphism, animações suaves',
    'Totalmente responsivo (mobile-first)',
    'Imagens em formatos modernos (WebP/AVIF)',
    'Fonte customizada bem integrada',
    'UX polida: loading screen, hover effects, transições, scroll suave',
    'Integração WhatsApp funcional para conversão',
    'Código limpo, organizado em componentes funcionais',
    'Uso de React Router para estado de aba em URL (shareable)',
    'Acessibilidade básica: alt texts, aria-labels, semantic HTML'
  ]},

  { type: 'heading', text: '8. PROBLEMAS E LIMITAÇÕES IDENTIFICADOS' },
  { type: 'subheading', text: '8.1 Arquitetura e Código' },
  { type: 'list', items: [
    'MainLandingPage.jsx com 253 linhas - violação de responsabilidade única',
    'Dados de produtos hardcoded no componente (não escalável)',
    'Produtos duplicados (IDs 1/9/17, 2/10/18, etc.)',
    'scrollToSection duplicado: em NavTopPage.jsx E em utils/scrollToSection.js',
    'ProductCard definido inline dentro de MainLandingPage.jsx',
    'Global.css importado mas não utilizado (reset duplicado com Tailwind)',
    'Sem TypeScript - sem type safety',
    'Sem Error Boundaries'
  ]},
  { type: 'subheading', text: '8.2 Funcionalidades de E-commerce Ausentes' },
  { type: 'list', items: [
    'Sem carrinho de compras persistente',
    'Sem checkout / pagamento',
    'Sem autenticação de usuário',
    'Sem gerenciamento de estado global (Context/Redux/Zustand)',
    'Sem busca ou filtros de produtos',
    'Sem paginação ou infinite scroll (renderiza todos 64 produtos)',
    'Sem wishlist / favoritos',
    'Sem avaliações/reviews de produtos',
    'Sem cálculo de frete'
  ]},
  { type: 'subheading', text: '8.3 Performance e SEO' },
  { type: 'list', items: [
    'SPA pura - SEO limitado (sem SSR/SSG)',
    'Todas as imagens de produto carregadas no bundle (sem lazy loading real)',
    'Bundle JS de 257KB - pode ser otimizado com code-splitting',
    'Sem meta tags Open Graph, Twitter Cards, JSON-LD',
    'Sem sitemap.xml, robots.txt',
    'Pré-carregamento forçado de apenas 2 imagens (hero)'
  ]},
  { type: 'subheading', text: '8.4 Acessibilidade e UX' },
  { type: 'list', items: [
    'Modal não foca no elemento ao abrir (trap focus ausente)',
    'Contraste de alguns textos sobre gradient pode falhar WCAG AA',
    'Sem skip link para conteúdo principal',
    'Loading screen bloqueia interação por 950ms mínimo',
    'WhatsApp number hardcoded (não configurável via env)'
  ]},
  { type: 'subheading', text: '8.5 DevOps e Qualidade' },
  { type: 'list', items: [
    'Sem testes (unitários, integração, E2E)',
    'Sem CI/CD pipeline',
    'ESLint configurado mas sem pre-commit hooks (husky)',
    'Sem Prettier para formatação consistente',
    'package.json sem engines (node version)',
    '14 vulnerabilidades conhecidas nas dependências'
  ]}
];

const improvements = [
  { type: 'heading', text: '1. RESUMO EXECUTIVO DAS MELHORIAS' },
  { type: 'text', text: 'Este documento propõe uma evolução arquitetural e funcional para transformar a landing page estática em um e-commerce escalável, mantendo a identidade visual e UX atuais. As melhorias são organizadas em 5 pilares: Arquitetura, Funcionalidades Core, Performance/SEO, Qualidade/DevOps e Acessibilidade.' },

  { type: 'heading', text: '2. PILAR 1: ARQUITETURA E REFACTORING' },
  { type: 'subheading', text: '2.1 Migração para TypeScript' },
  { type: 'list', items: [
    'Renomear .jsx → .tsx, adicionar tsconfig.json',
    'Tipar props de todos os componentes (Product, Collection, CartItem)',
    'Criar types/shared para contratos de API',
    'Habilitar strict mode no TypeScript'
  ]},
  { type: 'subheading', text: '2.2 Separação de Responsabilidades' },
  { type: 'list', items: [
    'Extrair ProductCard para src/components/ui/ProductCard.tsx',
    'Criar ProductModal.tsx separado',
    'Mover collections para src/data/collections.ts (ou CMS/API)',
    'Criar hooks customizados: useScrollToSection, useProductModal, useCollections',
    'Implementar Context API para CartState + WhatsApp config'
  ]},
  { type: 'subheading', text: '2.3 Estrutura de Pastas Proposta' },
  { type: 'code', text: `src/
├── components/
│   ├── ui/                    # Componentes base reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── ProductCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── About.tsx
│       └── ProductCatalog.tsx
├── hooks/
│   ├── useScrollToSection.ts
│   ├── useProductModal.ts
│   └── useCart.ts
├── context/
│   ├── CartContext.tsx
│   └── ConfigContext.tsx
├── data/
│   ├── collections.ts         # Dados tipados (ou fetch de API)
│   └── products.ts
├── types/
│   ├── product.ts
│   ├── cart.ts
│   └── api.ts
├── utils/
│   ├── formatters.ts
│   └── validators.ts
└── styles/
    └── globals.css` },

  { type: 'heading', text: '3. PILAR 2: FUNCIONALIDADES CORE DE E-COMMERCE' },
  { type: 'subheading', text: '3.1 Carrinho de Compras Completo' },
  { type: 'list', items: [
    'Context API + localStorage para persistência',
    'Operações: add, remove, updateQuantity, clear',
    'Badge no ícone da navbar com contagem',
    'Drawer lateral (slide-over) ou página /carrinho',
    'Cálculo de subtotal, frete, total',
    'Validação de estoque (mock ou API)'
  ]},
  { type: 'subheading', text: '3.2 Checkout via WhatsApp Aprimorado' },
  { type: 'list', items: [
    'Mensagem formatada com lista de itens, quantidades, total',
    'Configuração de número via variável de ambiente (VITE_WHATSAPP_NUMBER)',
    'Opção de "Finalizar compra no site" (futura integração gateway)',
    'Geração de pedido com ID único para rastreamento'
  ]},
  { type: 'subheading', text: '3.3 Catálogo Inteligente' },
  { type: 'list', items: [
    'Busca em tempo real (debounced) por nome, marca, categoria',
    'Filtros: gênero, faixa de preço, marca, tamanho, cor',
    'Ordenação: preço (menor/maior), novidades, mais vendidos',
    'Paginação (12 por página) ou Infinite Scroll com IntersectionObserver',
    'Estados vazios: "Nenhum produto encontrado", "Erro ao carregar"'
  ]},
  { type: 'subheading', text: '3.4 Páginas de Produto (PDP)' },
  { type: 'list', items: [
    'Rota dinâmica /produto/:id com React Router',
    'Galeria de imagens (thumbnails + zoom)',
    'Seletor de tamanho/cor com estoque por variante',
    'Descrição rica, especificações, tabela de medidas',
    'Produtos relacionados (cross-sell)',
    'Botão "Compartilhar" (Web Share API + fallback)'
  ]},
  { type: 'subheading', text: '3.5 Autenticação e Perfil (Fase 2)' },
  { type: 'list', items: [
    'Login social (Google, Facebook) + email/senha',
    'Histórico de pedidos',
    'Endereços salvos',
    'Wishlist / Favoritos sincronizados'
  ]},

  { type: 'heading', text: '4. PILAR 3: PERFORMANCE, SEO E CORE WEB VITALS' },
  { type: 'subheading', text: '4.1 Otimizações de Build' },
  { type: 'list', items: [
    'Code-splitting por rota: lazy(() => import("./pages/ProductCatalog"))',
    'Tree-shaking: remover lucide-react icons não usados (importar individualmente)',
    'Compressão Brotli/Gzip no servidor',
    'Bundle analyzer: npm run build -- --analyze'
  ]},
  { type: 'subheading', text: '4.2 Imagens e Assets' },
  { type: 'list', items: [
    'Migração para <Image> do React (ou componente customizado com srcset)',
    'Geração automática de WebP/AVIF em múltiplas larguras (sharp/Vite plugin)',
    'Lazy loading nativo (loading="lazy") + placeholder blur (LQIP)',
    'Preload apenas hero images; demais lazy',
    'CDN para assets estáticos (Cloudflare R2, AWS S3 + CloudFront)'
  ]},
  { type: 'subheading', text: '4.3 SEO Técnico' },
  { type: 'list', items: [
    'Meta tags dinâmicas por rota (react-helmet-async)',
    'Open Graph + Twitter Cards para compartilhamento',
    'JSON-LD Product / Breadcrumb / Organization schema',
    'Sitemap.xml gerado no build (vite-plugin-sitemap)',
    'robots.txt',
    'Canonical URLs',
    'Migração futura para Next.js/Remix para SSR/SSG real'
  ]},
  { type: 'subheading', text: '4.4 Core Web Vitals Targets' },
  { type: 'table', headers: ['Métrica', 'Atual (estimado)', 'Meta', 'Ações'], colWidths: [100, 100, 80, 265], rows: [
    ['LCP', '~3.5s', '< 2.5s', 'Preload hero, otimizar fontes, CDN'],
    ['INP', '~200ms', '< 200ms', 'Code-splitting, reduzir main thread'],
    ['CLS', '~0.15', '< 0.1', 'Reservar espaço para imagens, fonts'],
    ['FCP', '~1.8s', '< 1.8s', 'Critical CSS inline, font-display: swap'],
    ['TTFB', '~600ms', '< 600ms', 'Edge caching, otimizar servidor']
  ]},

  { type: 'heading', text: '5. PILAR 4: QUALIDADE, TESTES E DEVOPS' },
  { type: 'subheading', text: '5.1 Testes' },
  { type: 'list', items: [
    'Unitários: Vitest + React Testing Library (hooks, utils, components)',
    'Integração: fluxo carrinho → checkout WhatsApp',
    'E2E: Playwright (cenários: navegação, busca, adicionar ao carrinho, mobile)',
    'Visual Regression: Chromatic ou Playwright screenshot testing',
    'Coverage target: >80% em lógica de negócio (hooks, context, utils)'
  ]},
  { type: 'subheading', text: '5.2 Linting, Formatação e Git Hooks' },
  { type: 'list', items: [
    'ESLint + Prettier configurados (airbnb-typescript ou similar)',
    'Husky + lint-staged: pre-commit (lint + format + typecheck)',
    'Commitlint: conventional commits',
    'GitHub Actions CI: lint → typecheck → test → build'
  ]},
  { type: 'subheading', text: '5.3 CI/CD Pipeline (GitHub Actions)' },
  { type: 'code', text: `# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:coverage
      - run: npm run build
  deploy-preview:
    needs: quality
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: netlify/actions/cli@master
        with: { args: "deploy --dir=dist --alias=pr-${'$'}{{ github.event.number }}" }
  deploy-prod:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: netlify/actions/cli@master
        with: { args: "deploy --dir=dist --prod" }` },

  { type: 'heading', text: '6. PILAR 5: ACESSIBILIDADE (WCAG 2.1 AA)' },
  { type: 'list', items: [
    'Focus trap no Modal (useFocusTrap hook)',
    'Skip link "Pular para conteúdo principal"',
    'ARIA labels em todos os botões icon-only',
    'Contraste mínimo 4.5:1 (auditar textos sobre gradients)',
    'Redução de movimento: prefers-reduced-motion',
    'Navegação por teclado completa (Tab, Enter, Esc)',
    'Live regions para atualizações de carrinho (aria-live="polite")',
    'Alt texts descritivos para todas as imagens de produto'
  ]},

  { type: 'heading', text: '7. ROADMAP DE IMPLEMENTAÇÃO' },
  { type: 'table', headers: ['Fase', 'Entregáveis', 'Esforço', 'Prioridade'], colWidths: [80, 220, 80, 165], rows: [
    ['1 - Foundation', 'TypeScript, ESLint/Prettier/Husky, CI, refatorar estrutura pastas, extrair componentes', '2-3 semanas', 'CRÍTICA'],
    ['2 - Core Commerce', 'Carrinho (Context + localStorage), Checkout WhatsApp melhorado, PDP (/produto/:id)', '3-4 semanas', 'ALTA'],
    ['3 - Catalog', 'Busca, filtros, paginação/infinite scroll, estados vazios, loading skeletons', '2-3 semanas', 'ALTA'],
    ['4 - Performance/SEO', 'Image optimization, code-splitting, meta tags dinâmicas, JSON-LD, sitemap, CWV audit', '2 semanas', 'MÉDIA'],
    ['5 - A11y/Polish', 'Auditoria WCAG, focus trap, skip links, reduced motion, testes E2E, visual regression', '1-2 semanas', 'MÉDIA'],
    ['6 - Scale (Opcional)', 'Backend API (Node/Next.js), Auth, Pagamentos (MercadoPago/Stripe), Admin CMS, PWA', '6+ semanas', 'BAIXA']
  ]},

  { type: 'heading', text: '8. ESTIMATIVA DE IMPACTO PÓS-MELHORIAS' },
  { type: 'table', headers: ['Indicador', 'Atual', 'Projetado', 'Ganho'], colWidths: [120, 100, 100, 225], rows: [
    ['Lighthouse Performance', '~45', '>90', '+100%'],
    ['Lighthouse Accessibility', '~75', '>95', '+27%'],
    ['Lighthouse SEO', '~60', '>95', '+58%'],
    ['Bundle JS (gzipped)', '79 KB', '<50 KB', '-37%'],
    ['Time to Interactive', '~4.2s', '<2.5s', '-40%'],
    ['Taxa conversão (est.)', 'Baixa', 'Média/Alta', 'WhatsApp otimizado + UX'],
    ['Manutenibilidade', 'Baixa', 'Alta', 'TypeScript + testes + arquitetura'],
    ['Escalabilidade', 'Zero', 'Alta', 'Separação dados/UI + API ready']
  ]},

  { type: 'heading', text: '9. CONFIGURAÇÕES DE AMBIENTE PROPOSTAS' },
  { type: 'code', text: `# .env.example
VITE_WHATSAPP_NUMBER=5521976807111
VITE_API_URL=https://api.fabulosamodas.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_APP_NAME="Fabulosa Modas"
VITE_DEFAULT_CURRENCY=BRL` },

  { type: 'heading', text: '10. CONSIDERAÇÕES FINAIS' },
  { type: 'text', text: 'O projeto atual demonstra excelente base visual e UX, com stack moderna e código limpo para um MVP. As melhorias propostas transformam a landing page em um e-commerce profissional, escalável e pronto para crescimento. A migração para TypeScript e a introdução de testes/CI são fundamentos inegociáveis para qualidade a longo prazo. A arquitetura baseada em Context API + hooks customizados evita over-engineering inicial (Redux/Zustand) mas permite migração futura. O roadmap em 6 fases permite entregas incrementais de valor, com a Fase 1-3 já entregando um e-commerce funcional completo.' }
];

async function main() {
  console.log('Gerando PDF: Análise Atual...');
  await createPDF(
    'ANÁLISE TÉCNICA DO PROJETO ATUAL\nFabulosa Modas - E-commerce Landing Page',
    currentAnalysis,
    'analise-projeto-atual.pdf'
  );
  console.log('✓ analise-projeto-atual.pdf gerado');

  console.log('Gerando PDF: Proposta de Melhorias...');
  await createPDF(
    'PROPOSTA DE MELHORIAS E ROADMAP\nFabulosa Modas - Evolução para E-commerce Completo',
    improvements,
    'proposta-melhorias.pdf'
  );
  console.log('✓ proposta-melhorias.pdf gerado');

  console.log('\n✅ Ambos os PDFs salvos em:', outputDir);
}

main().catch(console.error);