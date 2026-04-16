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
   * Gera ID sequencial no formato SAP-CATEGORY-NNN
   * Ex: SAP-SPORT-001, SAP-CASUAL-003, SAP-SOCIAL-012
   */
  private async generateId(category: string): Promise<string> {
    const categorySlug = category
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toUpperCase()
      .replace(/\s+/g, "-")
      .slice(0, 10); // limita tamanho

    const prefix = `SAP-${categorySlug}-`;

    const models = await prisma.shoeModel.findMany({
      where: { id: { startsWith: prefix } },
      orderBy: { id: "desc" },
      take: 1,
    });

    if (models.length === 0) {
      return `${prefix}001`;
    }

    // Extrai o número sequencial do último ID e incrementa
    const parts = models[0].id.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    const nextSeq = String(lastSeq + 1).padStart(3, "0");
    return `${prefix}${nextSeq}`;
  }

  /**
   * Cria um novo modelo de sapato
   */
  async create(data: CreateShoeModelDTO): Promise<ShoeModel> {
    if (!data.name || !data.category || !data.base_cost) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    const id = await this.generateId(data.category);

    return prisma.shoeModel.create({ data: { id, ...data } });
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