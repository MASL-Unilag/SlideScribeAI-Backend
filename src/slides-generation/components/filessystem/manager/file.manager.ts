import {
  FileExtractionError,
  InvalidFileMimeType,
  RequestFileContents,
  config,
} from "../../../../core";
import { ExtensionExtractorsRegistry } from "../engines";
import { FileExtractorEngine } from "../engines/engine";
import { openai } from "../../azure";
import { FileUploadPayload, OutputLanguage } from "../../../types";
import { ImageGeneratorEngine } from "../images";
import { PowerPointManager } from "../powerpointgen";

import * as path from "node:path";
import * as mime from "mime-types";
import pptxgen from "pptxgenjs";
import { ChatRequestMessage, ImageGenerationData } from "@azure/openai";
import { FileUploadManager } from "../uploader";
import { containerClient } from "../../azure";
import { SlideGenerationStatus, SlideRepository } from "../../../models";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type SlideGenerationInput = {
  options: any;
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

  private splitTextIntoPages = async (text: string) => {
    const slides: { title: string; content: string }[] = [];
    const sections = text.split("Slide ");

    for (const section of sections) {
      if (section.trim() !== "") {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const content = lines
          .slice(1)
          .map((line) => line.trim())
          .join("\n");

        slides.push({
          title,
          content,
        });
      }
    }

    return slides;
  };

  private _preparePromptMessages = (options: any) => {
    const prompt = ` Generate a comprehensive set of slide notes with the following options:
        - Topic: ${options.topic}
        - Context: ${options.context}
        - Output Style: ${options.outputStyle}
        - Output language: ${options.outputLanguage} [This is must be adhered to]
  
      Include the following content:
      "${this._documentContents}"

      Ensure the generated content is clear, concise, and visually appealing.
    `;

    return [
      {
        role: "system",
        content: "You're a helpful content generator.",
      },
      {
        role: "system",
        content: prompt,
      },
    ];
  };

  private _getCompletions = async (messages: ChatRequestMessage[]) => {
    const response = await openai.getChatCompletions(
      config.openai.textDeploymentName,
      messages,
      {
        responseFormat: {
          type: "text",
        },
      },
    );

    return response.choices[0].message?.content!;
  };

  async generateSlideContents({ options, slideId }: SlideGenerationInput) {
    if (!this.documentContentsIsDefined()) {
      this._documentContents = await this._getFileContents(this.file);
    }

    const messages: ChatRequestMessage[] = this._preparePromptMessages(
      options,
    ) as any;

    try {

      const content = await this._getCompletions(messages);
      const slides = await this.splitTextIntoPages(content);
      const pptxBuffer = await this.handlePPTXGeneration(slides);

      const uploader = new FileUploadManager(containerClient);
      const presentationUrl = await uploader.upload(
        pptxBuffer.stream as ArrayBuffer,
        `${options.topic}.pptx`,
      );

      await this._updateSlideDetails(slideId, presentationUrl);
    } catch (error: any) {
      console.log({ error });
      throw new FileExtractionError("Error generating slide.");
    }
  }

  private _updateSlideDetails = async (
    slideId: string,
    presentationUrl: string,
  ) => {
    await this.slideRepo.findOneAndUpdate(
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
  };

  private handlePPTXGeneration = async (
    contents: { title: string; content: string }[],
  ) => {
    contents.map(async (content: { title: string; content: string }) => {
      this._powerPointEngine.addSlide(
        { content: content.content },
        {
          styles: {
            x: 1, // x-coordinate
            y: 1, // y-coordinate
            fontFace: "Arial", // Font face
            fontSize: 18, // Font size
            color: "000000", // Text color (hex format)
            bold: false, // Bold text
            italic: false, // Italic text
            underline: {
              style: "none",
            }, // Underline text
            align: "left", // Text alignment (left, right, center)
          },
        },
      );
    });
    return await this._powerPointEngine.toStream();
  };

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
