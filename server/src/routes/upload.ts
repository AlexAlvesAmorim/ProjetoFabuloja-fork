import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

async function processImage(buffer: Buffer, filename: string): Promise<string> {
  const ext = '.webp';
  const outputFilename = `${uuidv4()}.webp`;
  const outputPath = path.join(UPLOAD_DIR, outputFilename);

  await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath);

  return `/uploads/${outputFilename}`;
}

export async function uploadRoutes(app: FastifyInstance) {
  // Register multipart support
  await app.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  // Single image upload
  app.post('/api/upload', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ message: 'Nenhuma imagem enviada' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply
          .status(400)
          .send({ message: 'Formato não suportado. Use JPEG, PNG, WebP ou AVIF.' });
      }

      const buffer = await data.toBuffer();
      const url = await processImage(await data.toBuffer(), data.filename);

      return reply.send({ url });
    } catch (err) {
      console.error('Upload error:', err);
      return reply.status(500).send({ message: 'Erro ao processar imagem' });
    }
  });

  // Multiple images upload (for product gallery)
  app.post('/api/upload/multiple', async (request, reply) => {
    try {
      const files: any[] = [];
      for await (const file of request.files()) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!allowedTypes.includes(file.mimetype)) {
          continue;
        }
        files.push(file);
      }

      if (files.length === 0) {
        return reply.status(400).send({ message: 'Nenhuma imagem válida enviada' });
      }

      const urls = await Promise.all(
        files.map(async file => {
          const buffer = await file.toBuffer();
          return processImage(buffer, file.filename);
        })
      );

      return reply.send({ urls });
    } catch (err) {
      console.error('Multiple upload error:', err);
      return reply.status(500).send({ message: 'Erro ao processar imagens' });
    }
  });

  // Delete uploaded image
  app.delete('/api/upload/:filename', async (request, reply) => {
    try {
      const { filename } = request.params as { filename: string };
      const filePath = path.join(UPLOAD_DIR, filename);

      // Security: prevent directory traversal
      const resolvedPath = path.resolve(filePath);
      const resolvedUploadDir = path.resolve(UPLOAD_DIR);
      if (!resolvedPath.startsWith(resolvedUploadDir)) {
        return reply.status(400).send({ message: 'Arquivo inválido' });
      }

      try {
        await fs.unlink(resolvedPath);
        return reply.send({ success: true });
      } catch {
        return reply.status(404).send({ message: 'Arquivo não encontrado' });
      }
    } catch (err) {
      console.error('Delete upload error:', err);
      return reply.status(500).send({ message: 'Erro ao excluir imagem' });
    }
  });
}
