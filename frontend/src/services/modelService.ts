import { api } from "./api";

export interface ShoeModel {
  id: string;
  name: string;
  code: string;
  sizes: number[];
  createdAt: string;
}

export interface CreateModelRequest {
  name: string;
  code: string;
  sizes: number[];
}

export const modelService = {
  async getAll(): Promise<ShoeModel[]> {
    const response = await api.get<ShoeModel[]>("/models");
    return response.data;
  },

  async create(data: CreateModelRequest): Promise<ShoeModel> {
    const response = await api.post<ShoeModel>("/models", data);
    return response.data;
  },
};