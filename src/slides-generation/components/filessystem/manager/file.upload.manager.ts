import { InvalidFileMimeType } from "../../../../core";
import * as path from "node:path";
import * as mime from "mime-types";

export class FileUploadManagerConfig {
  static fileUploadConfigurations(): Readonly<Record<any, any>> {
    return {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
      fileFilter(_: any, file: any, callback: any) {
        const fileExtension = FileUploadManagerConfig.getFileExtension(file);
        const fileMimeType = FileUploadManagerConfig.getFileMimeType(fileExtension);

        const isValidFile = FileUploadManagerConfig.isValidFile(fileMimeType);
        if (isValidFile) {
          callback(null, true);
          return;
        }
        callback(
          new InvalidFileMimeType(
            `Invalid file. Extension[${fileExtension}], Mime[${fileMimeType}]`,
          ),
        );
      },
    };
  }

  static isValidFile(mime: string): boolean {
    return [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/webp"
    ].includes(mime);
  }

  static getFileExtension(file: any): string {
    return path.extname(file.originalname!);
  }

  static getFileMimeType(extension: string): string {
    const type = mime.lookup(extension);
    if (!type) {
      throw new InvalidFileMimeType(
        `Not supported file mime type: Mime[${extension}]`,
      );
    }
    return type;
  }
}