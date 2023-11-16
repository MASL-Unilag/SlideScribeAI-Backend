import { Context, HttpStatus, UnAuthorizedError } from "../../core";
import { SignUpPayload } from "../types";
import { IUsers, Users } from "../../users";
import { AppMessages } from "../../common";
import { Request, Response } from 'express';
import { Collection } from "mongoose";



export class SignUp {
  handle = async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, user_id } = req.body;

    if (!email || !firstname || !lastname || !password) {
      return res.status(422).json({ message: AppMessages.FAILURE.EMPTY_INPUT });
    }
  
    const userExist = await Users.findOne({ email: email });
    if (userExist) {
      throw new UnAuthorizedError(AppMessages.FAILURE.EMAIL_EXISTS)
    }
  
    const userCreated = await Users.create(req.body);
  

    return res.status(201).json(
        {
          code: HttpStatus.OK,
          message: AppMessages.SUCCESS.SIGNUP, 
          data: userCreated
        }
    )
       
    
}
}
