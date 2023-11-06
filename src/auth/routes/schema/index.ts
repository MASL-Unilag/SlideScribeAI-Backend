import Joi from "joi";
import { ValidationSchema } from "../../../core";

export const signInSchema: ValidationSchema = {
  inputSchema: Joi.object({
    password: Joi.string().trim().required(),
    email: Joi.string().required().trim(),
  }),
};
