import { Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "./auth.middleware";

/**
 * Middleware de autorização por roles
 * @param roles Roles permitidas (ex: "ADMIN", "OPERATOR")
 */
export function authorize(...roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ status: "error", message: "Não autorizado" });
    }

    if (roles.length && !roles.includes(user.role)) {
      console.warn(
        `[RoleMiddleware] Usuário ${user.id} tentou acessar ${req.path} com role ${user.role}`
      );
      return res.status(403).json({ status: "error", message: "Acesso negado" });
    }

    next();
  };
}