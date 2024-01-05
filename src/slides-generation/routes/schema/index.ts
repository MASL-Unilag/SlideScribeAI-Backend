import * as Joi from "joi";
import { ValidationSchema } from "../../../core";
import { OutputLanguage, SlideOutputStyle } from "../../types";

export const generateSlideSchmea: ValidationSchema = {
  inputSchema: Joi.object({
    topic: Joi.string().required(),
    noOfPages: Joi.number().optional().default(10),
    context: Joi.string().required(),
    includeImages: Joi.boolean().optional().default(false),
    outputLanguage: Joi.valid(
      OutputLanguage.ENG,
      OutputLanguage.HAU,
      OutputLanguage.IGB,
      OutputLanguage.YOR,
    ).default(OutputLanguage.ENG),
    outputStyle: Joi.valid(
      SlideOutputStyle.BULLET_POINT,
      SlideOutputStyle.SHORT_PARAGRAPHS,
    ).default(SlideOutputStyle.SHORT_PARAGRAPHS),
    limitedTo: Joi.number().optional().default(10), //defaults.10 pages.
  }),
};
