import { api } from "./api";
import { User } from "../types/User";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "OPERATOR";
}

interface LoginResponse {
  token: string;
  user: User;
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post("/api/auth/login", payload);

    return {
      token: response.data.token,
      user: response.data.user,
    };
  },

  async register(payload: RegisterPayload, token: string): Promise<void> {
    await api.post("/api/auth/register", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateProfile(
    id: string,
    payload: { name?: string; password?: string }
  ): Promise<User> {
    const { data } = await api.put<User>(`/api/auth/${id}`, payload);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/api/auth/${id}`);
  },
};
