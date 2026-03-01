import { prisma } from "../database/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

export class AuthService {
  async register(name: string, email: string, password: string, role: "ADMIN" | "OPERATOR") {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new AppError("Este e-mail já está em uso", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      // Selecionamos apenas o que queremos retornar (Segurança)
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    // Mensagem genérica para evitar enumeração de usuários
    if (!user) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const token = generateToken({ id: user.id, role: user.role });

    return { 
      user: { id: user.id, name: user.name, role: user.role }, 
      token 
    };
  }
}