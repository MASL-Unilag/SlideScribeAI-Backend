import { Router } from "express";
import multer from "multer";
import { controlHandler } from "../../core";
import { FileManager } from "../components";
import { slideFinder, slideGenerator } from "../slide-generation-module";
import { generateSlideSchema, retrieveUserSlideSchema, retrieveSlideSchema } from "./schema";
import { slideRetriever } from "../slide-generation-module";

export const slidesRouter = Router();

const fileUploadOptions: multer.Options = {
  storage: multer.memoryStorage(),
  ...FileManager.fileUploadConfigurations(),
};

const uploadManager = multer(fileUploadOptions);

slidesRouter
  .use(uploadManager.single("file"))
  .get(
    "/",
    controlHandler.handle(
      slideRetriever.retrieveSlidesForUser,
      retrieveUserSlideSchema,
    ),
  )
  .get("/:id", controlHandler.handle(slideFinder.handle, retrieveSlideSchema))
  .post(
    "/generate",
    controlHandler.handle(slideGenerator.generate, generateSlideSchema),
  );