import { ContextTypes, RequestFileContents } from "../../core";

export interface FileUploadPayload extends ContextTypes {
  file: RequestFileContents;
}
