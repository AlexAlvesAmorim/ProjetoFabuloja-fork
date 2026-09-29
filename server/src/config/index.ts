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

const cookieSameSiteRaw = process.env.COOKIE_SAMESITE || 'strict';
if (!['strict', 'lax', 'none'].includes(cookieSameSiteRaw)) {
  throw new Error('COOKIE_SAMESITE inválido: use strict, lax ou none');
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
  // Atrás de proxy (Render/Fly) o IP real vem de X-Forwarded-For.
  // Sem isso o rate-limit enxerga todo mundo como um IP só.
  // Só ligue quando houver proxy confiável na frente (spoofável sem proxy).
  trustProxy: process.env.TRUST_PROXY === 'true',
  cookie: {
    // Deploy separado (front e API em domínios diferentes) exige sameSite=none.
    // Browsers só aceitam sameSite=none com secure, então ele é forçado abaixo.
    sameSite: cookieSameSiteRaw as 'strict' | 'lax' | 'none',
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
