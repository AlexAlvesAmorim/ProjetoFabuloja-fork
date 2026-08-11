export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  details: string;
  category: 'Masculina' | 'Feminina';
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: 'Masculina' | 'Feminina';
  label: 'Masculino' | 'Feminina';
  products: Product[];
}

export interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  email: string;
  phone: string;
  address: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    holidays: string;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface ProductViewEvent {
  productId: number;
  timestamp: string;
  sessionId: string;
  referrer?: string;
}

export interface BuyClickEvent {
  productId: number;
  timestamp: string;
  sessionId: string;
  productName: string;
  productPrice: string;
}

export interface WhatsAppRedirectEvent {
  productId: number;
  timestamp: string;
  sessionId: string;
  message: string;
}

export interface LeadEvent {
  productId: number;
  productName: string;
  productPrice: string;
  timestamp: string;
  sessionId: string;
  eventType: 'view' | 'buy_click' | 'whatsapp_redirect';
}
