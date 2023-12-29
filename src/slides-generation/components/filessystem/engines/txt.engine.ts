import { FileExtractorEngine } from "./engine";


export class TxtExtractorEngine implements FileExtractorEngine {

  public readonly extension: string = "text/text"; //TODO: check this.


  extract(bufferContents: Buffer): Promise<any> {
    throw new Error("Method not implemented.");
  }
}