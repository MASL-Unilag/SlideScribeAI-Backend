import { Context, FileManager } from "../../core";
import { FileUploadPayload } from "../types";

export class GenerateSlides {
  constructor() {}

  extract = async ({ file }: Context<FileUploadPayload>) => {
    const fileManager = new FileManager();
    const fileContents = await fileManager.extractFileContents([file]);
  };
}
