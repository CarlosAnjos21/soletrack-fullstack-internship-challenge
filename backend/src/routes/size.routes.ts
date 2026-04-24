import { Router } from "express";
import { SizeController } from "../controllers/size.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new SizeController();

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
 * 📏 SIZES
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

export default router;