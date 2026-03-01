import { prisma } from "../database/prisma";
import { ProductionOrder, Status } from "@prisma/client";
import { AppError } from "../errors/AppError";

interface CreateProductionDTO {
  model_id: string;
  size: number;
  quantity_planned: number;
  start_date: Date;
}

export class ProductionOrderService {
  async create(data: CreateProductionDTO): Promise<ProductionOrder> {
    const modelExists = await prisma.shoeModel.findUnique({ where: { id: data.model_id } });
    if (!modelExists) throw new AppError("Modelo de calçado não encontrado", 404);

    return prisma.productionOrder.create({
      data: {
        ...data,
        quantity_produced: 0,
        status: Status.PLANNED,
      },
    });
  }

  async findAll(status?: Status): Promise<ProductionOrder[]> {
    return prisma.productionOrder.findMany({
      where: status ? { status } : {},
      include: { model: true },
      orderBy: { created_at: "desc" },
    });
  }

  async updateStatus(id: string, status: Status): Promise<ProductionOrder> {
    const updateData: any = { status };
    if (status === Status.COMPLETED) {
      updateData.end_date = new Date();
    }

    return prisma.productionOrder.update({
      where: { id },
      data: updateData,
    });
  }

  // Nome voltado para "updateProduced" para encaixar no seu Controller
  async updateProduced(id: string, quantity: number): Promise<ProductionOrder> {
    if (quantity < 0) throw new AppError("Quantidade não pode ser negativa");

    const order = await prisma.productionOrder.findUnique({ where: { id } });
    if (!order) throw new AppError("Ordem não encontrada", 404);

    if (quantity > order.quantity_planned) {
      throw new AppError("Quantidade produzida excede o planejado", 400);
    }

    return prisma.productionOrder.update({
      where: { id },
      data: { quantity_produced: quantity },
    });
  }
}