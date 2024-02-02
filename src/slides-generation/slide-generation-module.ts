import { Slides } from "./models";
import { GenerateSlides } from "./services";
import { RetrieveSlide } from "./services/retrieve.slide";
import { RetrieveUserSlides } from "./services";

export const slideGenerator = new GenerateSlides(Slides);
export const slideFinder = new RetrieveSlide(Slides);
export const slideRetriever  = new RetrieveUserSlides(Slides); 