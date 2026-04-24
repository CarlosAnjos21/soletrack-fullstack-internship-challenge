import { Router } from "express";
import { ProductionOrderController } from "../controllers/productionOrder.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ProductionOrderController();

const catchAsync =
  (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * 🔐 AUTH GLOBAL
 */
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Production
 *   description: Gestão de ordens de produção de calçados
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar ordem de produção
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variant_id
 *               - size_id
 *               - quantity_planned
 *             properties:
 *               variant_id:
 *                 type: string
 *               size_id:
 *                 type: string
 *               quantity_planned:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ordem criada com sucesso
 */
router.post(
  "/",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.create),
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar ordens de produção
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ordens
 */
router.get("/", catchAsync(controller.findAll));

/**
 * @swagger
 * /api/orders/dashboard:
 *   get:
 *     summary: Dashboard de produção
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas de produção
 */
router.get("/dashboard", catchAsync(controller.dashboard));

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Atualizar status da ordem
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/status",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.updateStatus),
);

/**
 * @swagger
 * /api/orders/{id}/produce:
 *   patch:
 *     summary: Atualizar produção incremental
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/produce",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.updateProduced),
);

/**
 * @swagger
 * /api/orders/{id}/reset:
 *   patch:
 *     summary: Resetar produção
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/reset",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.resetProduction),
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Excluir ordem (apenas PLANNED)
 *     tags: [Production]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authorize("ADMIN"),
  catchAsync(controller.delete),
);

export default router;