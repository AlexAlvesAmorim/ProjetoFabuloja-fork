import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import { JWTPayload } from '../types';
import { AppError } from './errorHandler';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

export const authenticate = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Token de acesso não fornecido');
  }

  const token = authHeader.substring(7);

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
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.jwt.secret) as JWTPayload;
    request.user = decoded;
  } catch {
    // Token inválido, mas não bloqueia a requisição
  }
};
