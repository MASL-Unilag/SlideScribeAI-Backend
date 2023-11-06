import { CurrentUser } from "./middlewares/current.user";
import { SignIn } from "./services/sign.in";

export const currentUser = new CurrentUser();
export const signIn = new SignIn();
