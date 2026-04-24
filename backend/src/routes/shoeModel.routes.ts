import { Router } from "express";
import { ShoeModelController } from "../controllers/shoeModel.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ShoeModelController();

/**
 * WRAPPER PADRÃO (sem bind + centralizado)
 */
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
 *   name: Models
 *   description: Gestão de modelos de calçados
 */

/**
 * 📦 MODELS
 */
router.post(
  "/",
  authorize("ADMIN"),
  catchAsync(controller.create),
);

router.get(
  "/",
  catchAsync(controller.findAll),
);

router.put(
  "/:id",
  authorize("ADMIN"),
  catchAsync(controller.update),
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  catchAsync(controller.delete),
);

export default router;