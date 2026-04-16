import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;
  let message = "Erro interno no servidor";

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  console.error(`[Error] ${message}`, (err as Error).stack);

  res.status(status).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Erro interno no servidor"
        : message,
  });
}