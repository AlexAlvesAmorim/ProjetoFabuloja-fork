import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../components/ui/ProductCard';
import { Product } from '../../types/api';

const mockProduct: Product = {
  id: 'cuid1234567890123456789012',
  name: 'Camisa Lacoste',
  price: 90.00,
  image: '/manvitrine/lacostetshirt.avif',
  details: 'Disponível em P, M, G, GG. Cores: Preto, Branco, Vermelho, Cinza',
  categoryId: 'cat-1',
  category: { id: 'cat-1', name: 'Masculina', label: 'Masculino', products: [] },
  active: true,
};

describe('ProductCard', () => {
  const mockOpenModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product name, price, and image', () => {
    render(<ProductCard item={mockProduct} openModal={mockOpenModal} />);

    expect(screen.getByText('Camisa Lacoste')).toBeInTheDocument();
    expect(screen.getByText('R$ 90,00')).toBeInTheDocument();
    expect(screen.getByAltText('Camisa Lacoste')).toHaveAttribute('src', '/manvitrine/lacostetshirt.avif');
  });

  it('shows "VER DETALHES" on hover', () => {
    render(<ProductCard item={mockProduct} openModal={mockOpenModal} />);

    const card = screen.getByText('Camisa Lacoste').closest('div');
    fireEvent.mouseEnter(card!);
    expect(screen.getByText('VER DETALHES')).toBeInTheDocument();
  });

  it('calls openModal when clicked', () => {
    render(<ProductCard item={mockProduct} openModal={mockOpenModal} />);

    fireEvent.click(screen.getByText('Camisa Lacoste'));
    expect(mockOpenModal).toHaveBeenCalledWith(mockProduct);
  });

  it('has cart button with ShoppingCart icon', () => {
    render(<ProductCard item={mockProduct} openModal={mockOpenModal} />);

    const cartButton = screen.getByRole('button', { name: /carrinho/i });
    expect(cartButton).toBeInTheDocument();
  });
});