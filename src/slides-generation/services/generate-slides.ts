import { HandlerReturnType, Context, HttpStatus } from "../../core";
import { FileManager } from "../components";
import { FileUploadPayload } from "../types";

export class GenerateSlides {
  generate = async ({
    file,
    input,
  }: Context<FileUploadPayload>): Promise<HandlerReturnType> => {
    const fileManager = new FileManager(file);

    const slideContents = await fileManager.generateSlideContents({
      options: input,
    });

    return {
      code: HttpStatus.OK,
      message: "Generated content.",
      body: slideContents,
    };
  };
}
