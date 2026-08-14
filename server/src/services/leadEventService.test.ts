import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeadEventService } from '../services';
import { LeadEventRepository } from '../repositories';
import { AppError } from '../middleware/errorHandler';

const mockLeadEventRepository = {
  create: vi.fn(),
  findMany: vi.fn(),
  getAnalytics: vi.fn(),
};

describe('LeadEventService', () => {
  let leadEventService: LeadEventService;

  beforeEach(() => {
    vi.clearAllMocks();
    leadEventService = new LeadEventService(mockLeadEventRepository as any);
  });

  describe('trackEvent', () => {
    it('should create lead event', async () => {
      const input = {
        productId: 'prod-1',
        productName: 'Product 1',
        productPrice: 100,
        eventType: 'PRODUCT_VIEW' as const,
        sessionId: 'session-1',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        referrer: 'https://google.com',
      };

      const createdEvent = { id: 'evt-1', ...input, createdAt: new Date() };
      mockLeadEventRepository.create.mockResolvedValue(createdEvent);

      const result = await leadEventService.trackEvent(input);

      expect(result).toEqual(createdEvent);
      expect(mockLeadEventRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 'prod-1',
          eventType: 'PRODUCT_VIEW',
          productPrice: 100,
        })
      );
    });

    it('should accept all event types', async () => {
      const eventTypes = ['PRODUCT_VIEW', 'BUY_CLICK', 'WHATSAPP_REDIRECT'] as const;

      for (const eventType of eventTypes) {
        mockLeadEventRepository.create.mockResolvedValue({ id: 'evt-1' });

        await expect(
          leadEventService.trackEvent({
            productId: 'prod-1',
            productName: 'Product',
            productPrice: 100,
            eventType,
            sessionId: 'session-1',
          })
        ).resolves.toBeDefined();
      }
    });
  });

  describe('getEvents', () => {
    it('should return paginated events with filters', async () => {
      const mockEvents = [
        { id: '1', eventType: 'PRODUCT_VIEW', productId: 'prod-1', createdAt: new Date() },
        { id: '2', eventType: 'BUY_CLICK', productId: 'prod-2', createdAt: new Date() },
      ];

      mockLeadEventRepository.findMany.mockResolvedValue({
        events: mockEvents,
        total: 2,
      });

      const result = await leadEventService.getEvents({
        productId: 'prod-1',
        eventType: 'PRODUCT_VIEW',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual(mockEvents);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics data', async () => {
      const mockAnalytics = {
        totalViews: 100,
        totalBuyClicks: 20,
        totalWhatsAppRedirects: 5,
        conversionRate: 5.0,
        topProducts: [
          {
            productId: 'prod-1',
            productName: 'Product 1',
            views: 50,
            buyClicks: 10,
            whatsappRedirects: 3,
            conversionRate: 6.0,
          },
        ],
      };

      mockLeadEventRepository.getAnalytics.mockResolvedValue(mockAnalytics);

      const result = await leadEventService.getAnalytics(
        new Date('2024-01-01'),
        new Date('2024-12-31')
      );

      expect(result).toEqual(mockAnalytics);
      expect(mockLeadEventRepository.getAnalytics).toHaveBeenCalledWith({
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      });
    });

    it('should work without date filters', async () => {
      mockLeadEventRepository.getAnalytics.mockResolvedValue({
        totalViews: 0,
        totalBuyClicks: 0,
        totalWhatsAppRedirects: 0,
        conversionRate: 0,
        topProducts: [],
      });

      const result = await leadEventService.getAnalytics();
      expect(result).toBeDefined();
    });
  });
});