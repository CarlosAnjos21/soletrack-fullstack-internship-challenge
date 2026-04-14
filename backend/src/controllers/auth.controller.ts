// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { z } from "zod";
import { AppError } from "../errors/AppError";

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

const updateProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(), // <-- trocar por isso:
    password: z.string().min(6).optional(),
  })
  .partial()
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== ""),
    { message: "Nenhum campo para atualizar." },
  );

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
      const paramsSchema = z.object({ id: z.string().uuid() });
      const { id } = paramsSchema.parse(req.params);
      await authService.deleteUser(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

      const requester = (req as any).user;
      if (requester.id !== id && requester.role !== "ADMIN") {
        throw new AppError("Sem permissão para editar este perfil", 403);
      }

      const data = updateProfileSchema.parse(req.body);

      if (Object.keys(data).length === 0) {
        return res
          .status(400)
          .json({ status: "error", message: "Nenhum campo para atualizar." });
      }

      const updatedUser = await authService.updateProfile(id, data);
      return res.status(200).json({ status: "success", data: updatedUser });
    } catch (err) {
      next(err);
    }
  }
}
