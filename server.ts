import http from "http";
import "express-async-errors";
import {
  Application,
  Request,
  Response,
  json,
  urlencoded,
  NextFunction,
} from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { appRoutes } from "./routes/v1/routesv1";
import { config } from "./config";
import swaggerSpec from "./util/swagger";
import swaggerUI from "swagger-ui-express";

const SERVER_PORT = `${config.SERVER_PORT}`;
export interface IAuthPayload {
  id: number;
  username: string;
  email: string;
  iat?: number;
  isAdmin?: boolean;
}
export class MainServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set("trust proxy", 1);
    app.use(
      cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }
  private standardMiddleware(app: Application): void {
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }

  private routesMiddleware(app: Application): void {
    if (process.env.NODE_ENV != "production") {
      app.use(
        "/api/v1/docs",
        swaggerUI.serve,
        swaggerUI.setup(swaggerSpec, {
          swaggerOptions: {
            persistAuthorization: true,
          },
        })
      );
    }
    appRoutes(app);
  }

  private errorHandler(app: Application): void {
    app.use("*", (req: Request, res: Response, next: NextFunction) => {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "The endpoint called does not exist." });
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      console.log(`Server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        console.log(`Main server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      console.log("startHttpServer() error method:", error);
    }
  }
}
