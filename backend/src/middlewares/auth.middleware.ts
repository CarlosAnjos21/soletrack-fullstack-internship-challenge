import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { Role } from "@prisma/client";

interface AuthenticatedUser {
  id: string;
  role: Role;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}