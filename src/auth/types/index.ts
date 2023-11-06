import { ContextTypes } from "../../core";

export interface SignInPayload extends ContextTypes {
  input: {
    email: string;
    password: string;
  };
}


export interface SignUpPayload extends ContextTypes {
    input: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
        phoneNumber: string;
    }
}