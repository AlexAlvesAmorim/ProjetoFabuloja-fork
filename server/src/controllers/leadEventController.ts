import { FastifyRequest, FastifyReply } from 'fastify';
import { LeadEventService } from '../services';
import { leadEventCreateSchema, leadEventQuerySchema } from '../schemas';

export class LeadEventController {
  constructor(private leadEventService: LeadEventService) {}

  async trackEvent(request: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) {
    const body = leadEventCreateSchema.parse(request.body);
    const event = await this.leadEventService.trackEvent(body);
    return reply.status(201).send(event);
  }

  async getEvents(request: FastifyRequest<{ Querystring: unknown }>, reply: FastifyReply) {
    const query = leadEventQuerySchema.parse(request.query);
    const result = await this.leadEventService.getEvents(query);
    return reply.send(result);
  }

  async getAnalytics(
    request: FastifyRequest<{ Querystring: { startDate?: string; endDate?: string } }>,
    reply: FastifyReply
  ) {
    const { startDate, endDate } = request.query;
    const analytics = await this.leadEventService.getAnalytics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    return reply.send(analytics);
  }
}
