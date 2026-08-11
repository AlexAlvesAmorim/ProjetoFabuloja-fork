import { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/productController';
import { CategoryController } from '../controllers/categoryController';
import { LeadEventController } from '../controllers/leadEventController';
import { AuthController } from '../controllers/authController';
import { ProductService } from '../services';
import { CategoryService } from '../services';
import { LeadEventService } from '../services';
import { ProductRepository, CategoryRepository, LeadEventRepository } from '../repositories';
import { authenticate, authorize } from '../middleware/auth';
import { uploadRoutes } from './upload';

export async function registerRoutes(app: FastifyInstance) {
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

  // Public auth routes
  app.post('/api/auth/login', authController.login.bind(authController));

  // Upload routes (public for now, could add auth later)
  await app.register(uploadRoutes);

  // Public API routes
  app.get('/api/products', productController.getProducts.bind(productController));
  app.get('/api/products/:id', productController.getProductById.bind(productController));

  app.post('/api/lead-events', leadEventController.trackEvent.bind(leadEventController));
  app.get('/api/lead-events', leadEventController.getEvents.bind(leadEventController));
  app.get('/api/analytics', leadEventController.getAnalytics.bind(leadEventController));

  // Admin routes (protected)
  const adminRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);
    app.addHook('preHandler', authorize('ADMIN'));

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
