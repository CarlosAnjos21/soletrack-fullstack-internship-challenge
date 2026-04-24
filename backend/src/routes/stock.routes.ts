import { Router } from "express";
import { StockController } from "../controllers/stock.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new StockController();

/**
 * WRAPPER PADRÃO
 */
const catchAsync =
  (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * 🔐 AUTH GLOBAL
 */
router.use(authMiddleware);

/**
 * 📦 STOCK
 */
router.get(
  "/",
  catchAsync(controller.findAll),
);

router.patch(
  "/",
  authorize("ADMIN", "OPERATOR"),
  catchAsync(controller.updateQuantity),
);

export default router;