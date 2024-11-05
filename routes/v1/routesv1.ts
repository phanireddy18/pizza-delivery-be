import { Application } from "express";
import { healthRoutes } from "./health.routes";
import { authRoutes } from "./auth.routes";
import { pizzaRoutes } from "./pizza.routes";
import { middleware } from "../../middleware";

const BASE_PATH = "/api/v1";

export const appRoutes = (app: Application): void => {
  app.use("", healthRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());

  //Protected Routes
  app.use(middleware.verifyUser);
  app.use(BASE_PATH, pizzaRoutes.routes());
};
