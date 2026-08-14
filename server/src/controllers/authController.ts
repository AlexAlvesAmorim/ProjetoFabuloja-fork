import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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

    const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

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
    // @ts-ignore - Fastify cookie methods
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
    // @ts-ignore - Fastify cookie methods
    reply.clearCookie('auth_token', { path: '/' });
    return reply.send({ message: 'Logout realizado com sucesso' });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    // Token vem do cookie HttpOnly automaticamente
    // @ts-ignore - Fastify cookie type
    const token = request.cookies.auth_token;
    if (!token) {
      return reply.status(401).send({ message: 'Não autenticado' });
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
      const decoded = jwt.verify(token, jwtSecret) as { sub: string; email: string; name: string; role: string };
      
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