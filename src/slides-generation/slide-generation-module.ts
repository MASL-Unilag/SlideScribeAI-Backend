import { Slides } from "./models";
import { GenerateSlides } from "./services";
import { RetrieveSlide } from "./services/retrieve.slide";
import { GenerateAllSlides } from "./services";

export const slideGenerator = new GenerateSlides(Slides);
export const slideFinder = new RetrieveSlide(Slides);
export const slideRetriever  = new GenerateAllSlides() 