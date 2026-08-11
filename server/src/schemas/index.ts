import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  price: z.number().positive('Preço deve ser positivo').multipleOf(0.01),
  image: z.string().url('Imagem deve ser uma URL válida'),
  details: z.string().optional(),
  categoryId: z.string().cuid('ID da categoria inválido'),
  active: z.boolean().default(true),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().cuid('ID do produto inválido'),
});

export const productQuerySchema = z.object({
  categoryId: z.string().cuid().optional(),
  active: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
  storeId: z.string().cuid(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const categoryParamsSchema = z.object({
  id: z.string().cuid(),
});

export const leadEventCreateSchema = z.object({
  productId: z.string().cuid(),
  productName: z.string().min(1).max(200),
  productPrice: z.number().positive().multipleOf(0.01),
  eventType: z.enum(['PRODUCT_VIEW', 'BUY_CLICK', 'WHATSAPP_REDIRECT']),
  sessionId: z.string().min(1),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().url().optional(),
});

export const leadEventQuerySchema = z.object({
  productId: z.string().cuid().optional(),
  eventType: z.enum(['PRODUCT_VIEW', 'BUY_CLICK', 'WHATSAPP_REDIRECT']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const storeSettingsSchema = z.object({
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  businessHours: z.record(z.string()).optional().nullable(),
  socialLinks: z.record(z.string().url()).optional().nullable(),
});

export const authLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const authRegisterSchema = authLoginSchema.extend({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});
