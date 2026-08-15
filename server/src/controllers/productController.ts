import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductService } from '../services';
import {
  productCreateSchema,
  productUpdateSchema,
  productParamsSchema,
  productQuerySchema,
} from '../schemas';

export class ProductController {
  constructor(private productService: ProductService) {}

  async getProducts(request: FastifyRequest<{ Querystring: unknown }>, reply: FastifyReply) {
    const query = productQuerySchema.parse(request.query);
    const result = await this.productService.getProducts(query);
    return reply.send(result);
  }

  async getProductById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = productParamsSchema.parse(request.params);
    const product = await this.productService.getProductById(id);
    return reply.send(product);
  }

  async createProduct(request: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) {
    const body = productCreateSchema.parse(request.body);
    const { categoryId, ...rest } = body;
    const data = {
      ...rest,
      category: { connect: { id: categoryId } },
    };
    const product = await this.productService.createProduct(data);
    return reply.status(201).send(product);
  }

  async updateProduct(
    request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
    reply: FastifyReply
  ) {
    const { id } = productParamsSchema.parse(request.params);
    const body = productUpdateSchema.parse(request.body);
    const data = body.categoryId
      ? (() => {
          const { categoryId, ...rest } = body;
          return { ...rest, category: { connect: { id: categoryId } } };
        })()
      : body;
    const product = await this.productService.updateProduct(id, data);
    return reply.send(product);
  }

  async deleteProduct(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = productParamsSchema.parse(request.params);
    await this.productService.deleteProduct(id);
    return reply.status(204).send();
  }
}
