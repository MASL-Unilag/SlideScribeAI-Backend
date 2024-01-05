import { config } from "../../../core";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

const azureCredentialkey = new AzureKeyCredential(config.openai.key);
export const openai = new OpenAIClient(
  config.openai.baseUrl,
  azureCredentialkey,
  {
    allowInsecureConnection: config.app.environment.isInDevelopment,
  },
);
