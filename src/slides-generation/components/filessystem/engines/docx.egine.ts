import { FileExtractorEngine } from "./engine";
import * as mammoth from "mammoth";
import { FileExtractionError } from "../../../../core";

export class DocxExtractorEngine implements FileExtractorEngine {
  public readonly extension: string = "text/docx";

  extract(bufferContents: Buffer): Promise<any> {
    return mammoth
      .extractRawText({ buffer: bufferContents })
      .then((result) => {
        return result.value;
      })
      .catch((err) => {
        console.log({
          err,
        });
        throw new FileExtractionError("Error extracting file contents.");
      });
  }
}