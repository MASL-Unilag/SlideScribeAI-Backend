import { ContextTypes, RequestFileContents } from "../../core";
import { DocumentCategory, OutputLanguage, SlideOutputStyle } from "./types";



export interface FileUploadPayload extends ContextTypes {
  file: RequestFileContents;
  input: {
    topic: string;
    noOfPages: number;
    context: string; // math, english, engineering.
    includeImages: boolean; // defaults to false.
    outputStyle: SlideOutputStyle;
    limitedTo: number; //defaults.10 pages.
    outputLanguage: OutputLanguage;
    outputDocumentName: string;
    incomingDocumentCategory: typeof DocumentCategory; // ocr,plain or audio
  };
}

export interface RetrieveSlidePayload extends ContextTypes {
  params: {
    id: string;
  }
}

export interface RetrieveAllSlidePayload extends ContextTypes {
  user: {
    id: string;
    email: string;
  };
}