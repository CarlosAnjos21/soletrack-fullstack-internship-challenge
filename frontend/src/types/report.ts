import type { ProductionStatus } from "./production";

export interface ProductionSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface ProductionByStatus {
  status: ProductionStatus;
  count: number;
}