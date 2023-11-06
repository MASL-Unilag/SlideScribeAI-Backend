import { Router } from "express";
import { authRateLimiter, controlHandler } from "../../core";
import { signIn } from "../auth.module";
import { signInSchema } from "./schema";

export const authRouter = Router();

authRouter
  .use(authRateLimiter)
  .use("/sign", controlHandler.handle(signIn.handle, signInSchema));
