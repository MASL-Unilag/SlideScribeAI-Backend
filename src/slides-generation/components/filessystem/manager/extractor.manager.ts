import { RequestFileContents } from "../../../../core";
import { ExtensionExtractorsRegistry } from "../engines";
import { FileExtractorEngine } from "../engines/engine";

export class FileManager {
  private _extractorEngine: FileExtractorEngine;

  async extractFileContents(file: RequestFileContents): Promise<any> {
    const contents = await this._getFileContents(file);
    return contents;
  }

  private async _getFileContents(file: RequestFileContents) {
    this._extractorEngine = ExtensionExtractorsRegistry[file.mimetype!];
    return this._extractorEngine.extract(
      file.bufferContents!,
    ) as unknown as any[];
  }

  private async _formatParsedData(contents: any) {}
}
