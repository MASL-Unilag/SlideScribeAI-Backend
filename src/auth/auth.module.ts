import { Users } from "../users";
import { CurrentUser } from "./middlewares/current.user";
import { SignIn } from "./services/sign.in";
import { TokenService } from "./helpers";
import { AppEncryptor } from "../app";
import { Logout } from "./services/logout";
import { BlackListTokens } from "./model/blacklistoken";

const tokenService = new TokenService(AppEncryptor);

export const currentUser = new CurrentUser();
export const signIn = new SignIn(Users, tokenService);
export const signOut = new Logout(tokenService, Users, BlackListTokens);