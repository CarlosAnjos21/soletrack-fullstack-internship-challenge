import { Router } from "express";
import { ShoeVariantController } from "../controllers/shoeVariant.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new ShoeVariantController();

/**
 * WRAPPER PADRÃO (sem bind + tratamento de erro)
 */
const catchAsync =
  (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * 🔐 AUTH GLOBAL
 */
router.use(authMiddleware);

/**
 * 📦 VARIANTS
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

router.get(
  "/model/:model_id",
  catchAsync(controller.findByModel),
);

export default router;