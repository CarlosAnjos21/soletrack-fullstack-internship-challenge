import express from "express";
import "dotenv/config";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});