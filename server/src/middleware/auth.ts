import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { JWTPayload } from '../types';
import { AppError } from './errorHandler';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

function extractToken(request: FastifyRequest): string | null {
  // Prioridade 1: Cookie HttpOnly
  const cookieToken = (request as any).cookies?.auth_token;
  if (cookieToken) return cookieToken;

  // Prioridade 2: Authorization header (para compatibilidade/APIs externas)
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export const authenticate = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const token = extractToken(request);

  if (!token) {
    throw AppError.unauthorized('Token de acesso não fornecido');
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret) as JWTPayload;
    request.user = decoded;
  } catch {
    throw AppError.unauthorized('Token inválido ou expirado');
  }
};

export const authorize = (...roles: JWTPayload['role'][]) => {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const user = request.user;

    if (!user) {
      throw AppError.unauthorized('Usuário não autenticado');
    }

    if (!roles.includes(user.role)) {
      throw AppError.forbidden('Permissão insuficiente para acessar este recurso');
    }
  };
};

export const optionalAuth = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const token = extractToken(request);

  if (!token) {
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret) as JWTPayload;
    request.user = decoded;
  } catch {
    // Token inválido, mas não bloqueia a requisição
  }
};