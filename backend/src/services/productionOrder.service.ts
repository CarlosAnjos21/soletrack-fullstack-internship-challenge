import { prisma } from "../database/prisma";
import { Status } from "@prisma/client";
import { AppError } from "../errors/AppError";

export interface CreateProductionDTO {
  variant_id: string;
  size_id: string;
  quantity_planned: number;
}

export class ProductionOrderService {
  private async generateId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `OP-${year}-`;

    const lastOrder = await prisma.productionOrder.findFirst({
      where: { id: { startsWith: prefix } },
      orderBy: { id: "desc" },
      select: { id: true },
    });

    if (!lastOrder) return `${prefix}001`;

    const lastSeq = parseInt(lastOrder.id.split("-")[2], 10);
    const nextSeq = String(lastSeq + 1).padStart(3, "0");

    return `${prefix}${nextSeq}`;
  }

  async create(data: CreateProductionDTO) {
    const { variant_id, size_id, quantity_planned } = data;

    if (!variant_id || !size_id || quantity_planned == null) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    if (quantity_planned <= 0) {
      throw new AppError("Quantidade planejada inválida", 400);
    }

    const [variant, size] = await Promise.all([
      prisma.shoeVariant.findUnique({ where: { id: variant_id } }),
      prisma.size.findUnique({ where: { id: size_id } }),
    ]);

    if (!variant) throw new AppError("Variação não encontrada", 404);
    if (!size) throw new AppError("Tamanho não encontrado", 404);

    const id = await this.generateId();

    return prisma.productionOrder.create({
      data: {
        id,
        quantity_planned,

        variant: {
          connect: { id: variant_id },
        },

        size: {
          connect: { id: size_id },
        },
      },
      include: {
        variant: { include: { model: true } },
        size: true,
      },
    });
  }

  async findAll(status?: Status) {
    return prisma.productionOrder.findMany({
      where: status ? { status } : {},
      include: {
        variant: {
          include: {
            model: true,
          },
        },
        size: true,
      },
      orderBy: { created_at: "desc" },
    });
  }

  async updateStatus(id: string, status: Status) {
    const order = await prisma.productionOrder.findUnique({
      where: { id },
    });

    if (!order) throw new AppError("Ordem não encontrada", 404);

    const data: any = { status };

    if (status === Status.IN_PROGRESS && !order.start_date) {
      data.start_date = new Date();
    }

    if (status === Status.COMPLETED) {
      data.end_date = new Date();
      data.quantity_produced = order.quantity_planned;
    }

    return prisma.productionOrder.update({
      where: { id },
      data,
      include: {
        variant: { include: { model: true } },
        size: true,
      },
    });
  }

  async updateProduced(id: string, quantity: number) {
    if (quantity <= 0) {
      throw new AppError("Quantidade inválida", 400);
    }

    const order = await prisma.productionOrder.findUnique({
      where: { id },
    });

    if (!order) throw new AppError("Ordem não encontrada", 404);

    if (order.status === Status.PLANNED) {
      throw new AppError("Inicie a produção antes de atualizar", 400);
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
      include: {
        variant: { include: { model: true } },
        size: true,
      },
    });
  }

  async delete(id: string) {
    const order = await prisma.productionOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new AppError("Ordem de produção não encontrada", 404);
    }

    if (order.status !== Status.PLANNED) {
      throw new AppError("Só é possível excluir ordens planejadas", 400);
    }

    return prisma.productionOrder.delete({
      where: { id },
    });
  }

  async reset(id: string) {
    const order = await prisma.productionOrder.findUnique({
      where: { id },
    });

    if (!order) throw new AppError("Ordem não encontrada", 404);

    return prisma.productionOrder.update({
      where: { id },
      data: {
        quantity_produced: 0,
        status: Status.PLANNED,
        start_date: null,
        end_date: null,
      },
      include: {
        variant: { include: { model: true } },
        size: true,
      },
    });
  }
}