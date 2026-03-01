import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login.bind(controller));

router.post(
  "/register",
  authMiddleware,
  authorize("ADMIN"),
  controller.register.bind(controller),
);

export default router;


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas relacionadas à autenticação de usuários
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login de um usuário
 *     description: Autentica um usuário usando email e senha. Retorna um token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Dados do usuário para login
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/login", controller.login.bind(controller));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um usuário novo. Apenas ADMIN pode registrar novos usuários.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Dados do novo usuário
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
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
 *                 enum: [ADMIN, OPERATOR, USER]
 *                 example: USER
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       403:
 *         description: Sem permissão (não ADMIN)
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/register", authMiddleware, authorize("ADMIN"), controller.register.bind(controller));