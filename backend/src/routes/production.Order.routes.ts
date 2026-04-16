import { Router } from "express";
import { ProductionOrderController } from "../controllers/productionOrder.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ProductionOrderController();

const catchAsync = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 🔐 AUTH GLOBAL
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestão de ordens de produção de calçados
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar nova ordem de produção
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
 *             properties:
 *               model_id:
 *                 type: string
 *               size:
 *                 type: number
 *               quantity_planned:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ordem criada com sucesso
 */
router.post(
  "/",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.create.bind(controller))
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar todas as ordens
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ordens
 */
router.get(
  "/",
  catchAsync(controller.findAll.bind(controller))
);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualizar status da ordem
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLANNED, IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch(
  "/:id/status",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.updateStatus.bind(controller))
);

/**
 * @swagger
 * /orders/{id}/produce:
 *   patch:
 *     summary: Atualizar quantidade produzida
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
 *         description: Produção atualizada
 */
router.patch(
  "/:id/produce",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.updateProduced.bind(controller))
);

/**
 * @swagger
 * /orders/{id}/reset:
 *   patch:
 *     summary: Resetar produção da ordem
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
 *       200:
 *         description: Ordem resetada com sucesso
 */
router.patch(
  "/:id/reset",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.resetProduction.bind(controller))
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Excluir ordem de produção
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
 *         description: Ordem excluída
 */
router.delete(
  "/:id",
  authorize("ADMIN"),
  catchAsync(controller.delete.bind(controller))
);

/**
 * @swagger
 * /orders/dashboard:
 *   get:
 *     summary: Dashboard de produção
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do dashboard
 */
router.get(
  "/dashboard",
  catchAsync(controller.dashboard.bind(controller))
);

export default router;