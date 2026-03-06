import { Router } from "express";
import { ProductionOrderController } from "../controllers/productionOrder.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ProductionOrderController();

const catchAsync = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Rotas para gerenciar ordens de produção de sapatos
 */

/**
 * @swagger
 * api/orders:
 *   post:
 *     summary: Cria uma nova ordem de produção
 *     description: Apenas ADMIN ou OPERATOR podem criar ordens.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - model_id
 *               - size
 *               - quantity_planned
 *               - start_date
 *             properties:
 *               model_id:
 *                 type: string
 *                 example: "64f8b2c1e9a2f1234567890a"
 *               size:
 *                 type: number
 *                 example: 40
 *               quantity_planned:
 *                 type: number
 *                 example: 100
 *               start_date:
 *                 type: string
 *                 example: "2026-03-03"
 *     responses:
 *       201:
 *         description: Ordem criada com sucesso
 *       403:
 *         description: Sem permissão
 */
router.post("/", authorize("ADMIN", "OPERATOR"), catchAsync(controller.create.bind(controller)));

/**
 * @swagger
 * api/orders:
 *   get:
 *     summary: Lista todas as ordens de produção
 *     description: Qualquer usuário autenticado pode listar ordens. Aceita filtro opcional ?status=PLANNED|IN_PROGRESS|COMPLETED
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ordens
 */
router.get("/", catchAsync(controller.findAll.bind(controller)));

/**
 * @swagger
 * api/orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma ordem
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da ordem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["PLANNED", "IN_PROGRESS", "COMPLETED"]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch("/:id/status", authorize("ADMIN", "OPERATOR"), catchAsync(controller.updateStatus.bind(controller)));

/**
 * @swagger
 * api/orders/{id}/produce:
 *   patch:
 *     summary: Atualiza a quantidade produzida de uma ordem
 *     tags: [Orders]
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
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produção atualizada com sucesso
 */
router.patch("/:id/produce", authorize("ADMIN", "OPERATOR"), catchAsync(controller.updateProduced.bind(controller)));

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Deleta uma ordem de produção
 *     description: Apenas ordens PLANNED podem ser deletadas.
 *     tags: [Orders]
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
 *         description: Ordem deletada com sucesso
 */
router.delete("/:id", authorize("ADMIN"), catchAsync(controller.delete.bind(controller)));

export default router;