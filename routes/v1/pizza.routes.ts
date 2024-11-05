import express, { Router } from "express";
import { PizzaController } from "../../controllers/v1/pizzas.controller";
import { middleware } from "../../middleware";
import { OrdersController } from "../../controllers/v1/orders.controller";

class PizzaRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.use(middleware.checkAuthentication);
    // Pizza Related APIs
    this.router.get(
      "/pizzas",

      PizzaController.getAllPizzas
    );
    this.router.get("/pizzas/:id", PizzaController.getPizzaById);

    //Order Related APIs
    this.router.post("/orders", OrdersController.createOrder);

    this.router.get("/orders/:id", OrdersController.getOrderDetailsByOrderId);

    this.router.get(
      "/orders/user/:userId",
      OrdersController.getAllOrdersForUser
    );

    return this.router;
  }
}

export const pizzaRoutes: PizzaRoutes = new PizzaRoutes();
