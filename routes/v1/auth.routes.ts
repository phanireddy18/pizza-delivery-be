import express, { Router } from "express";
import { AuthController } from "../../controllers/v1/auth.controller";

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    // Auth Related APIs
    this.router.post("/register", AuthController.create);
    this.router.post("/login", AuthController.login);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
