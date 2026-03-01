import { prisma } from "../database/prisma";
import { ShoeModel } from "@prisma/client";
import { AppError } from "../errors/AppError";

interface CreateShoeModelDTO {
  name: string;
  category: string;
  base_cost: number;
}

export class ShoeModelService {
  async create(data: CreateShoeModelDTO): Promise<ShoeModel> {
    return prisma.shoeModel.create({ data });
  }

  async findAll(): Promise<ShoeModel[]> {
    return prisma.shoeModel.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  // Adicionado para ser compatível com seu Controller
  async update(id: string, data: Partial<CreateShoeModelDTO>): Promise<ShoeModel> {
    return prisma.shoeModel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ShoeModel> {
    // Melhoria de segurança: impede deletar se houver ordens
    const hasOrders = await prisma.productionOrder.findFirst({
      where: { model_id: id }
    });

    if (hasOrders) {
      throw new AppError("Não é possível excluir um modelo com ordens de produção ativas", 400);
    }

    return prisma.shoeModel.delete({ where: { id } });
  }
}