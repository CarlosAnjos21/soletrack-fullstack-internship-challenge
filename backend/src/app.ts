import "express-async-errors";
import express, { Application } from "express";
import "dotenv/config";
import cors, { CorsOptions } from "cors";
import helmet, { crossOriginResourcePolicy } from "helmet";

import router from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { setupSwagger } from "./swagger";

const app: Application = express();

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// middlewares

const corsOptions: CorsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const color = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
    console.log(
      `${color}${req.method}\x1b[0m ${req.originalUrl} → ${res.statusCode} (${ms}ms)`,
    );
  });
  next();
});

// rotas
setupSwagger(app);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", router);

// erro global (sempre por último)
app.use(errorMiddleware);

// servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  console.log(`📄 Swagger em     http://localhost:${PORT}/api-docs`);
});

function gracefulShutdown(signal: string): void {
  console.log(`\n⚠️  Sinal ${signal} recebido. Encerrando...`);
  server.close(() => {
    console.log("✅ Servidor encerrado.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("❌ unhandledRejection:", reason);
});

export default app;
