import { Router } from "express";
import authRoutes from "./auth.routes";
import productionOrderRoutes from "./production.Order.routes";
import shoeModelRoutes from "./shoeModel.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/orders", productionOrderRoutes);
router.use("/models", shoeModelRoutes);

export default router;
