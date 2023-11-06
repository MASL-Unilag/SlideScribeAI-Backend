import { Request, Router, Response } from "express";

import { HttpStatus } from "../core";
import { authRouter } from "../auth";
import { mailRouter } from "../mail-templates";

export const appRouter = Router();

appRouter.get("/health", (_: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    message: "API ok",
    version: "1.0",
  });
});

appRouter.use("/auth", authRouter).use("/send", mailRouter);
