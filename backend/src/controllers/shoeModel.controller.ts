import { Request, Response, NextFunction } from "express";
import { ShoeModelService } from "../services/shoeModel.service";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  base_cost: z.number().positive(),
});

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export class ShoeModelController {
  private service = new ShoeModelService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSchema.parse(req.body);

      const shoe = await this.service.create(data);

      return res.status(201).json(shoe);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const shoes = await this.service.findAll();

      return res.json(shoes);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = paramsSchema.parse(req.params);

      const updateSchema = createSchema.partial();
      const data = updateSchema.parse(req.body);

      const updated = await this.service.update(id, data);

      return res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = paramsSchema.parse(req.params);

      await this.service.delete(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}  