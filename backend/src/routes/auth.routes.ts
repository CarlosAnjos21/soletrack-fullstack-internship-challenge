import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.post("/register", authMiddleware, authorize("ADMIN"), controller.register);
//router.post("/register", controller.register);

export default router;