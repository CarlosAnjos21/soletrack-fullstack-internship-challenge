import { api } from "./api";
import type { Production } from "../types/production";

export type ProductionStatus = "PENDING" | "IN_PROGRESS" | "FINISHED";

export interface ProductionOrder {
  id: string;
  modelId: string;
  quantityPlanned: number;
  quantityProduced: number;
  status: ProductionStatus;
  createdAt: string;
}

export interface CreateProductionRequest {
  modelId: string;
  quantityPlanned: number;
}

export const productionService = {
  async getAll(): Promise<Production[]> {
    const response = await api.get<Production[]>("/production");
    return response.data;
  },

  async create(data: CreateProductionRequest): Promise<ProductionOrder> {
    const response = await api.post<ProductionOrder>("/production", data);
    return response.data;
  },

  async updateStatus(
    id: string,
    status: ProductionStatus
  ): Promise<ProductionOrder> {
    const response = await api.patch<ProductionOrder>(
      `/production/${id}/status`,
      { status }
    );

    return response.data;
  },
};