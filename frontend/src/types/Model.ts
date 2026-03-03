export interface Model {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateModelDTO {
  name: string;
  description?: string;
}

export interface UpdateModelDTO {
  name?: string;
  description?: string;
}