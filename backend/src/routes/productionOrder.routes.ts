import { Router } from "express";
import { ProductionOrderController } from "../controllers/productionOrder.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ProductionOrderController();

/**
 * WRAPPER TIPADO (sem bind + mais limpo)
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
 *   name: Production
 *   description: Gestão de ordens de produção
 */

/**
 * 📦 ORDENS
 */
router.post(
  "/",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.create),
);

router.get(
  "/",
  catchAsync(controller.findAll),
);

/**
 * 📊 DASHBOARD
 */
router.get(
  "/dashboard",
  catchAsync(controller.dashboard),
);

/**
 * 🔄 STATUS / PRODUÇÃO
 */
router.patch(
  "/:id/status",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.updateStatus),
);

router.patch(
  "/:id/produce",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.updateProduced),
);

router.patch(
  "/:id/reset",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.resetProduction),
);

/**
 * ❌ DELETE
 */
router.delete(
  "/:id",
  authorize("ADMIN"),
  catchAsync(controller.delete),
);

export default router;