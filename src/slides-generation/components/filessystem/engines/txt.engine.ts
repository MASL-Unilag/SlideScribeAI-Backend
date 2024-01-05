import { FileExtractorEngine } from "./engine";
import * as fs from "node:fs";

export class TxtExtractorEngine implements FileExtractorEngine {
  public readonly extension: string = "text/text";

  async extract(bufferContents: Buffer): Promise<any> {
    return bufferContents.toString("utf8");
  }
}