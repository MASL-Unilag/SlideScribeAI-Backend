import { InvalidFileExtension, RequestFileContents } from "../../../../core";
import { ExtensionExtractorsRegistry } from "../engines";
import { FileExtractorEngine } from "../engines/engine";
import * as path from "node:path";

export class FileManager {
  private _extractorEngine: FileExtractorEngine;

  async extractFileContents(file: RequestFileContents): Promise<any> {
    const contents = await this._getFileContents(file);
    return contents;
  }

  static fileUploadConfigurations(): Readonly<Record<any, any>> {
    return {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
      fileFilter(req: any, file: any, callback: any) {
        const fileExtension = FileManager.getFileExtension(file);
        const isValidExtension =
          FileManager.isValidFileExtension(fileExtension);
        if (isValidExtension) {
          callback(null, true);
          return;
        }
        callback(
          new InvalidFileExtension(
            `Invalid file extension. Extension[${fileExtension}]`,
          ),
        );
      },
    };
  }

  static isValidFileExtension(extension: string): boolean {
    return [".pdf", ".txt", ".docx", ".doc"].includes(extension);
  }

  static getFileExtension(file: any): string {
    return path.extname(file.originalname!);
  }

  private async _getFileContents(file: RequestFileContents) {
    this._extractorEngine = ExtensionExtractorsRegistry[file.mimetype!];
    return this._extractorEngine.extract(
      file.bufferContents!,
    ) as unknown as any[];
  }
}
