import { useState, useCallback, useEffect } from 'react';
import { Product } from '../types/api';
import { api } from '../lib/api';

interface UseProductModalReturn {
  selectedProduct: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
  trackBuyClick: (product: Product) => void;
  trackWhatsAppRedirect: (product: Product) => void;
}

export const useProductModal = (): UseProductModalReturn => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const trackEvent = useCallback(
    async (product: Product, eventType: 'PRODUCT_VIEW' | 'BUY_CLICK' | 'WHATSAPP_REDIRECT') => {
      try {
        await api.post('/lead-events', {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          eventType,
          sessionId: getSessionId(),
          referrer: document.referrer || window.location.href,
        });
      } catch (err) {
        console.warn('Failed to track event:', err);
      }
    },
    []
  );

  const openModal = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      trackEvent(product, 'PRODUCT_VIEW');
    },
    [trackEvent]
  );

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const trackBuyClick = useCallback(
    (product: Product) => {
      trackEvent(product, 'BUY_CLICK');
    },
    [trackEvent]
  );

  const trackWhatsAppRedirect = useCallback(
    (product: Product) => {
      trackEvent(product, 'WHATSAPP_REDIRECT');
    },
    [trackEvent]
  );

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProduct) {
        closeModal();
      }
    };

    if (selectedProduct) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [selectedProduct, closeModal]);

  return {
    selectedProduct,
    openModal,
    closeModal,
    trackBuyClick,
    trackWhatsAppRedirect,
  };
};
