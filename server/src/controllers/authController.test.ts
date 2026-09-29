import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthController } from '../controllers/authController';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() },
  },
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => prismaMock),
}));

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
  compare: vi.fn(),
  hash: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn(), verify: vi.fn() },
  sign: vi.fn(),
  verify: vi.fn(),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    vi.clearAllMocks();
    authController = new AuthController();
    mockReply = { send: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
  });

  describe('login', () => {
    it('should return 401 for invalid email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      mockRequest = { body: { email: 'wrong@test.com', password: 'wrong' } } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await authController.login(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Credenciais inválidas' });
    });

    it('should return 401 for invalid password', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'cuid1234567890123456789012',
        email: 'test@test.com',
        passwordHash: '$2b$12$hash',
        name: 'Test',
        role: 'ADMIN',
      });

      mockRequest = { body: { email: 'test@test.com', password: 'wrong' } } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await authController.login(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Credenciais inválidas' });
    });

    it('should return token and user on successful login', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockReturnValue('fake-jwt-token');

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'cuid1234567890123456789012',
        email: 'test@test.com',
        passwordHash: '$2b$12$hash',
        name: 'Test User',
        role: 'ADMIN',
      });
      prismaMock.user.update.mockResolvedValue({});

      mockRequest = { body: { email: 'test@test.com', password: 'password' } } as any;
      mockReply = { send: vi.fn(), setCookie: vi.fn() };

      await authController.login(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.setCookie).toHaveBeenCalledWith(
        'auth_token',
        'fake-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          secure: false,
          path: '/',
        })
      );
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: 'cuid1234567890123456789012',
            email: 'test@test.com',
            name: 'Test User',
            role: 'ADMIN',
          }),
        })
      );
    });
  });

  describe('logout', () => {
    it('should clear cookie and return success', async () => {
      mockReply = { clearCookie: vi.fn(), send: vi.fn() };

      await authController.logout({} as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.clearCookie).toHaveBeenCalledWith('auth_token', { path: '/' });
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Logout realizado com sucesso' });
    });
  });

  describe('me', () => {
    it('should return 401 when no cookie', async () => {
      mockRequest = { cookies: {} } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await authController.me(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Não autenticado' });
    });

    it('should return 401 for invalid token', async () => {
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      mockRequest = { cookies: { auth_token: 'invalid-token' } } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await authController.me(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Token inválido' });
    });

    it('should return user for valid token', async () => {
      vi.mocked(jwt.verify).mockReturnValue({
        sub: 'cuid1234567890123456789012',
        email: 'test@test.com',
        name: 'Test',
        role: 'ADMIN',
      });

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'cuid1234567890123456789012',
        email: 'test@test.com',
        name: 'Test',
        role: 'ADMIN',
      });

      mockRequest = { cookies: { auth_token: 'valid-token' } } as any;
      mockReply = { send: vi.fn() };

      await authController.me(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: 'cuid1234567890123456789012',
            email: 'test@test.com',
            name: 'Test',
            role: 'ADMIN',
          }),
        })
      );
    });
  });

  describe('register', () => {
    it('should create admin and return 201', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);
      prismaMock.user.create.mockResolvedValue({
        id: 'cuid1234567890123456789013',
        email: 'novo@test.com',
        name: 'Novo',
        role: 'ADMIN',
      });

      mockRequest = {
        body: { email: 'novo@test.com', password: 'Se123456!', name: 'Novo' },
      } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await authController.register(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ email: 'novo@test.com', name: 'Novo', role: 'ADMIN' }),
      });
      expect(mockReply.status).toHaveBeenCalledWith(201);
    });

    it('should return 409 when email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'cuid1234567890123456789012' });

      mockRequest = {
        body: { email: 'novo@test.com', password: 'Se123456!', name: 'Novo' },
      } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await authController.register(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(409);
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it('should reject weak password', async () => {
      mockRequest = {
        body: { email: 'novo@test.com', password: 'fraca', name: 'Novo' },
      } as any;
      mockReply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

      await expect(
        authController.register(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).rejects.toThrow();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });
});
