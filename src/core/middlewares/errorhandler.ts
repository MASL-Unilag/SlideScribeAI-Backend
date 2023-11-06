import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors";
import { logger } from "../logging";
import { HttpStatus } from "../utils";

export class ErrorHandler {
  handle = async (
    error: Error,
    req: Request,
    res: Response,
    _: NextFunction,
  ) => {
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "internal server error";

    if (error instanceof ApiError) {
      logger.error("Error in middleware", error);
      statusCode = error.statusCode;
      message = error.message;
    }

    if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) logger.error(error);
    res.status(statusCode).send({
      status: false,
      error: message,
      endpoint: req.url.trim(),
      method: req.method,
      timestamp: new Date().toDateString(),
    });
  };
}
