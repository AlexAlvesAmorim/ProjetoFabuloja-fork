import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/index.js';

const prisma = new PrismaClient();

export class AuthController {
  async login(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ message: 'Credenciais inválidas' });
    }

    const jwtSecret = env.jwt.secret;
    const jwtExpiresIn = env.jwt.expiresIn;

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn as jwt.SignOptions['expiresIn'] }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Set HttpOnly cookie
    reply.setCookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      path: '/',
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('auth_token', { path: '/' });
    return reply.send({ message: 'Logout realizado com sucesso' });
  }

  // Criação de admin — rota protegida (só ADMIN logado). Role sempre ADMIN,
  // nunca vinda do body, pra não virar escalação de privilégio.
  async register(
    request: FastifyRequest<{ Body: { email: string; password: string; name: string } }>,
    reply: FastifyReply
  ) {
    const { email, password, name } = request.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(409).send({ message: 'Email já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, role: 'ADMIN' },
    });

    return reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    // Token vem do cookie HttpOnly automaticamente
    const token = request.cookies.auth_token;
    if (!token) {
      return reply.status(401).send({ message: 'Não autenticado' });
    }

    try {
      const jwtSecret = env.jwt.secret;
      const decoded = jwt.verify(token, jwtSecret) as {
        sub: string;
        email: string;
        name: string;
        role: string;
      };

      const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user) {
        return reply.status(401).send({ message: 'Usuário não encontrado' });
      }

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch {
      return reply.status(401).send({ message: 'Token inválido' });
    }
  }
}
