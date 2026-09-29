import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../config/index.js';
import { AppError } from './errorHandler';

// Anti-CSRF simples sem token: browsers sempre mandam Origin/Referer em
// POST/PUT/PATCH/DELETE. Se o header existe e não bate com a origem
// permitida, a requisição veio de outro site usando o cookie da vítima.
// Sem header (curl, app nativa) deixa passar — o auth continua valendo.
export async function csrfProtection(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return;
  }

  const origin = request.headers.origin;
  const referer = request.headers.referer;
  if (!origin && !referer) {
    return;
  }

  const allowed = env.cors.origin;
  if (origin && origin !== allowed) {
    throw AppError.forbidden('Origem não permitida');
  }
  if (!origin && referer && !referer.startsWith(allowed)) {
    throw AppError.forbidden('Origem não permitida');
  }
}
