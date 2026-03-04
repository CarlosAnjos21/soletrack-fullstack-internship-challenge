import { Request, Response, NextFunction } from "express";
import { ShoeModelService, CreateShoeModelDTO } from "../services/shoeModel.service";
import { z } from "zod";

const service = new ShoeModelService();

const createSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  base_cost: z.number().positive(),
});

const idSchema = z.object({ id: z.string().uuid() });

export class ShoeModelController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSchema.parse(req.body);
      const shoe = await service.create(data);

      return res.status(201).json({ status: "success", data: shoe });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const shoes = await service.findAll();
      return res.json({ status: "success", data: shoes });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);
      const updateSchema = createSchema.partial();
      const data: Partial<CreateShoeModelDTO> = updateSchema.parse(req.body);

      const updated = await service.update(id, data);
      return res.json({ status: "success", message: "Modelo atualizado", data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);
      await service.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}