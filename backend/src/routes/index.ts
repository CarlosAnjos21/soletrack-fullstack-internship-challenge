import { Router } from "express";
import authRoutes from "./auth.routes";
import productionOrderRoutes from "./production.Order.routes";
import shoeModelRoutes from "./shoeModel.routes";
import userRoutes from "./users.routes";

const router = Router();

router.use("/orders", productionOrderRoutes);
router.use("/models", shoeModelRoutes);
router.use("/auth", authRoutes);
router.use("/users",userRoutes);

export default router;
