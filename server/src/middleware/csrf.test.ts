import { describe, it, expect } from 'vitest';
import { FastifyRequest, FastifyReply } from 'fastify';
import { csrfProtection } from './csrf';

const reply = {} as FastifyReply;

describe('csrfProtection', () => {
  it('should allow GET without checks', async () => {
    const req = { method: 'GET', headers: {} } as unknown as FastifyRequest;
    await expect(csrfProtection(req, reply)).resolves.toBeUndefined();
  });

  it('should block POST from foreign origin', async () => {
    const req = {
      method: 'POST',
      headers: { origin: 'https://site-malicioso.com' },
    } as unknown as FastifyRequest;
    await expect(csrfProtection(req, reply)).rejects.toThrow('Origem não permitida');
  });

  it('should allow POST without origin headers (non-browser)', async () => {
    const req = { method: 'POST', headers: {} } as unknown as FastifyRequest;
    await expect(csrfProtection(req, reply)).resolves.toBeUndefined();
  });
});
