import api from "./api";
import { ShoeModel } from "../types/shoeModel";

export const ShoeModelService = {
  findAll: async (): Promise<ShoeModel[]> => {
    const { data } = await api.get("/models");

    return data.data ?? data;
  },

  create: async (
    payload: Omit<ShoeModel, "id" | "created_at">
  ): Promise<ShoeModel> => {
    const { data } = await api.post("/models", payload);

    return data.data ?? data;
  },

  update: async (
    id: string,
    payload: Partial<ShoeModel>
  ): Promise<ShoeModel> => {
    const { data } = await api.put(`/models/${id}`, payload);

    return data.data ?? data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/models/${id}`);
  },
};