import api from "./api";
import { ProductionOrder, OrderStatus } from "../types/productionOrder";

export const ProductionOrderService = {
  findAll: async (status?: OrderStatus): Promise<ProductionOrder[]> => {
    const query = status ? `?status=${status}` : "";

    const { data } = await api.get(`/orders${query}`);

    return data.data ?? data;
  },

  create: async (
    payload: Omit<
      ProductionOrder,
      "id" | "quantity_produced" | "created_at" | "end_date"
    >
  ): Promise<ProductionOrder> => {
    const { data } = await api.post("/orders", payload);

    return data.data ?? data;
  },

  updateStatus: async (id: string, status: OrderStatus) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });

    return data.data ?? data;
  },

  updateProduced: async (id: string, quantity: number) => {
    const { data } = await api.patch(`/orders/${id}/produce`, { quantity });

    return data.data ?? data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};