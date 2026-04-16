import { Request, Response } from "express";
import {
  listUsers,
  deleteUser,
  updateUserRole,
} from "../services/users.service";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await listUsers();
  res.json(users);
};

export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  await deleteUser(id);

  res.json({ message: "Usuário removido com sucesso" });
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (!["ADMIN", "OPERATOR"].includes(role)) {
    return res.status(400).json({ message: "Role inválida" });
  }

  const user = await updateUserRole(id, role);

  res.json(user);
};
