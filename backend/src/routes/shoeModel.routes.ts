import { Router } from "express";
import { ShoeModelController } from "../controllers/shoeModel.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ShoeModelController();
const catchAsync = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: Rotas para gerenciar modelos de sapatos
 */

/**
 * @swagger
 * /api/models:
 *   post:
 *     summary: Cria um novo modelo de sapato
 *     tags: [Models]
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
 *               - category
 *               - base_cost
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tênis Esportivo"
 *               category:
 *                 type: string
 *                 example: "Esportivo"
 *               base_cost:
 *                 type: number
 *                 example: 120
 *     responses:
 *       201:
 *         description: Modelo criado com sucesso
 */
router.post("/", authorize("ADMIN"), catchAsync(controller.create.bind(controller)));

/**
 * @swagger
 * /api/models:
 *   get:
 *     summary: Lista todos os modelos de sapato
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de modelos
 */
router.get("/", catchAsync(controller.findAll.bind(controller)));

/**
 * @swagger
 * /api/models/{id}:
 *   put:
 *     summary: Atualiza um modelo de sapato
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               base_cost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Modelo atualizado com sucesso
 */
router.put("/:id", authorize("ADMIN"), catchAsync(controller.update.bind(controller)));

/**
 * @swagger
 * /api/models/{id}:
 *   delete:
 *     summary: Deleta um modelo de sapato
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Modelo deletado com sucesso
 */
router.delete("/:id", authorize("ADMIN"), catchAsync(controller.delete.bind(controller)));

export default router;