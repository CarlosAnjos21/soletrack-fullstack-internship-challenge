import { Router } from "express";
import { ShoeModelController } from "../controllers/shoeModel.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ShoeModelController();

router.use(authMiddleware);

router.post("/", authorize("ADMIN"), controller.create.bind(controller));

router.get("/", controller.findAll.bind(controller));

router.put("/:id", authorize("ADMIN"), controller.update.bind(controller));

router.delete("/:id", authorize("ADMIN"), controller.delete.bind(controller));

export default router;


/**
 * @swagger
 * tags:
 *   name: Models
 *   description: Rotas para gerenciar modelos de sapatos
 */

/**
 * @swagger
 * /models/:
 *   post:
 *     summary: Cria um novo modelo
 *     description: Apenas ADMIN pode criar modelos.
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
 *               - size
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tênis Esportivo"
 *               size:
 *                 type: number
 *                 example: 42
 *               color:
 *                 type: string
 *                 example: "Preto"
 *     responses:
 *       201:
 *         description: Modelo criado com sucesso
 *       403:
 *         description: Sem permissão
 */
router.post("/", authorize("ADMIN"), controller.create.bind(controller));

/**
 * @swagger
 * /models/:
 *   get:
 *     summary: Lista todos os modelos
 *     description: Qualquer usuário autenticado pode listar os modelos.
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de modelos
 */
router.get("/", controller.findAll.bind(controller));

/**
 * @swagger
 * /models/{id}:
 *   put:
 *     summary: Atualiza um modelo existente
 *     description: Apenas ADMIN pode atualizar modelos.
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do modelo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tênis Casual"
 *               size:
 *                 type: number
 *                 example: 41
 *               color:
 *                 type: string
 *                 example: "Branco"
 *     responses:
 *       200:
 *         description: Modelo atualizado com sucesso
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Modelo não encontrado
 */
router.put("/:id", authorize("ADMIN"), controller.update.bind(controller));

/**
 * @swagger
 * /models/{id}:
 *   delete:
 *     summary: Deleta um modelo
 *     description: Apenas ADMIN pode deletar modelos.
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do modelo
 *     responses:
 *       200:
 *         description: Modelo deletado com sucesso
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Modelo não encontrado
 */
router.delete("/:id", authorize("ADMIN"), controller.delete.bind(controller));