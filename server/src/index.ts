import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { env } from './config';
import { registerRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: env.isDevelopment ? { transport: { target: 'pino-pretty' } } : true,
    ajv: { customOptions: { coerceTypes: 'array' } },
  }).withTypeProvider<ZodTypeProvider>();

  await app.register(sensible);
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });
  await app.register(cors, {
    origin: env.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  await app.register(rateLimit, {
    max: env.rateLimit.max,
    timeWindow: env.rateLimit.windowMs,
    allowList: ['127.0.0.1'],
  });

  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler(notFoundHandler);

  await registerRoutes(app);

  return app;
}

export async function startServer(): Promise<void> {
  const app = await buildApp();

  try {
    await app.listen({ port: env.port, host: env.host });
    logger.info(`🚀 Server running at http://${env.host}:${env.port}`);
    logger.info(`📚 API docs available at http://${env.host}:${env.port}/documentation`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
