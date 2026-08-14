import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryService } from '../services';
import { CategoryRepository } from '../repositories';
import { AppError } from '../middleware/errorHandler';
import { Category } from '../types/api';

const validCuid = 'cuid1234567890123456789012';
const validStoreCuid = 'cuid1234567890123456789013';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let mockCategoryRepository: CategoryRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCategoryRepository = {
      findMany: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByName: vi.fn(),
    };
    categoryService = new CategoryService(mockCategoryRepository as any);
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const mockCategories: Category[] = [
        { id: 'cuid1234567890123456789012', name: 'Masculina', label: 'Masculino', storeId: 'cuid1234567890123456789013', products: [] },
        { id: 'cuid1234567890123456789013', name: 'Feminina', label: 'Feminina', storeId: 'cuid1234567890123456789013', products: [] },
      ];

      mockCategoryRepository.findMany.mockResolvedValue([
        { id: 'cuid1234567890123456789012', name: 'Masculina', label: 'Masculino', storeId: 'cuid1234567890123456789013', products: [] },
        { id: 'cuid1234567890123456789013', name: 'Feminina', label: 'Feminina', storeId: 'cuid1234567890123456789013', products: [] },
      ]);

      const result = await categoryService.getCategories();
      expect(result).toHaveLength(2);
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id', async () => {
      const mockCategory = { 
        id: 'cuid1234567890123456789012', 
        name: 'Masculina', 
        label: 'Masculino', 
        storeId: 'cuid1234567890123456789013',
        products: [] 
      };
      
      mockCategoryRepository.findById.mockResolvedValue({
        id: 'cuid1234567890123456789012',
        name: 'Masculina',
        label: 'Masculino',
        storeId: 'cuid1234567890123456789013',
        products: []
      });

      const result = await categoryService.getCategoryById('cuid1234567890123456789012');
      expect(result.id).toBe('cuid1234567890123456789012');
    });

    it('should throw NotFound when category not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);
      await expect(categoryService.getCategoryById('invalid')).rejects.toThrow('Categoria não encontrada');
    });
  });

  describe('createCategory', () => {
    it('should create category', async () => {
      mockCategoryRepository.findByName.mockResolvedValue(null);
      mockCategoryRepository.create.mockResolvedValue({
        id: 'cuid1234567890123456789014',
        name: 'Nova',
        label: 'Nova Categoria',
        storeId: 'cuid1234567890123456789013'
      });

      const result = await categoryService.createCategory({
        name: 'Nova',
        label: 'Nova Categoria',
        storeId: 'cuid1234567890123456789013'
      });

      expect(result.name).toBe('Nova');
      expect(mockCategoryRepository.create).toHaveBeenCalledWith({
        name: 'Nova',
        label: 'Nova Categoria',
        store: { connect: { id: 'cuid1234567890123456789013' } },
      });
    });

    it('should throw Conflict when category name exists', async () => {
      mockCategoryRepository.findByName.mockResolvedValue({ id: '1', name: 'Existente' });

      await expect(categoryService.createCategory({
        name: 'Existente',
        label: 'Existente',
        storeId: 'cuid1234567890123456789013'
      })).rejects.toThrow('Categoria com este nome já existe');
    });
  });

  describe('updateCategory', () => {
    it('should update category', async () => {
      mockCategoryRepository.findById.mockResolvedValue({ 
        id: 'cuid1234567890123456789012',
        name: 'Antiga',
        label: 'Antiga',
        storeId: 'cuid1234567890123456789013'
      });
      mockCategoryRepository.findByName.mockResolvedValue(null);
      mockCategoryRepository.update.mockResolvedValue({
        id: 'cuid1234567890123456789012',
        name: 'Nova',
        label: 'Nova'
      });

      const result = await categoryService.updateCategory('cuid1234567890123456789012', { 
        name: 'Nova', 
        label: 'Nova' 
      });

      expect(result.name).toBe('Nova');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category without products', async () => {
      mockCategoryRepository.findById.mockResolvedValue({
        id: 'cuid1234567890123456789012',
        name: 'Vazia',
        label: 'Vazia',
        storeId: 'cuid1234567890123456789013',
        products: []
      });
      mockCategoryRepository.delete.mockResolvedValue({});

      await categoryService.deleteCategory('cuid1234567890123456789012');
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith('cuid1234567890123456789012');
    });

    it('should throw BadRequest when category has products', async () => {
      mockCategoryRepository.findById.mockResolvedValue({
        id: 'cuid1234567890123456789012',
        name: 'Com Produtos',
        products: [{ id: 'p1' }]
      });

      await expect(categoryService.deleteCategory('cuid1234567890123456789012')).rejects.toThrow(
        'Não é possível excluir categoria com produtos associados'
      );
    });
  });
});