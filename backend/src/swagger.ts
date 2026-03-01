import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API da Fábrica de Sapatos",
      version: "1.0.0",
      description: "Documentação das rotas de Auth, Orders e Shoe Models",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  // Aqui dizemos onde o Swagger vai procurar os comentários das rotas
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};