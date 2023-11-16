import { Users } from "../users";
import { CurrentUser } from "./middlewares/current.user";
import { SignIn } from "./services/sign.in";
import { TokenService } from "./helpers";
import { AppEncryptor } from "../app";
import { SignUp } from "./services/sign.up";

const tokenService = new TokenService(AppEncryptor);

export const currentUser = new CurrentUser();
export const signIn = new SignIn(Users, tokenService);
export const signUp = new SignUp()