import pptxgen from "pptxgenjs";
import { DocumentCategory } from "../../../types";

export type SlideGenerationInput = {
  options: any;
  slideId: string;
  docCategory: typeof DocumentCategory
  extractedContents?: string
};


export interface PowerPointSlideStyles extends pptxgen.TextPropsOptions {}

export type Slide = {
  title: string;
  content: pptxgen.Slide;
};

export interface Presentation {
  name: string;
  slides: Record<
    number, // the slide page number.
    Slide
  >;
}

export interface StreamOptions {
  shouldCompress?: boolean;
}

export interface SlideProperties {
  title?: string;
  content: string;
  imageUrl?: string;
  sectionTitle?: string;
}

export interface SlideOptions {
  slideNumber?: number;
  styles: PowerPointSlideStyles;
}

export interface ImageOptions {
  imageURL: string;
  placeholder?: string;
}
