
import { FileExtractorEngine } from "./engine";


export class PDFExtractorEngine implements FileExtractorEngine {

  public readonly extension: string = "application/pdf";

  extract(bufferContents: Buffer): Promise<any> {
    throw new Error("Method not implemented.");
  }
}