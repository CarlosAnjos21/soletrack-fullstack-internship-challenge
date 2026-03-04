import { prisma } from "../database/prisma";
import { ShoeModel } from "@prisma/client";
import { AppError } from "../errors/AppError";

export interface CreateShoeModelDTO {
  name: string;
  category: string;
  base_cost: number;
}

export class ShoeModelService {
  /**
   * Cria um novo modelo de sapato
   */
  async create(data: CreateShoeModelDTO): Promise<ShoeModel> {
    if (!data.name || !data.category || !data.base_cost) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    return prisma.shoeModel.create({ data });
  }

  /**
   * Lista todos os modelos
   */
  async findAll(): Promise<ShoeModel[]> {
    return prisma.shoeModel.findMany({ orderBy: { created_at: "desc" } });
  }

  /**
   * Atualiza um modelo existente
   */
  async update(id: string, data: Partial<CreateShoeModelDTO>): Promise<ShoeModel> {
    const model = await prisma.shoeModel.findUnique({ where: { id } });
    if (!model) throw new AppError("Modelo não encontrado", 404);

    return prisma.shoeModel.update({ where: { id }, data });
  }

  /**
   * Deleta um modelo (somente se não houver ordens ativas)
   */
  async delete(id: string): Promise<ShoeModel> {
    const model = await prisma.shoeModel.findUnique({ where: { id } });
    if (!model) throw new AppError("Modelo não encontrado", 404);

    const hasOrders = await prisma.productionOrder.findFirst({ where: { model_id: id } });
    if (hasOrders) throw new AppError(
      "Não é possível excluir modelo com ordens de produção ativas",
      400
    );

    return prisma.shoeModel.delete({ where: { id } });
  }
}