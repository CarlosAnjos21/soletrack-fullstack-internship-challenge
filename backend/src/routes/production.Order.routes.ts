import { Router } from "express";
import { ProductionOrderController } from "../controllers/productionOrder.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ProductionOrderController();

router.use(authMiddleware);

router.post(
  "/",
  authorize("ADMIN", "OPERATOR"),
  controller.create.bind(controller),
);

router.get("/", controller.findAll.bind(controller));

router.patch(
  "/:id/status",
  authorize("ADMIN", "OPERATOR"),
  controller.updateStatus.bind(controller),
);

router.patch(
  "/:id/produce",
  authorize("ADMIN", "OPERATOR"),
  controller.updateProduced.bind(controller),
);

export default router;


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Rotas para gerenciar ordens de produção de sapatos
 */

/**
 * @swagger
 * /orders/:
 *   post:
 *     summary: Cria uma nova ordem de produção
 *     description: Apenas usuários ADMIN ou OPERATOR podem criar ordens.
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
 *               - modelId
 *               - quantity
 *             properties:
 *               modelId:
 *                 type: string
 *                 example: "64f8b2c1e9a2f1234567890a"
 *               quantity:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Ordem criada com sucesso
 *       403:
 *         description: Sem permissão
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", authorize("ADMIN", "OPERATOR"), controller.create.bind(controller));

/**
 * @swagger
 * /orders/:
 *   get:
 *     summary: Lista todas as ordens de produção
 *     description: Qualquer usuário autenticado pode listar as ordens.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ordens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   modelId:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   produced:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [PENDING, IN_PROGRESS, DONE]
 */
router.get("/", controller.findAll.bind(controller));

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma ordem
 *     description: Apenas ADMIN ou OPERATOR podem atualizar o status.
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
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, DONE]
 *         description: Novo status da ordem
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Ordem não encontrada
 */
router.patch("/:id/status", authorize("ADMIN", "OPERATOR"), controller.updateStatus.bind(controller));

/**
 * @swagger
 * /orders/{id}/produce:
 *   patch:
 *     summary: Atualiza a quantidade produzida de uma ordem
 *     description: Apenas ADMIN ou OPERATOR podem atualizar a produção.
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
 *       - in: query
 *         name: produced
 *         required: true
 *         schema:
 *           type: number
 *         description: Quantidade produzida
 *     responses:
 *       200:
 *         description: Produção atualizada com sucesso
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Ordem não encontrada
 */
router.patch("/:id/produce", authorize("ADMIN", "OPERATOR"), controller.updateProduced.bind(controller));