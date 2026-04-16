import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUsers, removeUser, updateRole } from "../controllers/users.controller";

const router = Router();

router.get("/", authMiddleware, getUsers);

router.delete("/:id", authMiddleware, removeUser);

router.patch("/:id/role", authMiddleware, updateRole);

export default router;