import { prisma } from '../utils/prisma.js';
import { Product, Category, LeadEvent, Prisma } from '@prisma/client';

export class ProductRepository {
  async findMany(params: {
    categoryId?: string;
    active?: boolean;
    search?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ products: Product[]; total: number }> {
    const { categoryId, active, search, page, limit, sortBy, sortOrder } = params;

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) where.categoryId = categoryId;
    if (active !== undefined) where.active = active;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    return !!product;
  }
}

export class CategoryRepository {
  async findMany(storeId?: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: storeId ? { storeId } : {},
      include: { products: { where: { active: true }, take: 1 } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { name } });
  }
}

export class LeadEventRepository {
  async create(data: Prisma.LeadEventCreateInput): Promise<LeadEvent> {
    return prisma.leadEvent.create({ data });
  }

  async findMany(params: {
    productId?: string;
    eventType?: 'PRODUCT_VIEW' | 'BUY_CLICK' | 'WHATSAPP_REDIRECT';
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
  }): Promise<{ events: LeadEvent[]; total: number }> {
    const { productId, eventType, startDate, endDate, page, limit } = params;

    const where: Prisma.LeadEventWhereInput = {};

    if (productId) where.productId = productId;
    if (eventType) where.eventType = eventType;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [events, total] = await Promise.all([
      prisma.leadEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.leadEvent.count({ where }),
    ]);

    return { events, total };
  }

  async getAnalytics(params: { startDate?: Date; endDate?: Date }): Promise<{
    totalViews: number;
    totalBuyClicks: number;
    totalWhatsAppRedirects: number;
    conversionRate: number;
    topProducts: Array<{
      productId: string;
      productName: string;
      views: number;
      buyClicks: number;
      whatsappRedirects: number;
      conversionRate: number;
    }>;
  }> {
    const { startDate, endDate } = params;

    const where: Prisma.LeadEventWhereInput = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [views, buyClicks, whatsappRedirects, topProducts] = await Promise.all([
      prisma.leadEvent.count({ where: { ...where, eventType: 'PRODUCT_VIEW' } }),
      prisma.leadEvent.count({ where: { ...where, eventType: 'BUY_CLICK' } }),
      prisma.leadEvent.count({ where: { ...where, eventType: 'WHATSAPP_REDIRECT' } }),
      prisma.leadEvent.groupBy({
        by: ['productId', 'productName'],
        where: { ...where, eventType: 'PRODUCT_VIEW' },
        _count: { productId: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 10,
      }),
    ]);

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (tp: { productId: string; productName: string }) => {
        const [productViews, productBuyClicks, productWhatsApp] = await Promise.all([
          prisma.leadEvent.count({
            where: { ...where, productId: tp.productId, eventType: 'PRODUCT_VIEW' },
          }),
          prisma.leadEvent.count({
            where: { ...where, productId: tp.productId, eventType: 'BUY_CLICK' },
          }),
          prisma.leadEvent.count({
            where: { ...where, productId: tp.productId, eventType: 'WHATSAPP_REDIRECT' },
          }),
        ]);

        return {
          productId: tp.productId,
          productName: tp.productName,
          views: productViews,
          buyClicks: productBuyClicks,
          whatsappRedirects: productWhatsApp,
          conversionRate: productViews > 0 ? (productWhatsApp / productViews) * 100 : 0,
        };
      })
    );

    return {
      totalViews: views,
      totalBuyClicks: buyClicks,
      totalWhatsAppRedirects: whatsappRedirects,
      conversionRate: views > 0 ? (whatsappRedirects / views) * 100 : 0,
      topProducts: topProductsWithDetails,
    };
  }
}
