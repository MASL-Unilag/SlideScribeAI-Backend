import { Router } from "express";
import { controlHandler } from "../../core";
import { imageResult } from "../services/imagegeneration";
import * as express from "express";


export const contentRouter = Router();
contentRouter.use(express.json());


contentRouter
  .get("/getimage", controlHandler.handle(imageResult));
  