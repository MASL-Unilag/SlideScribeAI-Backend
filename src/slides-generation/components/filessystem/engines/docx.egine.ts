import { FileExtractorEngine } from "./engine";


export class DocxExtractorEngine implements FileExtractorEngine {

  public readonly extension: string = "text/docx";

  extract(bufferContents: Buffer): Promise<any> {
    throw new Error("Method not implemented.");
  }
}