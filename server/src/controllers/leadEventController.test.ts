import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LeadEventController } from '../controllers/leadEventController';
import { LeadEventService } from '../services';

const mockLeadEventService = {
  trackEvent: vi.fn(),
  getEvents: vi.fn(),
  getAnalytics: vi.fn(),
};

const validCuid = 'cuid1234567890123456789012';

describe('LeadEventController', () => {
  let leadEventController: LeadEventController;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockLeadEventService: LeadEventService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLeadEventService = new LeadEventService({} as any);
    leadEventController = new LeadEventController(mockLeadEventService);
    mockReply = { send: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
  });

  describe('trackEvent', () => {
    it('should track event and return 201', async () => {
      const input = {
        productId: 'cuid1234567890123456789012',
        productName: 'Product 1',
        productPrice: 100,
        eventType: 'PRODUCT_VIEW' as const,
        sessionId: 'session-1',
      };

      mockLeadEventService.trackEvent.mockResolvedValue({ id: 'evt-1', ...input });
      mockRequest = { body: input } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await leadEventController.trackEvent(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockLeadEventService.trackEvent).toHaveBeenCalledWith(input);
      expect(mockReply.status).toHaveBeenCalledWith(201);
    });

    it('should accept all event types', async () => {
      const eventTypes = ['PRODUCT_VIEW', 'BUY_CLICK', 'WHATSAPP_REDIRECT'] as const;

      for (const eventType of eventTypes) {
        mockLeadEventService.trackEvent.mockResolvedValue({ id: 'evt-1' });

        await expect(
          leadEventController.trackEvent(
            mockRequest as FastifyRequest,
            mockReply as FastifyReply
          )
        ).resolves.toBeDefined();
      }
    });
  });

  describe('getEvents', () => {
    it('should return paginated events', async () => {
      const mockEvents = [
        { id: 'evt-1', eventType: 'PRODUCT_VIEW', productId: 'cuid1234567890123456789012', createdAt: new Date() },
      ];

      mockLeadEventService.getEvents.mockResolvedValue({
        data: [{ id: 'evt-1', eventType: 'PRODUCT_VIEW' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });

      mockRequest = { query: { page: '1', limit: '10' } } as any;

      await leadEventController.getEvents(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockLeadEventService.getEvents).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        productId: undefined,
        eventType: undefined,
        startDate: undefined,
        endDate: undefined,
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
        topProducts: [],
      };

      mockLeadEventService.getAnalytics.mockResolvedValue({
        totalViews: 100,
        totalBuyClicks: 20,
        totalWhatsAppRedirects: 5,
        conversionRate: 5.0,
        topProducts: [],
      });

      mockRequest = { query: { startDate: '2024-01-01', endDate: '2024-12-31' } } as any;

      await leadEventController.getAnalytics(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockLeadEventService.getAnalytics).toHaveBeenCalledWith(
        new Date('2024-01-01'),
        new Date('2024-12-31')
      );
    });
  });
});