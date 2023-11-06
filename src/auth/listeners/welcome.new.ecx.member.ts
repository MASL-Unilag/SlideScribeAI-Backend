import { Notification } from "../../core";

class SendWelcomeGreetingsToNewECXMember extends Notification {
  handle(...args: any[]): void | Promise<void> {}
}

export const sendWelcomeGreetingsToECXMember =
  new SendWelcomeGreetingsToNewECXMember();
