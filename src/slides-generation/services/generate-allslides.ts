import { HandlerReturnType, Context, HttpStatus } from "../../core";
import { RetrieveAllSlidePayload } from "../types";
import { AppMessages } from "../../common";
import { SlideRepository, Slides } from "../models";

export class RetrieveUserSlides {
  constructor(private readonly slideRepository: SlideRepository) {}

  retrieveSlidesForUser = async ({
    user,
  }: Context<RetrieveAllSlidePayload>) => {
    
    const slidesCreatedByUser = await this.slideRepository.find({
      owner: user.id,
    });

    return {
      code: HttpStatus.OK,
      message: AppMessages.SUCCESS.SLIDES_GENERATED,
      body: slidesCreatedByUser,
    };
  };
}
