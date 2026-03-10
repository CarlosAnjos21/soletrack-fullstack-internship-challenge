import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

export function setupSwagger(app: Application) {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "API Sistema de Produção de Calçados",
        version: "1.0.0",
        description: "Documentação da API com Swagger",
      },
      servers: [
        {
          url: "http://localhost:3000/api",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Insira o token JWT no formato: Bearer {token}",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: [path.join(__dirname, "./routes/*.{ts,js}")],
  };

  const specs = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}