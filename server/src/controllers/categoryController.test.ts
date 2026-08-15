import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoryController } from '../controllers/categoryController';
import { Category } from '../types/api';

const validCuid = 'cuid1234567890123456789012';
const validStoreCuid = 'cuid1234567890123456789013';
const validCategoryCuid = 'cuid1234567890123456789014';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockCategoryService: {
    getCategories: ReturnType<typeof vi.fn>;
    getCategoryById: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCategoryService = {
      getCategories: vi.fn(),
      getCategoryById: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };
    categoryController = new CategoryController(mockCategoryService as any);
    mockReply = { send: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const mockCategories: Category[] = [
        {
          id: validCuid,
          name: 'Masculina',
          label: 'Masculino',
          storeId: validStoreCuid,
          products: [],
        },
        {
          id: validCategoryCuid,
          name: 'Feminina',
          label: 'Feminina',
          storeId: validStoreCuid,
          products: [],
        },
      ];

      mockCategoryService.getCategories.mockResolvedValue(mockCategories);

      await categoryController.getCategories({} as FastifyRequest, mockReply as FastifyReply);

      expect(mockCategoryService.getCategories).toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalledWith(mockCategories);
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id', async () => {
      const mockCategory: Category = {
        id: validCuid,
        name: 'Masculina',
        label: 'Masculino',
        storeId: validStoreCuid,
        products: [],
      };

      mockCategoryService.getCategoryById.mockResolvedValue(mockCategory);

      mockRequest = { params: { id: validCuid } } as any;

      await categoryController.getCategoryById(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockCategoryService.getCategoryById).toHaveBeenCalledWith(validCuid);
      expect(mockReply.send).toHaveBeenCalledWith(mockCategory);
    });
  });

  describe('createCategory', () => {
    it('should create category and return 201', async () => {
      const newCategory = {
        id: validCuid,
        name: 'Nova',
        label: 'Nova Categoria',
        storeId: validStoreCuid,
        products: [],
      };

      mockCategoryService.createCategory.mockResolvedValue({
        id: validCuid,
        name: 'Nova',
        label: 'Nova Categoria',
        storeId: validStoreCuid,
        products: [],
      });

      mockRequest = {
        body: { name: 'Nova', label: 'Nova Categoria', storeId: validStoreCuid },
      } as any;

      await categoryController.createCategory(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith({
        name: 'Nova',
        label: 'Nova Categoria',
        storeId: validStoreCuid,
      });
      expect(mockReply.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateCategory', () => {
    it('should update category', async () => {
      const updatedCategory = {
        id: validCuid,
        name: 'Atualizada',
        label: 'Atualizada',
        storeId: 'cuid1234567890123456789013',
        products: [],
      };

      mockCategoryService.updateCategory.mockResolvedValue({
        id: validCuid,
        name: 'Atualizada',
        label: 'Atualizada',
        storeId: 'cuid1234567890123456789013',
        products: [],
      });

      mockRequest = {
        params: { id: validCuid },
        body: { name: 'Atualizada', label: 'Atualizada' },
      } as any;

      await categoryController.updateCategory(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(validCuid, {
        name: 'Atualizada',
        label: 'Atualizada',
      });
      expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ id: validCuid }));
    });
  });

  describe('deleteCategory', () => {
    it('should delete category and return 204', async () => {
      const category = {
        id: validCuid,
        name: 'Vazia',
        label: 'Vazia',
        storeId: 'cuid1234567890123456789013',
        products: [],
      };

      mockCategoryService.getCategoryById.mockResolvedValue({
        id: validCuid,
        name: 'Vazia',
        label: 'Vazia',
        storeId: 'cuid1234567890123456789013',
        products: [],
      });

      mockCategoryService.deleteCategory.mockResolvedValue(undefined);

      mockRequest = { params: { id: validCuid } } as any;

      await categoryController.deleteCategory(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(validCuid);
      expect(mockReply.status).toHaveBeenCalledWith(204);
    });
  });
});
