import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new AuthController();

// Async wrapper para tratar erros
const catchAsync = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas relacionadas à autenticação de usuários
 */

/**
 * @swagger
 * api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     description: Autentica usuário e retorna token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", catchAsync(controller.login.bind(controller)));

/**
 * @swagger
 * api/auth/register:
 *   post:
 *     summary: Registra usuário
 *     description: Apenas ADMIN pode registrar novos usuários
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Carlos
 *               email:
 *                 type: string
 *                 example: carlos@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: ["ADMIN","OPERATOR"]
 *                 example: OPERATOR
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       403:
 *         description: Sem permissão (não ADMIN)
 */
router.post("/register", authMiddleware, authorize("ADMIN"), catchAsync(controller.register.bind(controller)));

/**
 * @swagger
 * api/auth/{id}:
 *   delete:
 *     summary: Deleta usuário
 *     description: Apenas ADMIN pode deletar usuários
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser deletado
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       403:
 *         description: Sem permissão
 */
router.delete("/:id", authMiddleware, authorize("ADMIN"), catchAsync(controller.delete.bind(controller)));

export default router;