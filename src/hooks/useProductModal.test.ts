import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductModal } from './useProductModal';
import { Product } from '../types/api';

const mockProduct: Product = {
  id: 'cuid1234567890123456789012',
  name: 'Camisa Lacoste',
  price: 90.00,
  image: '/manvitrine/lacostetshirt.avif',
  details: 'Disponível em P, M, G, GG',
  categoryId: 'cat-1',
  category: { id: 'cat-1', name: 'Masculina', label: 'Masculino', products: [] },
  active: true,
};

describe('useProductModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns null selectedProduct initially', () => {
    const { result } = renderHook(() => useProductModal());
    expect(result.current.selectedProduct).toBeNull();
  });

  it('opens modal and sets selectedProduct', () => {
    const { result } = renderHook(() => useProductModal());

    act(() => {
      result.current.openModal(mockProduct);
    });

    expect(result.current.selectedProduct).toEqual(mockProduct);
  });

  it('closes modal and clears selectedProduct', () => {
    const { result } = renderHook(() => useProductModal());

    act(() => {
      result.current.openModal(mockProduct);
    });
    expect(result.current.selectedProduct).toEqual(mockProduct);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.selectedProduct).toBeNull();
  });

  it('tracks buy click event', () => {
    const { result } = renderHook(() => useProductModal());

    act(() => {
      result.current.openModal(mockProduct);
    });

    act(() => {
      result.current.trackBuyClick(mockProduct);
    });

    expect(result.current.selectedProduct).toEqual(mockProduct);
  });

  it('tracks whatsapp redirect event', () => {
    const { result } = renderHook(() => useProductModal());

    act(() => {
      result.current.openModal(mockProduct);
    });

    act(() => {
      result.current.trackWhatsAppRedirect(mockProduct);
    });

    expect(result.current.selectedProduct).toEqual(mockProduct);
  });
});