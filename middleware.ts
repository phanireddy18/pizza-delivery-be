import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { config } from "./config";

export interface IAuthPayload {
  userId: number;
  username: string;
  email: string;
  iat?: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload;
    }
  }
}

class Middleware {
  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new Error("Token is not available. Please login again."));
    }
    try {
      const payload = verify(token, `${config.JWT_SECRET}`) as JwtPayload;
      req.currentUser = payload as IAuthPayload;
      next();
    } catch (error) {
      next(new Error("Invalid token. Please login again."));
    }
  }

  public checkAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!req.currentUser) {
      return next(
        new Error("Authentication is required to access this route.")
      );
    }
    next();
  }
}

export const middleware = new Middleware();
