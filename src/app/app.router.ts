import { Request, Router, Response } from "express";

import { HttpStatus } from "../core";
import { authRouter, currentUser } from "../auth";
import { slidesRouter } from "../slides-generation/routes";
import { contentRouter } from "../content/routes";

export const appRouter = Router();

appRouter.get("/health", (_: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    message: "API ok",
    version: "1.0",
  });
});

appRouter
  .use("/auth", authRouter)
  .use(currentUser.handle)
  .use("/slides", slidesRouter)
  .use("/content", contentRouter);
