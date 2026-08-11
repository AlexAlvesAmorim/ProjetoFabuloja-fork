import { ProductRepository, CategoryRepository, LeadEventRepository } from '../repositories';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async getProducts(params: {
    categoryId?: string;
    active?: boolean;
    search?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) {
    const { products, total } = await this.productRepository.findMany(params);

    return {
      data: products,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw AppError.notFound('Produto não encontrado');
    }
    return product;
  }

  async createProduct(data: Prisma.ProductCreateInput) {
    const categoryId = (data.category as Prisma.CategoryCreateNestedOneWithoutProductsInput)
      ?.connect?.id;
    if (categoryId) {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) {
        throw AppError.badRequest('Categoria não encontrada');
      }
    }

    return this.productRepository.create(data);
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    const exists = await this.productRepository.exists(id);
    if (!exists) {
      throw AppError.notFound('Produto não encontrado');
    }

    if (data.category) {
      const categoryId = (data.category as { connect?: { id: string } })?.connect?.id;
      if (categoryId) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
          throw AppError.badRequest('Categoria não encontrada');
        }
      }
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const exists = await this.productRepository.exists(id);
    if (!exists) {
      throw AppError.notFound('Produto não encontrado');
    }

    return this.productRepository.delete(id);
  }
}

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getCategories() {
    return this.categoryRepository.findMany();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw AppError.notFound('Categoria não encontrada');
    }
    return category;
  }

  async createCategory(data: { name: string; label: string; storeId: string }) {
    const existing = await this.categoryRepository.findByName(data.name);
    if (existing) {
      throw AppError.conflict('Categoria com este nome já existe');
    }

    return this.categoryRepository.create({
      ...data,
      store: { connect: { id: data.storeId } },
    });
  }

  async updateCategory(id: string, data: { name?: string; label?: string }) {
    if (data.name) {
      const existing = await this.categoryRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict('Categoria com este nome já existe');
      }
    }

    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw AppError.notFound('Categoria não encontrada');
    }

    const categoryWithProducts = await this.categoryRepository.findById(id);
    if (
      categoryWithProducts &&
      'products' in categoryWithProducts &&
      Array.isArray(categoryWithProducts.products) &&
      categoryWithProducts.products.length > 0
    ) {
      throw AppError.badRequest('Não é possível excluir categoria com produtos associados');
    }

    return this.categoryRepository.delete(id);
  }
}

export class LeadEventService {
  constructor(private leadEventRepository: LeadEventRepository) {}

  async trackEvent(data: {
    productId: string;
    productName: string;
    productPrice: number;
    eventType: 'PRODUCT_VIEW' | 'BUY_CLICK' | 'WHATSAPP_REDIRECT';
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    return this.leadEventRepository.create({
      ...data,
      productPrice: data.productPrice,
    });
  }

  async getEvents(params: {
    productId?: string;
    eventType?: 'PRODUCT_VIEW' | 'BUY_CLICK' | 'WHATSAPP_REDIRECT';
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
  }) {
    const { events, total } = await this.leadEventRepository.findMany(params);

    return {
      data: events,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async getAnalytics(startDate?: Date, endDate?: Date) {
    return this.leadEventRepository.getAnalytics({ startDate, endDate });
  }
}
