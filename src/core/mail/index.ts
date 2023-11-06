import { IEMAIL } from "../types";
import { config } from "../config";
import * as formData from "form-data";
import Mailgun from "mailgun.js";
import { logger } from "../logging";

const instance = new Mailgun(formData);

const mg = instance.client({
  username: "api",
  key: config.mail.apiKey,
});

export class Mail {
  public static send = async (options: IEMAIL) => {
    return new Promise((resolve, reject) => {
      return mg.messages
        .create(config.mail.domain, options.data)
        .then((res: any) => {
          logger.info(res);
          resolve(res);
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
          throw new Error(err);
        });
    });
  };
}

export default new Mail();
