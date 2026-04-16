import { prisma } from "../database/prisma";
import { ProductionOrder, Status } from "@prisma/client";
import { AppError } from "../errors/AppError";

export interface CreateProductionDTO {
  model_id: string;
  size: number;
  quantity_planned: number;
}

export class ProductionOrderService {
  /**
   * Gera ID sequencial no formato OP-YYYY-NNN
   */
  private async generateId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `OP-${year}-`;

    const orders = await prisma.productionOrder.findMany({
      where: { id: { startsWith: prefix } },
      orderBy: { id: "desc" },
      take: 1,
    });

    if (orders.length === 0) {
      return `${prefix}001`;
    }

    const lastSeq = parseInt(orders[0].id.split("-")[2], 10);
    const nextSeq = String(lastSeq + 1).padStart(3, "0");

    return `${prefix}${nextSeq}`;
  }

  /**
   * CREATE
   */
  async create(data: CreateProductionDTO): Promise<ProductionOrder> {
    if (!data.model_id || !data.size || !data.quantity_planned) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    const modelExists = await prisma.shoeModel.findUnique({
      where: { id: data.model_id },
    });

    if (!modelExists) {
      throw new AppError("Modelo de calçado não encontrado", 404);
    }

    const id = await this.generateId();

    return prisma.productionOrder.create({
      data: {
        id,
        model_id: data.model_id,
        size: data.size,
        quantity_planned: data.quantity_planned,
        quantity_produced: 0,
        status: Status.PLANNED,
        start_date: null,
        end_date: null,
      },
    });
  }

  /**
   * FIND ALL
   */
  async findAll(status?: Status): Promise<ProductionOrder[]> {
    return prisma.productionOrder.findMany({
      where: status ? { status } : {},
      include: { model: true },
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * UPDATE STATUS
   */
  async updateStatus(id: string, status: Status): Promise<ProductionOrder> {
    const order = await prisma.productionOrder.findUnique({ where: { id } });

    if (!order) {
      throw new AppError("Ordem não encontrada", 404);
    }

    const updateData: any = {
      status,
    };

    if (status === Status.IN_PROGRESS && !order.start_date) {
      updateData.start_date = new Date();
    }

    if (status === Status.COMPLETED) {
      updateData.end_date = new Date();
      updateData.quantity_produced = order.quantity_planned; // garante fechamento
    }

    return prisma.productionOrder.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * PRODUÇÃO (incremental real)
   */
  async updateProduced(id: string, quantity: number): Promise<ProductionOrder> {
    if (quantity <= 0) {
      throw new AppError("Quantidade inválida", 400);
    }

    const order = await prisma.productionOrder.findUnique({ where: { id } });

    if (!order) {
      throw new AppError("Ordem não encontrada", 404);
    }

    const newProduced = order.quantity_produced + quantity;

    if (newProduced > order.quantity_planned) {
      throw new AppError("Quantidade excede o planejado", 400);
    }

    const isCompleted = newProduced === order.quantity_planned;

    return prisma.productionOrder.update({
      where: { id },
      data: {
        quantity_produced: newProduced,
        status: isCompleted ? Status.COMPLETED : Status.IN_PROGRESS,
        start_date: order.start_date ?? new Date(),
        end_date: isCompleted ? new Date() : null,
      },
    });
  }

  /**
   * DELETE
   */
  async delete(id: string): Promise<ProductionOrder> {
    const order = await prisma.productionOrder.findUnique({ where: { id } });

    if (!order) {
      throw new AppError("Ordem de produção não encontrada", 404);
    }

    if (order.status !== Status.PLANNED) {
      throw new AppError("Só é possível excluir ordens planejadas", 400);
    }

    return prisma.productionOrder.delete({ where: { id } });
  }

  /**
   * RESET
   */
  async reset(id: string): Promise<ProductionOrder> {
    const order = await prisma.productionOrder.findUnique({ where: { id } });

    if (!order) {
      throw new AppError("Ordem não encontrada", 404);
    }

    return prisma.productionOrder.update({
      where: { id },
      data: {
        quantity_produced: 0,
        status: Status.PLANNED,
        start_date: null,
        end_date: null,
      },
    });
  }
}