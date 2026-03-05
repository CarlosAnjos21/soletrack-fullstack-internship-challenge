export type OrderStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export interface ProductionOrder {
  id: string;
  model_id: string;
  size: number;
  quantity_planned: number;
  quantity_produced: number;
  status: OrderStatus;
  start_date: string;
  end_date?: string;
  created_at: string;
}