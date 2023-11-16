import { Router } from "express";
import { authRateLimiter, controlHandler } from "../../core";
import { signIn, signUp } from "../auth.module";
import { signInSchema, signUpSchema } from "./schema";
import * as express from "express";

export const authRouter = Router();
authRouter.use(express.json());

authRouter
  .use(authRateLimiter)
  .get("/sign", controlHandler.handle(signIn.handle, signInSchema))
  .post("/signup", controlHandler.handle(signUp.handle, signUpSchema));
  
