import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { env } from '../config/index.js';
import { ApiErrorResponse } from '../types';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, string[]>;

  constructor(message: string, statusCode: number = 500, details?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, details?: Record<string, string[]>) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message: string = 'Não autorizado') {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Acesso negado') {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Recurso não encontrado') {
    return new AppError(message, 404);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }

  static internal(message: string = 'Erro interno do servidor') {
    return new AppError(message, 500);
  }
}

export const errorHandler = async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  request.log.error({ err: error }, 'Error occurred');

  if (error instanceof z.ZodError) {
    const details: Record<string, string[]> = {};
    error.errors.forEach(err => {
      const path = err.path.join('.');
      if (!details[path]) details[path] = [];
      details[path].push(err.message);
    });

    const response: ApiErrorResponse = {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Erro de validação',
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    return reply.status(400).send(response);
  }

  if (error instanceof AppError) {
    const response: ApiErrorResponse = {
      statusCode: error.statusCode,
      error: getErrorName(error.statusCode),
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    return reply.status(error.statusCode).send(response);
  }

  if (error.code === 'P2002') {
    const response: ApiErrorResponse = {
      statusCode: 409,
      error: 'Conflict',
      message: 'Recurso já existe',
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    return reply.status(409).send(response);
  }

  if (error.code === 'P2025') {
    const response: ApiErrorResponse = {
      statusCode: 404,
      error: 'Not Found',
      message: 'Recurso não encontrado',
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    return reply.status(404).send(response);
  }

  const response: ApiErrorResponse = {
    statusCode: 500,
    error: 'Internal Server Error',
    message: env.isProduction ? 'Erro interno do servidor' : error.message,
    timestamp: new Date().toISOString(),
    path: request.url,
  };

  return reply.status(500).send(response);
};

function getErrorName(statusCode: number): string {
  const names: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };
  return names[statusCode] || 'Error';
}

export const notFoundHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const response: ApiErrorResponse = {
    statusCode: 404,
    error: 'Not Found',
    message: `Rota ${request.method} ${request.url} não encontrada`,
    timestamp: new Date().toISOString(),
    path: request.url,
  };
  return reply.status(404).send(response);
};
