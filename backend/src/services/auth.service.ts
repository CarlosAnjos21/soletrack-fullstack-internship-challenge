import { prisma } from "../database/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export class AuthService {
  async register(name: string, email: string, password: string, role: "ADMIN" | "OPERATOR") {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw { status: 400, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw { status: 400, message: "Invalid credentials" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw { status: 400, message: "Invalid credentials" };
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return { token };
  }
}