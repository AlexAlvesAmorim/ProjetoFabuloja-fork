import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from '../services';
import { CategoryRepository } from '../repositories';
import { AppError } from '../middleware/errorHandler';

const validCuid = 'cuid1234567890123456789012';
const validCategoryCuid = 'cuid1234567890123456789012';

describe('ProductService', () => {
  let productService: ProductService;
  let mockProductRepository: any;
  let mockCategoryRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProductRepository = {
      findMany: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    };
    mockCategoryRepository = {
      findById: vi.fn(),
      findByName: vi.fn(),
    };

    productService = new ProductService(
      mockProductRepository as any,
      mockCategoryRepository as any
    );
  });

  describe('getProducts', () => {
    it('should return paginated products with meta', async () => {
      const mockProducts = [
        {
          id: 'cuid1234567890123456789012',
          name: 'Product 1',
          price: 100,
          categoryId: 'cuid1234567890123456789012',
        },
        {
          id: 'cuid1234567890123456789013',
          name: 'Product 2',
          price: 200,
          categoryId: 'cuid1234567890123456789012',
        },
      ];

      mockProductRepository.findMany.mockResolvedValue({ products: mockProducts, total: 2 });

      const result = await productService.getProducts({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const mockProduct = {
        id: 'cuid1234567890123456789012',
        name: 'Product 1',
        price: 100,
        categoryId: 'cuid1234567890123456789012',
        image: '/test.jpg',
        details: 'Test',
        active: true,
      };

      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await productService.getProductById('cuid1234567890123456789012');
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFound when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);
      await expect(productService.getProductById('invalid')).rejects.toThrow(AppError);
    });
  });

  describe('createProduct', () => {
    it('should create product with valid category', async () => {
      const input = {
        name: 'New Product',
        price: 100,
        image: '/img.jpg',
        details: 'Details',
        categoryId: 'cuid1234567890123456789012',
        active: true,
      };

      mockCategoryRepository.findById.mockResolvedValue({ id: 'cuid1234567890123456789012' });
      mockProductRepository.create.mockResolvedValue({
        id: 'cuid1234567890123456789014',
        ...input,
        categoryId: 'cuid1234567890123456789012',
      });

      const productService = new ProductService(
        {
          create: vi.fn().mockResolvedValue({ id: 'cuid1234567890123456789014', ...input }),
        } as any,
        { findById: vi.fn().mockResolvedValue({ id: 'cuid1234567890123456789012' }) } as any
      );

      const result = await productService.createProduct(input);
      expect(result).toHaveProperty('id');
    });

    it('should throw BadRequest when category not found', async () => {
      const productService = new ProductService(
        { create: vi.fn() } as any,
        { findById: vi.fn().mockResolvedValue(null) } as any
      );

      await expect(
        productService.createProduct({
          name: 'Test',
          price: 100,
          image: '/img.jpg',
          category: { connect: { id: 'invalid' } },
        })
      ).rejects.toThrow('Categoria não encontrada');
    });
  });

  describe('updateProduct', () => {
    it('should update product with valid category', async () => {
      const productService = new ProductService(
        { exists: vi.fn().mockResolvedValue(true), update: vi.fn().mockResolvedValue({}) } as any,
        { findById: vi.fn().mockResolvedValue({ id: 'cat-1' }) } as any
      );

      const result = await productService.updateProduct('cuid1234567890123456789012', {
        name: 'Updated',
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFound when product does not exist', async () => {
      const productService = new ProductService(
        { exists: vi.fn().mockResolvedValue(false) } as any,
        {} as any
      );

      await expect(productService.updateProduct('invalid', {})).rejects.toThrow(AppError);
    });

    it('should throw BadRequest when category not found', async () => {
      const productService = new ProductService(
        { exists: vi.fn().mockResolvedValue(true), update: vi.fn() } as any,
        { findById: vi.fn().mockResolvedValue(null) } as any
      );

      await expect(
        productService.updateProduct('cuid1234567890123456789012', {
          category: { connect: { id: 'invalid' } },
        })
      ).rejects.toThrow('Categoria não encontrada');
    });
  });

  describe('deleteProduct', () => {
    it('should delete existing product', async () => {
      const productService = new ProductService(
        { exists: vi.fn().mockResolvedValue(true), delete: vi.fn().mockResolvedValue({}) } as any,
        {} as any
      );

      await productService.deleteProduct('cuid1234567890123456789012');
    });

    it('should throw NotFound when product does not exist', async () => {
      const productService = new ProductService(
        { exists: vi.fn().mockResolvedValue(false) } as any,
        {} as any
      );

      await expect(productService.deleteProduct('invalid')).rejects.toThrow(AppError);
    });
  });
});
