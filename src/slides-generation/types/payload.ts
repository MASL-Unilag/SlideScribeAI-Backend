import { ContextTypes, RequestFileContents } from "../../core";

export enum SlideOutputStyle {
  BULLET_POINT = "bullet-points",
  SHORT_PARAGRAPHS = "short-paragraphs"
}

export enum OutputLanguage {
  ENG = "english",
  YOR = "yoruba",
  IGB = "igbo",
  HAU = "hausa",
}

export interface FileUploadPayload extends ContextTypes {
  file: RequestFileContents;
  input: {
    topic: string;
    noOfPages: number;
    context: string; // math, english, engineering.
    includeImages: boolean // defaults to false.
    outputStyle: SlideOutputStyle,
    limitedTo: number //defaults.10 pages.
    outputLanguage: OutputLanguage 
  }
}
