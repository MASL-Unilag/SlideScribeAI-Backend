import { model } from "mongoose";
import { slideSchema } from "./slide.schema";
import mongoose from "mongoose";

export const Slides = model('Slides', slideSchema);
export type SlideRepository = typeof Slides;