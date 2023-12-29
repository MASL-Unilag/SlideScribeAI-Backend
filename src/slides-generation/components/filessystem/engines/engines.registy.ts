import { DocxExtractorEngine } from "./docx.egine";
import { FileExtractorEngine } from "./engine";
import { PDFExtractorEngine } from "./pdf.egine";
import { TxtExtractorEngine } from "./txt.engine";

export const ExtensionExtractorsRegistry: Record<string, FileExtractorEngine> =
  {
    "application/pdf": new PDFExtractorEngine(),
    "text/text": new TxtExtractorEngine(),
    "text/docx": new DocxExtractorEngine(),
  } as const;
