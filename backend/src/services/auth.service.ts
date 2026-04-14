import { prisma } from "../database/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

type Role = "ADMIN" | "OPERATOR";

// mapeia snake_case do banco para camelCase pro frontend
function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: Date;
}) {
  return {
    id:        user.id,
    name:      user.name,
    email:     user.email,
    role:      user.role,
    createdAt: user.created_at,
  };
}

export interface LoginResponse {
  user: { id: string; name: string; role: Role };
  token: string;
}

export class AuthService {
  async register(name: string, email: string, password: string, role: Role) {
    if (!name || !email || !password || !role)
      throw new AppError("Todos os campos são obrigatórios", 400);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw new AppError("Este e-mail já está em uso", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });

    return serializeUser(created);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password)
      throw new AppError("E-mail e senha são obrigatórios", 400);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("E-mail ou senha inválidos", 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new AppError("E-mail ou senha inválidos", 401);

    const token = generateToken({ id: user.id, role: user.role });

    return { user: { id: user.id, name: user.name, role: user.role }, token };
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("Usuário não encontrado", 404);

    return prisma.user.delete({ where: { id } });
  }

  async updateProfile(id: string, data: { name?: string; email?: string; password?: string }) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("Usuário não encontrado", 404);

    if (data.email && data.email !== user.email) {
      const emailInUse = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailInUse) throw new AppError("Este e-mail já está em uso", 400);
    }

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (data.name)     updateData.name     = data.name;
    if (data.email)    updateData.email    = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });

    return serializeUser(updated);
  }
}