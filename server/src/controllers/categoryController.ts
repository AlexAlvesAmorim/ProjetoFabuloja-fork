import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoryService } from '../services';
import { categoryCreateSchema, categoryUpdateSchema, categoryParamsSchema } from '../schemas';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async getCategories(_request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoryService.getCategories();
    return reply.send(categories);
  }

  async getCategoryById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = categoryParamsSchema.parse(request.params);
    const category = await this.categoryService.getCategoryById(id);
    return reply.send(category);
  }

  async createCategory(request: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) {
    const body = categoryCreateSchema.parse(request.body);
    const category = await this.categoryService.createCategory(body);
    return reply.status(201).send(category);
  }

  async updateCategory(
    request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
    reply: FastifyReply
  ) {
    const { id } = categoryParamsSchema.parse(request.params);
    const body = categoryUpdateSchema.parse(request.body);
    const category = await this.categoryService.updateCategory(id, body);
    return reply.send(category);
  }

  async deleteCategory(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = categoryParamsSchema.parse(request.params);
    await this.categoryService.deleteCategory(id);
    return reply.status(204).send();
  }
}
