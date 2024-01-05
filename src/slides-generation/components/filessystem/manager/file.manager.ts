import {
  FileExtractionError,
  InvalidFileMimeType,
  RequestFileContents,
  config,
} from "../../../../core";
import { ExtensionExtractorsRegistry } from "../engines";
import { FileExtractorEngine } from "../engines/engine";
import * as path from "node:path";
import * as mime from "mime-types";
import { openai } from "../../openai";
import { ChatRequestMessage, ImageGenerationData } from "@azure/openai";
import { FileUploadPayload } from "../../../types";
import { ImageGeneratorEngine } from "../images";

export type SlideGenerationInputType = {
  options: FileUploadPayload["input"];
};

export class FileManager {
  private _extractorEngine: FileExtractorEngine;
  private _documentContents: string;
  private _imageEgine: ImageGeneratorEngine;

  constructor(private readonly file: RequestFileContents) {
    this._imageEgine = new ImageGeneratorEngine(openai);
  }

  private async _getFileContents(file: RequestFileContents) {
    this._extractorEngine = ExtensionExtractorsRegistry[file.mimetype!];

    return (await this._extractorEngine.extract(
      file.bufferContents!,
    )) as unknown as string;
  }

  enhanceFileContents(): FileManager {
    // return this._documentContents;
    return this;
  }

  async generateSlideContents({ options }: SlideGenerationInputType) {
    if (!this.documentContentsIsDefined()) {
      this._documentContents = await this._getFileContents(this.file);
    }

    const prompt = ` Generate a comprehensive set of contents  and its summary with the following options:
        - Topic: ${options.topic}
        - Context: ${options.context}
        - Output Style: ${options.outputStyle}
        - Output language: ${options.outputLanguage}
  
      Include the following content:
      "${this._documentContents}"

      Ensure the generated content is clear, concise, and visually appealing.
    `;

    const messages: ChatRequestMessage[] = [
      {
        role: "system",
        content: "You're a helpful content generator.",
      },
      {
        role: "system",
        content: prompt,
      },
    ];

    try {
      const response = await openai.getChatCompletions(
        config.openai.textDeploymentName,
        messages,
        {
          responseFormat: {
            type: "text",
          },
        },
      );

      const content = response.choices[0].message?.content!;

      if (!options.includeImages) return { content };

      const generatedImagesUrl = (await this._imageEgine.generate(
        `${options.context} ${options.topic}`,
      )) as ImageGenerationData["url"][];
      return { content, generatedImagesUrl };
    } catch (error: any) {
      console.log({ error });
      throw new FileExtractionError("Error generating slide.");
    }
  }

  private documentContentsIsDefined(): boolean {
    return !!this._documentContents;
  }

  static fileUploadConfigurations(): Readonly<Record<any, any>> {
    return {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
      fileFilter(_: any, file: any, callback: any) {
        const fileExtension = FileManager.getFileExtension(file);
        const fileMimeType = FileManager.getFileMimeType(fileExtension);

        const isValidFile = FileManager.isValidFile(fileMimeType);
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
