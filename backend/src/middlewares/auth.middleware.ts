import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { Role } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Middleware de autenticação JWT
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Token não fornecido ou inválido",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    console.error(
      `[AuthMiddleware] Token inválido. Path: ${req.path}, IP: ${req.ip}`,
      err
    );
    return res.status(401).json({ status: "error", message: "Token inválido" });
  }
}