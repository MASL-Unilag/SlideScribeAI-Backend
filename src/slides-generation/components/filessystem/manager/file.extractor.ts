import { RequestFileContents } from "../../../../core";
import { ObjectCharacterReaderEngine } from "../../azure";
import { ExtensionExtractorsRegistry, FileExtractorEngine } from "../engines";

export class FileExtractor {
  private static _extractorEngine: FileExtractorEngine;
  private static _ocrEngine: ObjectCharacterReaderEngine;

  static extract = async (file: RequestFileContents) => {
    this.setEngine(file.mimetype!);

    return (await this._extractorEngine.extract(
      file.bufferContents!,
    )) as unknown as string;
  };

  static extractUsingOCR = async (file: RequestFileContents) => {
    return this._ocrEngine.process(file.bufferContents!);
  };

  static extractFromAudio = async (file: RequestFileContents) => {
    return "";
  }

  private static setEngine = (mimeType: string) => {
    this._extractorEngine = ExtensionExtractorsRegistry[mimeType];
  };
}
