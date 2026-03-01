import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

interface AuthenticatedUser {
  id: string;
  role: Role;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function authorize(...roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes (user.role)) {
      return res.status(403).json({ 
        message: "Forbidden", 
        requiredRoles: roles,
        userRole: user.role, 
      });
    }

    next();
  };
}