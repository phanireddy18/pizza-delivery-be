import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function Health(_req: Request, res: Response): void {
  res.status(StatusCodes.OK).send("Pizza service is healthy and OK.");
}
