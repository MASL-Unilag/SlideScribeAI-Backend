
import { FileExtractorEngine } from "./engine";
import extractor from "pdf-parse";

export class PDFExtractorEngine implements FileExtractorEngine {
  public readonly extension: string = "application/pdf";

  async extract(bufferContents: Buffer): Promise<any> {
    const contents = await extractor(bufferContents);
    return contents.text;
  }
}