import { Router } from "express";
import * as multer from "multer";
import { controlHandler } from "../../core";

export const slidesRouter = Router();

const slidesRateLimiter: any = ""; //TODO:

const uploadManager = multer({ storage: multer.memoryStorage() });

slidesRouter
  .use(slidesRateLimiter)
  .use(uploadManager.single("file"))
  .post("generate", controlHandler.handle("" as any));
