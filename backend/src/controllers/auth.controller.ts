import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { z } from "zod";

const authService = new AuthService();

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "OPERATOR"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);

      const user = await authService.register(
        data.name,
        data.email,
        data.password,
        data.role
      );

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);

      const result = await authService.login(
        data.email,
        data.password
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}