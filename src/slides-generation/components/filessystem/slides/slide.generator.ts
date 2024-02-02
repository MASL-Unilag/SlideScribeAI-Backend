import { ChatRequestMessage } from "@azure/openai";

import { AIGenerators } from "../generator.interface";
import { SlideGenerationInput } from "../types";
import { containerClient, openai } from "../../azure";
import { SlideGenerationError, config } from "../../../../core";
import { SlideGenerationStatus, SlideRepository } from "../../../models";
import { FileUploadManager } from "../uploader";
import { SlidePagingManager } from "./slide.paging.manager";
import { PowerPointManager } from "../powerpointgen";

export class SlideManager implements AIGenerators {
  constructor(
    private readonly _powerPointEngine: PowerPointManager,
    private readonly slideRepository: SlideRepository,
    private readonly slidePagerController: SlidePagingManager,
  ) {

  }

  generate = async ({
    options,
    slideId,
    extractedContents,
  }: SlideGenerationInput) => {
    const messages: ChatRequestMessage[] = this._preparePromptMessages(
      options,
      extractedContents!,
    ) as any;

    try {
      const content = await this._getCompletions(messages);
      const slides =
        await this.slidePagerController.splitTextIntoPages(content);
      const pptxBuffer = await this.handlePPTXGeneration(slides);

      const uploader = new FileUploadManager(containerClient);
      const presentationUrl = await uploader.upload(
        pptxBuffer.stream as ArrayBuffer,
        `${options.topic}.pptx`,
      );

      await this._updateSlideDetails(
        slideId,
        presentationUrl,
        extractedContents!,
      );
    } catch (error: any) {
      console.log({ error });
      throw new SlideGenerationError("Error generating slide.");
    }
  };

  private _getCompletions = async (messages: ChatRequestMessage[]) => {
    const response = await openai.getChatCompletions(
      config.azure.openai.textDeploymentName,
      messages,
      {
        responseFormat: {
          type: "text",
        },
      },
    );

    return response.choices[0].message?.content!;
  };

  private _preparePromptMessages = (
    options: any,
    extractedContents: string,
  ) => {
    const prompt = ` Generate a comprehensive set of slide notes with the following options:
        - Topic: ${options.topic}
        - Context: ${options.context}
        - Output Style: ${options.outputStyle}
        - Output language: ${options.outputLanguage}
  
      Include the following content:
      "${extractedContents}"

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

  private _updateSlideDetails = async (
    slideId: string,
    presentationUrl: string,
    extractedContents: string,
  ) => {
    await this.slideRepository.findOneAndUpdate(
      {
        _id: slideId,
      },
      {
        $set: {
          status: SlideGenerationStatus.COMPLETED,
          file: presentationUrl,
          originalContentFromUploadedDoc: extractedContents,
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
}
