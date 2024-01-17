import {
  FileExtractionError,
  InvalidFileMimeType,
  RequestFileContents,
  config,
} from "../../../../core";
import { ExtensionExtractorsRegistry } from "../engines";
import { FileExtractorEngine } from "../engines/engine";
import { openai } from "../../azure";
import { FileUploadPayload } from "../../../types";
import { ImageGeneratorEngine } from "../images";
import { PowerPointManager } from "../powerpointgen";

import * as path from "node:path";
import * as mime from "mime-types";
import pptxgen from "pptxgenjs";
import { ChatRequestMessage, ImageGenerationData } from "@azure/openai";
import { FileUploadManager } from "../uploader";
import { containerClient } from "../../azure";
import { SlideGenerationStatus, SlideRepository } from "../../../models";

export type SlideGenerationInput = {
  options: FileUploadPayload["input"];
  slideId: string;
};

export class FileManager {
  private _extractorEngine: FileExtractorEngine;
  private _imageEngine: ImageGeneratorEngine;
  private _powerPointEngine: PowerPointManager;
  private _documentContents: string;

  constructor(
    private readonly file: RequestFileContents,
    private readonly slideRepo: SlideRepository,
  ) {
    const pptxGen = new pptxgen();
    this._powerPointEngine = new PowerPointManager(
      pptxGen,
      file.originalFileName! ?? "me",
    );
    this._imageEngine = new ImageGeneratorEngine(openai);
  }

  private async _getFileContents(file: RequestFileContents) {
    this._extractorEngine = ExtensionExtractorsRegistry[file.mimetype!];

    return (await this._extractorEngine.extract(
      file.bufferContents!,
    )) as unknown as string;
  }

  async generateSlideContents({ options, slideId }: SlideGenerationInput) {
    if (!this.documentContentsIsDefined()) {
      this._documentContents = await this._getFileContents(this.file);
    }

    const prompt = ` Generate a comprehensive set of slide notes with the following options:
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

      const generatedImagesUrl = (await this._imageEngine.generate(
        `${options.context} ${options.topic}`,
      )) as ImageGenerationData["url"][];

      this._powerPointEngine.addSlide(
        { title: options.topic, content, imageUrl: generatedImagesUrl[0]! },
        {
          styles: {
            italic: false,
            breakLine: true,
            softBreakBefore: true,
            tabStops: [{ position: 1 }, { position: 3 }],
          },
        },
      );

      const presentationBufferFile = await this._powerPointEngine.toStream();
      const uploader = new FileUploadManager(containerClient);

      const presentationUrl = await uploader.upload(
        presentationBufferFile.stream as ArrayBuffer,
        options.topic,
      );

      const slide = await this.slideRepo.findOneAndUpdate(
        {
          _id: slideId,
        },
        {
          $set: {
            status: SlideGenerationStatus.COMPLETED,
            file: presentationUrl,
            originalContentFromUploadedDoc: this._documentContents,
          },
        },
        {
          new: true,
        },
      );

      console.log(slide);
      console.log(presentationUrl);

      return presentationUrl;
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
