import { prisma } from "../database/prisma";
import { ProductionOrder, Status } from "@prisma/client";
import { AppError } from "../errors/AppError";

export interface CreateProductionDTO {
  model_id: string;
  size: number;
  quantity_planned: number;
  start_date: Date;
}

export class ProductionOrderService {

  /**
   * Gera ID sequencial no formato OP-YYYY-NNN
   */
  private async generateId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `OP-${year}-`;

    // Busca todas as ordens do ano atual
    const orders = await prisma.productionOrder.findMany({
      where: { id: { startsWith: prefix } },
      orderBy: { id: "desc" },
      take: 1,
    });

    if (orders.length === 0) {
      return `${prefix}001`;
    }

    // Extrai o número sequencial do último ID e incrementa
    const lastSeq = parseInt(orders[0].id.split("-")[2], 10);
    const nextSeq = String(lastSeq + 1).padStart(3, "0");
    return `${prefix}${nextSeq}`;
  }

  /**
   * Cria uma nova ordem de produção
   */
  async create(data: CreateProductionDTO): Promise<ProductionOrder> {
    if (!data.model_id || !data.size || !data.quantity_planned || !data.start_date) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    const modelExists = await prisma.shoeModel.findUnique({ where: { id: data.model_id } });
    if (!modelExists) throw new AppError("Modelo de calçado não encontrado", 404);

    const id = await this.generateId();

    return prisma.productionOrder.create({
      data: { id, ...data, quantity_produced: 0, status: Status.PLANNED },
    });
  }

  /**
   * Lista todas as ordens (opcionalmente filtrando por status)
   */
  async findAll(status?: Status): Promise<ProductionOrder[]> {
    return prisma.productionOrder.findMany({
      where: status ? { status } : {},
      include: { model: true },
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Atualiza o status da ordem
   */
  async updateStatus(id: string, status: Status): Promise<ProductionOrder> {
    const order = await prisma.productionOrder.findUnique({ where: { id } });
    if (!order) throw new AppError("Ordem não encontrada", 404);

    const updateData: { status: Status; end_date?: Date } = { status };
    if (status === Status.COMPLETED) updateData.end_date = new Date();

    return prisma.productionOrder.update({ where: { id }, data: updateData });
  }

  /**
   * Atualiza a quantidade produzida
   */
  async updateProduced(id: string, quantity: number): Promise<ProductionOrder> {
    if (quantity < 0) throw new AppError("Quantidade não pode ser negativa", 400);

    const order = await prisma.productionOrder.findUnique({ where: { id } });
    if (!order) throw new AppError("Ordem não encontrada", 404);

    if (quantity > order.quantity_planned) {
      throw new AppError("Quantidade produzida excede o planejado", 400);
    }

    return prisma.productionOrder.update({ where: { id }, data: { quantity_produced: quantity } });
  }

  /**
   * Deleta uma ordem (apenas se PLANNED)
   */
  async delete(id: string): Promise<ProductionOrder> {
    const order = await prisma.productionOrder.findUnique({ where: { id } });
    if (!order) throw new AppError("Ordem de produção não encontrada", 404);

    if (order.status !== Status.PLANNED) {
      throw new AppError("Só é possível excluir ordens planejadas", 400);
    }

    return prisma.productionOrder.delete({ where: { id } });
  }
}
