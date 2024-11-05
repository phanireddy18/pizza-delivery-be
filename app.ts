import express, { Express } from "express";
import { MainServer } from "./server";
import { databaseConnection } from "./database";

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: MainServer = new MainServer(app);
    databaseConnection();
    server.start();
  }
}
const application: Application = new Application();
application.initialize();
