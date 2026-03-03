export type ProductionStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface Production {
  id: string;
  model: string;
  quantity: number;
  status: ProductionStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductionDTO {
  modelId: string;
  quantity: number;
  status: ProductionStatus;
}

export interface UpdateProductionDTO {
  quantity?: number;
  status?: ProductionStatus;
}