import { Request, Response, NextFunction } from "express";
import { ProductionOrderService } from "../services/productionOrder.service";
import { z } from "zod";
import { Status } from "@prisma/client";

const service = new ProductionOrderService();

/**
 * VALIDATIONS
 */
const idSchema = z.object({
  id: z.string().min(1),
});

const updateProducedSchema = z.object({
  quantity: z.number().positive(),
});

const statusSchema = z.object({
  status: z.nativeEnum(Status),
});

export class ProductionOrderController {
  /**
   * CREATE
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await service.create(req.body);

      return res.status(201).json({
        status: "success",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * FIND ALL
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await service.findAll();

      return res.json({
        status: "success",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE PRODUCED (REGRA AGORA NO SERVICE)
   */
  async updateProduced(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);
      const { quantity } = updateProducedSchema.parse(req.body);

      const order = await service.updateProduced(id, quantity);

      return res.json({
        status: "success",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * RESET
   */
  async resetProduction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);

      const order = await service.reset(id);

      return res.json({
        status: "success",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE STATUS (VALIDADO)
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);
      const { status } = statusSchema.parse(req.body);

      const order = await service.updateStatus(id, status);

      return res.json({
        status: "success",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idSchema.parse(req.params);

      await service.delete(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * DASHBOARD (OTIMIZADO)
   */
  async dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await service.findAll();

      const today = new Date().toISOString().split("T")[0];

      const dashboardData = orders.reduce(
        (acc, order) => {
          const orderDate = order.created_at
            ? new Date(order.created_at).toISOString().split("T")[0]
            : null;

          if (orderDate === today) {
            acc.producedToday += order.quantity_produced;
          }

          acc.totalProduced += order.quantity_produced;
          acc.totalMeta += order.quantity_planned;
          acc.totalOrders += 1;

          if (order.status === Status.IN_PROGRESS) acc.inProduction += 1;
          if (order.status === Status.COMPLETED) acc.completed += 1;
          if (order.status === Status.PLANNED) acc.planned += 1;

          return acc;
        },
        {
          producedToday: 0,
          inProduction: 0,
          completed: 0,
          planned: 0,
          totalProduced: 0,
          totalMeta: 0,
          totalOrders: 0,
        }
      );

      return res.json({
        status: "success",
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
}
