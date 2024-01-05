import { Router } from "express";
import * as multer from "multer";
import { controlHandler } from "../../core";
import { FileManager } from "../components";
import { slideGenerator } from "../slide-generation-module";
import { generateSlideSchmea } from "./schema";

export const slidesRouter = Router();

const fileUploadOptions: multer.Options = {
  storage: multer.memoryStorage(),
  ...FileManager.fileUploadConfigurations(),
};

const uploadManager = multer(fileUploadOptions);

slidesRouter
  .use(uploadManager.single("file"))
  .post(
    "/generate",
    controlHandler.handle(slideGenerator.generate, generateSlideSchmea),
  );
