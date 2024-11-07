import swaggerJSDoc, { Options } from "swagger-jsdoc";
import path from "path";
import { config } from "../config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "pizza delivery app",
    version: "1.0.0",
    description: "pizza delivery apis",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: `${config.SWAGGER_URL}`,
    },
  ],
};

let controllersExt = ".js";

if (config.NODE_ENV === "development") {
  controllersExt = ".ts";
}

const options: Options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, "../controllers/v1/*") + controllersExt],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
