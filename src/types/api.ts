export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  details: string | null;
  size: string | null;
  color: string | null;
  categoryId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LeadEvent {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  eventType: 'PRODUCT_VIEW' | 'BUY_CLICK' | 'WHATSAPP_REDIRECT';
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  createdAt: string;
}

export interface AnalyticsData {
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
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
}
