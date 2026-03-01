import { Request, Response, NextFunction } from "express";
import { ProductionOrderService } from "../services/productionOrder.service";
import { z } from "zod";
import { Status } from "@prisma/client";

const createSchema = z.object({
  model_id: z.string().uuid(),
  size: z.number().min(34).max(44),
  quantity_planned: z.number().positive(),
  start_date: z.string(),
});

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(Status),
});

const updateProducedSchema = z.object({
  quantity: z.number().positive(),
});

export class ProductionOrderController {
  private service = new ProductionOrderService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createSchema.parse(req.body);

      const order = await this.service.create({
        ...body,
        start_date: new Date(body.start_date),
      });

      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const querySchema = z.object({
        status: z.nativeEnum(Status).optional(),
      });

      const { status } = querySchema.parse(req.query);

      const orders = await this.service.findAll(status);

      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = paramsSchema.parse(req.params);
      const { status } = updateStatusSchema.parse(req.body);

      const updated = await this.service.updateStatus(id, status);

      return res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async updateProduced(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = paramsSchema.parse(req.params);
      const { quantity } = updateProducedSchema.parse(req.body);

      const updated = await this.service.updateProduced(id, quantity);

      return res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}

