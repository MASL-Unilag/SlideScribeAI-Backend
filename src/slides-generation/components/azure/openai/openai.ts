import { config } from "../../../../core";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

const azureCredentialkey = new AzureKeyCredential(config.azure.openai.key);
export const openai = new OpenAIClient(
  config.azure.openai.baseUrl,
  azureCredentialkey,
  {
    allowInsecureConnection: config.app.environment.isInDevelopment,
  },
);
