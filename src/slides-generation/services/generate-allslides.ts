import { HandlerReturnType, Context, HttpStatus } from "../../core";
import { RetrieveAllSlidePayload } from "../types";
import { AppMessages } from "../../common";
import { Slides } from "../models";


export class GenerateAllSlides {
    retrieveSlidesForUser = async ({ params }: Context<RetrieveAllSlidePayload>) => {
     const userOwnerId = params.userid;
     console.log(userOwnerId)
     const slidesCreatedByUser = await Slides.find({
      owner: userOwnerId
    });

    return {
      code: HttpStatus.OK,
      message: AppMessages.SUCCESS.SLIDES_GENERATED,
      body: slidesCreatedByUser,
    };
  };
}
