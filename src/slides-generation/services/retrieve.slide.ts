import { AppMessages } from "../../common";
import { BadRequestError, Context, HttpStatus, mongoose } from "../../core";
import { SlideRepository } from "../models";
import { RetrieveSlidePayload } from "../types";

export class RetrieveSlide {
  constructor(private readonly slideRepository: SlideRepository) {}

  handle = async ({ params }: Context<RetrieveSlidePayload>) => {
    const slideId = params.id;

    const isValid = mongoose.Types.ObjectId.isValid(slideId) //TODO: refactor this.
    if(!isValid)  throw new BadRequestError("Slide not found");

    const slide = await this.slideRepository.findById(slideId);
    if(!slide) throw new BadRequestError("Slide not found");

    return {
      code: HttpStatus.OK,
      message: AppMessages.SUCCESS.SLIDE_OUTPUT,
      data: slide,
    };
  };
}
