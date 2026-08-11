import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Category, Product, PaginatedResponse } from '../types/api';

type TabName = Category['name'];
type TabLabel = Category['label'];

export const useCollections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabName>('Masculina');
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      const data = await api.get<Category[]>('/categories');
      setCollections(data);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
    }
  }, []);

  const fetchProducts = useCallback(async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PaginatedResponse<Product>>(
        `/products?categoryId=${categoryId}&limit=100`
      );
      setProducts(response.data);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    const aba = searchParams.get('aba');
    if (aba === 'feminina') setActiveTab('Feminina');
    else if (aba === 'masculina') setActiveTab('Masculina');
  }, [searchParams]);

  useEffect(() => {
    const activeCollection = collections.find(c => c.name === activeTab);
    if (activeCollection) {
      fetchProducts(activeCollection.id);
    }
  }, [activeTab, collections, fetchProducts]);

  const handleTabChange = useCallback(
    (tab: TabName) => {
      setActiveTab(tab);
      const abaParam = tab === 'Masculina' ? 'masculina' : 'feminina';
      setSearchParams({ aba: abaParam });

      setTimeout(() => {
        document.getElementById('produtos')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    },
    [setSearchParams]
  );

  const getActiveLabel = (): TabLabel => {
    return activeTab === 'Masculina' ? 'Masculino' : 'Feminina';
  };

  return {
    activeTab,
    activeLabel: getActiveLabel(),
    products,
    collections,
    loading,
    error,
    handleTabChange,
    refetch: fetchProducts,
  };
};
