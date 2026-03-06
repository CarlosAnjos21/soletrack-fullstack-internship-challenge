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
    const response = await api.post("/auth/login", payload);

    const { token, user } = response.data.data;

    return {
      token,
      user,
    };
  },

  async register(payload: RegisterPayload, token: string): Promise<void> {
    await api.post("/auth/register", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateProfile(
    id: string,
    payload: { name?: string; password?: string }
  ): Promise<User> {
    const { data } = await api.put(`/auth/${id}`, payload);
    return data.data ?? data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/auth/${id}`);
  },
};