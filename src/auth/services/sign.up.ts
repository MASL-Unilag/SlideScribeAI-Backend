import { Context, HttpStatus, UnAuthorizedError } from "../../core";
import { SignUpPayload } from "../types";
import { IUsers, Users } from "../../users";
import { AppMessages } from "../../common";




export class SignUp {
  constructor(
    public readonly usersRepo: typeof Users
  ){}


  handle = async ({input} : Context<SignUpPayload>) => {
       
    const { firstname, lastname, email, password } = input;

    const userExist = await this.usersRepo.findOne({ email: email });
       if (userExist) {
           throw new UnAuthorizedError(AppMessages.FAILURE.EMAIL_EXISTS)
      }

    const userCreated = await this.usersRepo.create(input);

    return {
      code: HttpStatus.OK,
      message: AppMessages.SUCCESS.SIGNUP, 
      data: userCreated
    }
}
}

