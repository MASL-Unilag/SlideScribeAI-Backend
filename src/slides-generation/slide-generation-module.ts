import { Slides } from "./models";
import { GenerateSlides } from "./services";
import { RetrieveSlide } from "./services/retrieve.slide";

export const slideGenerator = new GenerateSlides(Slides);
export const slideFinder = new RetrieveSlide(Slides);
