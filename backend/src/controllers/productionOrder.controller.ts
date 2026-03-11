// src/controllers/productionOrder.controller.ts
import { Request, Response, NextFunction } from "express";
import { ProductionOrderService } from "../services/productionOrder.service";
import type { CreateProductionDTO } from "../services/productionOrder.service";
import { z } from "zod";
import { Status } from "@prisma/client";

const service = new ProductionOrderService();

// model_id agora é SAP-CATEGORY-NNN, não mais UUID
const createSchema = z.object({
  model_id: z.string().min(1),
  size: z.number().min(34).max(44),
  quantity_planned: z.number().positive(),
  start_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: "Data inválida" }
  ),
});

// id agora é OP-YYYY-NNN, não mais UUID
const idSchema = z.object({ id: z.string().min(1) });
const updateStatusSchema = z.object({ status: z.nativeEnum(Status) });
const updateProducedSchema = z.object({ quantity: z.number().positive() });

export class ProductionOrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createSchema.parse(req.body);
      const dto: CreateProductionDTO = {
        ...body,
        start_date: new Date(body.start_date),
      };
      const order = await service.create(dto);
      return res.status(201).json({ status: "success", data: order });
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
      const orders = await service.findAll(status);
      return res.json({ status: "success", data: orders });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);
      const { status } = updateStatusSchema.parse(req.body);
      const updated = await service.updateStatus(id, status);
      return res.json({ status: "success", message: "Status atualizado", data: updated });
    } catch (error) {
      next(error);
    }
  }

  async updateProduced(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);
      const { quantity } = updateProducedSchema.parse(req.body);
      const updated = await service.updateProduced(id, quantity);
      return res.json({ status: "success", message: "Produção atualizada", data: updated });
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