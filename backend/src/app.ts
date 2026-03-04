import "express-async-errors";
import express, { Application } from "express";
import "dotenv/config";
import cors, { CorsOptions } from "cors";

import router from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { setupSwagger } from "./swagger";

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

setupSwagger(app);

app.use("/api", router);

app.get("/", (req, res) => res.send("🟢 API funcionando!"));

app.use(errorMiddleware);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  console.log(`📄 Swagger docs em http://localhost:${PORT}/api-docs`);
});

export default app;