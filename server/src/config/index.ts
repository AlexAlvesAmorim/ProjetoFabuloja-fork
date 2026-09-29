import { config } from 'dotenv';
config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (isProduction && (!secret || secret.length < 32)) {
    throw new Error(
      'JWT_SECRET ausente ou fraco: defina uma variável com 32+ caracteres em produção ' +
        '(gere com: openssl rand -base64 32)'
    );
  }
  if (!secret) {
    console.warn(
      '[segurança] JWT_SECRET não definido — usando segredo de desenvolvimento. ' +
        'Nunca use isso em produção.'
    );
    return 'dev-secret-change-me';
  }
  return secret;
}

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv,
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: resolveJwtSecret(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    loginMax: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '10', 10),
    loginWindowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW_MS || '60000', 10),
    trackMax: parseInt(process.env.RATE_LIMIT_TRACK_MAX || '60', 10),
    trackWindowMs: parseInt(process.env.RATE_LIMIT_TRACK_WINDOW_MS || '60000', 10),
  },
  whatsapp: {
    number: process.env.WHATSAPP_NUMBER || '5521976807111',
  },
  isProduction,
  isDevelopment: nodeEnv === 'development',
};
