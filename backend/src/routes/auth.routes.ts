import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new AuthController();

/**
 * WRAPPER PADRÃO (TIPADO)
 */
const catchAsync =
  (fn: (req: any, res: any, next: any) => Promise<any>) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 */
router.post("/login", catchAsync(controller.login));

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Criar usuário (ADMIN)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/register",
  authMiddleware,
  authorize("ADMIN"),
  catchAsync(controller.register),
);

/**
 * @swagger
 * /api/auth/{id}:
 *   delete:
 *     summary: Deletar usuário (ADMIN)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  catchAsync(controller.delete),
);

/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     summary: Atualizar perfil
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  authMiddleware,
  catchAsync(controller.updateProfile),
);

export default router;