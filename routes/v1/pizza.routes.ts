import express, { Router } from "express";
import { AuthController } from "../../controllers/v1/auth.controller";
import { PizzaController } from "../../controllers/v1/pizza.controller";
import { middleware } from "../../middleware";

class PizzaRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    // Auth Related APIs
    this.router.use(middleware.checkAuthentication);
    this.router.get(
      "/pizzas",

      PizzaController.getAllPizzas
    );
    this.router.get("/pizzas/:id", AuthController.login);

    return this.router;
  }
}

export const pizzaRoutes: PizzaRoutes = new PizzaRoutes();
