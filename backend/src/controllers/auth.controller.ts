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
        data.role,
      );
      return res.status(201).json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data.email, data.password);
      return res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida o id que vem nos params
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });
      const { id } = paramsSchema.parse(req.params);

      await authService.deleteUser(id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
