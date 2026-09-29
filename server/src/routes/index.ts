import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ProductController } from '../controllers/productController';
import { CategoryController } from '../controllers/categoryController';
import { LeadEventController } from '../controllers/leadEventController';
import { AuthController } from '../controllers/authController';
import { ProductService } from '../services';
import { CategoryService } from '../services';
import { LeadEventService } from '../services';
import { ProductRepository, CategoryRepository, LeadEventRepository } from '../repositories';
import { authenticate, authorize } from '../middleware/auth';
import { csrfProtection } from '../middleware/csrf';
import { uploadRoutes } from './upload';
import { env } from '../config/index.js';

type FastifyZod = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export async function registerRoutes(app: FastifyZod) {
  const productRepository = new ProductRepository();
  const categoryRepository = new CategoryRepository();
  const leadEventRepository = new LeadEventRepository();

  const productService = new ProductService(productRepository, categoryRepository);
  const categoryService = new CategoryService(categoryRepository);
  const leadEventService = new LeadEventService(leadEventRepository);

  const productController = new ProductController(productService);
  const categoryController = new CategoryController(categoryService);
  const leadEventController = new LeadEventController(leadEventService);
  const authController = new AuthController();

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  }));

  // Anti-CSRF em toda mutação (vale pra rotas públicas e encapsuladas abaixo)
  app.addHook('preHandler', csrfProtection);

  // Public auth routes (login com limite próprio anti brute-force)
  app.post(
    '/api/auth/login',
    {
      config: {
        rateLimit: {
          max: env.rateLimit.loginMax,
          timeWindow: env.rateLimit.loginWindowMs,
          allowList: [],
        },
      },
    },
    authController.login.bind(authController)
  );
  app.post('/api/auth/logout', authController.logout.bind(authController));
  app.get('/api/auth/me', authController.me.bind(authController));

  // Upload routes (protegidas: só ADMIN, hooks dentro do plugin)
  await app.register(uploadRoutes);

  // Public API routes
  app.get('/api/products', productController.getProducts.bind(productController));
  app.get('/api/products/:id', productController.getProductById.bind(productController));

  // Tracking público com throttle anti-spam (uso real da vitrine fica longe do teto)
  app.post(
    '/api/lead-events',
    {
      config: {
        rateLimit: {
          max: env.rateLimit.trackMax,
          timeWindow: env.rateLimit.trackWindowMs,
          allowList: [],
        },
      },
    },
    leadEventController.trackEvent.bind(leadEventController)
  );

  // Admin routes (protected)
  const adminRoutes = async (app: FastifyZod) => {
    app.addHook('preHandler', authenticate);
    app.addHook('preHandler', authorize('ADMIN'));

    app.post('/api/auth/register', authController.register.bind(authController));
    app.get('/api/lead-events', leadEventController.getEvents.bind(leadEventController));
    app.get('/api/analytics', leadEventController.getAnalytics.bind(leadEventController));

    app.post('/api/products', productController.createProduct.bind(productController));
    app.put('/api/products/:id', productController.updateProduct.bind(productController));
    app.delete('/api/products/:id', productController.deleteProduct.bind(productController));

    app.post('/api/categories', categoryController.createCategory.bind(categoryController));
    app.put('/api/categories/:id', categoryController.updateCategory.bind(categoryController));
    app.delete('/api/categories/:id', categoryController.deleteCategory.bind(categoryController));
  };

  // Public category routes
  app.get('/api/categories', categoryController.getCategories.bind(categoryController));
  app.get('/api/categories/:id', categoryController.getCategoryById.bind(categoryController));

  await app.register(adminRoutes, { prefix: '' });
}
