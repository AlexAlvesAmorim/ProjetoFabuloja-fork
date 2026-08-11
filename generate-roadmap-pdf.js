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

const roadmap = [
  { type: 'heading', text: 'FABULOJA — ROADMAP DE EVOLUÇÃO FULL-STACK' },
  { type: 'subheading', text: 'Catálogo Full-Stack + Geração de Leads via WhatsApp' },
  { type: 'text', text: 'Versão estratégica • 2026' },

  { type: 'heading', text: '1. VISÃO DO PRODUTO' },
  { type: 'text', text: 'O FabuLoja não precisa se transformar em um e-commerce tradicional. O produto atual já possui uma proposta clara: catálogo digital, apresentação do produto e geração de intenção de compra direcionada ao WhatsApp. A evolução mantém esse fluxo e adiciona backend, persistência, administração e analytics.' },
  { type: 'text', text: 'Objetivo: Transformar o FabuLoja em uma plataforma full-stack de catálogo digital e geração de leads via WhatsApp, usando o próprio produto como laboratório para aprofundamento em backend, banco de dados, segurança, testes, Docker e deploy.' },

  { type: 'heading', text: '2. FLUXO-ALVO' },
  { type: 'text', text: 'Cliente → Catálogo → Produto → "Quero comprar" → API registra a intenção → geração da mensagem → WhatsApp' },

  { type: 'heading', text: '3. FASE 0 — BASE ATUAL' },
  { type: 'subheading', text: 'Objetivo: Preservar e estabilizar o produto existente' },
  { type: 'list', items: [
    'Catálogo de produtos',
    'Categorias',
    'Detalhes do produto',
    'Responsividade',
    'Integração com WhatsApp',
    'Deploy atual'
  ]},
  { type: 'text', text: 'Marco da fase: o fluxo descoberta → produto → WhatsApp continua funcionando.' },

  { type: 'heading', text: '4. FASE 1 — FOUNDATION FRONT-END' },
  { type: 'subheading', text: 'Objetivo: Preparar o código para crescer' },
  { type: 'list', items: [
    'Migrar componentes críticos para TypeScript',
    'Organizar tipos de Product, Category e Store',
    'Separar componentes e responsabilidades',
    'Padronizar ESLint + Prettier',
    'Revisar IDs/keys e dados duplicados',
    'Adicionar testes básicos de componentes'
  ]},
  { type: 'text', text: 'Marco da fase: Front-End tipado, organizado e preparado para consumir uma API real.' },

  { type: 'heading', text: '5. FASE 2 — BACKEND FOUNDATION' },
  { type: 'subheading', text: 'Objetivo: Construir a primeira API própria' },
  { type: 'list', items: [
    'Node.js + TypeScript',
    'Fastify',
    'REST API',
    'Zod para validação',
    'Controller → Service → Data Access',
    'Tratamento centralizado de erros',
    'Variáveis de ambiente',
    'Status codes e contratos HTTP'
  ]},
  { type: 'text', text: 'Marco da fase: React deixa de depender de catálogo hardcoded e passa a consumir a API.' },

  { type: 'heading', text: '6. FASE 3 — POSTGRESQL + MODELAGEM' },
  { type: 'subheading', text: 'Objetivo: Aprender persistência e modelagem relacional' },
  { type: 'list', items: [
    'PostgreSQL',
    'Prisma',
    'Migrations',
    'Relacionamentos',
    'Foreign keys e constraints',
    'Índices',
    'Paginação',
    'Consultas SQL fundamentais'
  ]},
  { type: 'text', text: 'Marco da fase: Store → Categories → Products + Store Settings.' },

  { type: 'heading', text: '7. FASE 4 — AUTENTICAÇÃO E AUTORIZAÇÃO' },
  { type: 'subheading', text: 'Objetivo: Criar uma área administrativa segura' },
  { type: 'list', items: [
    'Cadastro/login administrativo',
    'Password hashing',
    'Sessão/token',
    'Cookies HTTP-only',
    'Proteção de rotas',
    'ADMIN / CUSTOMER',
    'RBAC',
    'Respostas 401 e 403'
  ]},
  { type: 'text', text: 'Marco da fase: somente usuários autorizados conseguem administrar o catálogo.' },

  { type: 'heading', text: '8. FASE 5 — PAINEL ADMINISTRATIVO' },
  { type: 'subheading', text: 'Objetivo: Transformar o FabuLoja em uma plataforma gerenciável' },
  { type: 'list', items: [
    'Dashboard',
    'CRUD de produtos',
    'CRUD de categorias',
    'Ativar/desativar produtos',
    'Preço e descrição',
    'Gestão de imagens',
    'Configuração do WhatsApp',
    'Configurações da loja'
  ]},
  { type: 'text', text: 'Marco da fase: o catálogo deixa de depender de alterações manuais no código.' },

  { type: 'heading', text: '9. FASE 6 — WHATSAPP + LEADS' },
  { type: 'subheading', text: 'Objetivo: Transformar o clique de compra em evento de negócio' },
  { type: 'list', items: [
    'Registrar product_view',
    'Registrar buy_click',
    'Registrar whatsapp_redirect',
    'Associar evento ao produto',
    'Timestamp e contexto da sessão',
    'Gerar mensagem dinâmica com nome, preço e URL',
    'Manter o WhatsApp como destino final'
  ]},
  { type: 'text', text: 'Marco da fase: Product View → Buy Click → Lead → WhatsApp Redirect.' },

  { type: 'heading', text: '10. FASE 7 — ANALYTICS' },
  { type: 'subheading', text: 'Objetivo: Medir intenção de compra e desempenho do catálogo' },
  { type: 'list', items: [
    'Visualizações por produto',
    'Cliques em "Quero comprar"',
    'Leads gerados',
    'Produtos mais acessados',
    'Produtos com maior intenção',
    'Conversão de visualização → clique',
    'Filtros por período'
  ]},
  { type: 'text', text: 'Marco da fase: o FabuLoja passa a responder quais produtos geram mais interesse comercial.' },

  { type: 'heading', text: '11. FASE 8 — QUALIDADE E SEGURANÇA' },
  { type: 'subheading', text: 'Objetivo: Sair do "funciona" para engenharia de aplicação' },
  { type: 'list', items: [
    'Validação de payloads',
    'Tratamento de erros',
    'CORS',
    'Rate limiting',
    'Headers de segurança',
    'Secrets e environment variables',
    'Logs',
    'Revisão de dependências',
    'Regras de autorização'
  ]},
  { type: 'text', text: 'Marco da fase: API preparada para uso real e manutenção.' },

  { type: 'heading', text: '12. FASE 9 — TESTES' },
  { type: 'subheading', text: 'Objetivo: Garantir comportamento do sistema' },
  { type: 'list', items: [
    'Unit tests para regras de negócio',
    'Integration tests API + banco',
    'Testes de autenticação',
    'Testes de autorização',
    'Testes de produtos/categorias',
    'Teste do fluxo de lead',
    'E2E do fluxo principal'
  ]},
  { type: 'text', text: 'Marco da fase: login → admin → criar produto → loja → clique → lead → WhatsApp.' },

  { type: 'heading', text: '13. FASE 10 — DOCKER + CI/CD' },
  { type: 'subheading', text: 'Objetivo: Profissionalizar o ciclo de entrega' },
  { type: 'list', items: [
    'Dockerfile da API',
    'Docker Compose',
    'PostgreSQL em container',
    'CI no GitHub Actions',
    'Lint',
    'Typecheck',
    'Testes',
    'Build',
    'Deploy automatizado'
  ]},
  { type: 'text', text: 'Marco da fase: Push/PR → Lint → Typecheck → Tests → Build → Deploy.' },

  { type: 'heading', text: '14. FASE 11 — PRODUÇÃO + OBSERVABILIDADE' },
  { type: 'subheading', text: 'Objetivo: Colocar o sistema completo em produção' },
  { type: 'list', items: [
    'Frontend publicado',
    'API publicada',
    'PostgreSQL em produção',
    'HTTPS',
    'Environment variables',
    'Logs de produção',
    'Monitoramento básico',
    'Backup/restore do banco',
    'Documentação da API'
  ]},
  { type: 'text', text: 'Marco da fase: FabuLoja operando como aplicação full-stack real.' },

  { type: 'heading', text: '15. ARQUITETURA ALVO' },
  { type: 'text', text: 'A arquitetura deve continuar simples o suficiente para ser compreendida e mantida. O objetivo é aprender separação de responsabilidades, não criar microservices.' },
  { type: 'code', text: `STORE FRONTEND / ADMIN PANEL
↓
REST API
↓
Controller → Service → Data Access
↓
PostgreSQL` },

  { type: 'heading', text: '16. STACK RECOMENDADA' },
  { type: 'list', items: [
    'Frontend: React + TypeScript + Vite + Tailwind',
    'Backend: Node.js + TypeScript + Fastify',
    'Validation: Zod',
    'Database: PostgreSQL',
    'ORM: Prisma',
    'Testing: Vitest + React Testing Library + Playwright',
    'Infra: Docker + GitHub Actions'
  ]},

  { type: 'heading', text: '17. FORA DO ESCOPO INICIAL' },
  { type: 'text', text: 'Para evitar over-engineering e manter o projeto alinhado ao modelo real do FabuLoja, não são requisitos iniciais:' },
  { type: 'list', items: [
    'Checkout tradicional',
    'Gateway de pagamento',
    'Frete',
    'Wishlist',
    'Login social',
    'Microservices',
    'Kubernetes',
    'Filas complexas'
  ]},
  { type: 'text', text: 'Esses recursos só entram se houver necessidade de produto ou como estudo posterior.' },

  { type: 'heading', text: '18. RESULTADO PROFISSIONAL ESPERADO' },
  { type: 'text', text: 'Ao concluir o roadmap, o FabuLoja deverá demonstrar não apenas competência de Front-End, mas capacidade de construir uma aplicação web completa: API REST, banco relacional, autenticação, autorização, regras de negócio, analytics, testes, segurança, containerização, CI/CD e deploy.' },

  { type: 'heading', text: '19. CRITÉRIO DE CONSOLIDAÇÃO' },
  { type: 'text', text: 'O objetivo não é apenas terminar funcionalidades. A consolidação acontece quando você consegue explicar e defender as decisões técnicas: arquitetura, modelagem do banco, proteção de rotas, tratamento de erros, testes, consistência dos dados e deploy.' },
  { type: 'text', text: 'FabuLoja → de catálogo Front-End para produto Full-Stack real.' }
];

async function main() {
  console.log('Gerando PDF: Roadmap FabuLoja...');
  await createPDF(
    'ROADMAP DE EVOLUÇÃO FULL-STACK\nFabuLoja — Catálogo Digital + Leads WhatsApp',
    roadmap,
    'roadmap-fabuloja.pdf'
  );
  console.log('✓ roadmap-fabuloja.pdf gerado');
  console.log('\n✅ PDF salvo em:', outputDir);
}

main().catch(console.error);