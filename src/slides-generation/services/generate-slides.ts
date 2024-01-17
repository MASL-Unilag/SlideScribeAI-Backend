import {
  HandlerReturnType,
  Context,
  HttpStatus,
  UnProcessableError,
  logger,
} from "../../core";
import { FileManager } from "../components";
import { FileUploadPayload } from "../types";
import { SlideRepository } from "../models";

export class GenerateSlides {
  constructor(private readonly slideRepository: SlideRepository) {}

  generate = async ({
    file,
    input,
    user,
  }: Context<FileUploadPayload>): Promise<HandlerReturnType> => {
    try {
      const fileManager = new FileManager(file, this.slideRepository);

      const slide = await this.slideRepository.create({
        topic: input.topic,
        noOfPages: input.noOfPages,
        context: input.context,
        includeImages: input.includeImages,
        outputStyle: input.outputStyle,
        limitedTo: input.limitedTo,
        outputLanguage: input.outputLanguage,
        owner: user?.id,
        originalContentFromUploadedDoc: file.bufferContents?.toString("utf8"),
        name: input.outputDocumentName ?? input.topic,
      });

      Promise.resolve(
        fileManager.generateSlideContents({
          options: input,
          slideId: slide.id,
        }),
      );

      return {
        code: HttpStatus.OK,
        message: "You're slide is been processed.",
        body: {
          slideId: slide.id,
          status: slide.status,
        },
      };
    } catch (err: any) {
      logger.error(err);
      throw new UnProcessableError(err.message);
    }
  };
}
