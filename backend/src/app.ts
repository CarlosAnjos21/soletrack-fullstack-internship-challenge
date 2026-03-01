import "express-async-errors";
import express from "express";
import "dotenv/config";
import router from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());

app.use(router);

setupSwagger(app);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});