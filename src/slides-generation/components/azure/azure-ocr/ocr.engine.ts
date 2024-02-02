import {
  DocumentAnalysisClient,
  DocumentPage,
} from "@azure/ai-form-recognizer";
import { config } from "../../../../core";
import { ocrCredential } from "./ocr";

export class ObjectCharacterReaderEngine {
  private readonly _documentEngine: DocumentAnalysisClient;
  constructor() {
    this._documentEngine = new DocumentAnalysisClient(
      config.azure.ocr.endpoint,
      ocrCredential,
    );
  }

  process = async (fileBuffer: Buffer) => {
    const extractedContents = (
      await this._documentEngine.beginAnalyzeDocument(
        config.azure.ocr.model,
        fileBuffer,
      )
    ).getResult();
    extractedContents?.pages?.forEach((page: DocumentPage) => {
      console.log(page.lines);
    });

    return "";
  };
}
