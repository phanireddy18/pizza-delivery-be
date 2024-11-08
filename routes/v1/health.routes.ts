import { Health } from "../../controllers/v1/health.controller";
import express, { Router } from "express";

class HealthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get("/health", Health);
    return this.router;
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();
