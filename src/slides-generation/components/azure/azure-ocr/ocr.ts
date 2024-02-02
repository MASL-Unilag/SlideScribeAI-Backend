import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { config } from "../../../../core";

export const ocrCredential = new AzureKeyCredential(config.azure.ocr.key);
