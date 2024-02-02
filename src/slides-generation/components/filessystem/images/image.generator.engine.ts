import { ImageGenerationData, ImageSize, OpenAIClient } from "@azure/openai";
import { AIGenerators } from "../generator.interface";
import { HttpClient, config } from "../../../../core";
import axios from "axios";

export class ImageGeneratorEngine implements AIGenerators {
  public readonly PROMPT: string = `
    Generate a visually compelling scene inspired by the following paragraph:

    [CONTEXT]
  `;
  public readonly DEPLOYMENT_NAME: string = config.azure.openai.imageDeploymentName;
  public readonly SIZE: ImageSize = "1024x1024";
  public readonly MAX_NUMBER_OF_IMAGES_TO_GENERATE: number = 1;

  constructor(public readonly client: OpenAIClient) {}

  generate = async (slideContents: string) => {
    const prompt = this.PROMPT.replace("[CONTEXT]", slideContents);
    const result = await this.client.getImages(this.DEPLOYMENT_NAME, prompt, {
      n: this.MAX_NUMBER_OF_IMAGES_TO_GENERATE,
      size: this.SIZE,
    });

    for await (const image of result.data) {
      console.log(`Image generation URL: ${image.url}`);
    }
    const url = await result.data[0].url!;
    const base64 = await this._convertImageUrlToBase64(url);
    return base64;
  };

  private _convertImageUrlToBase64 = async (url: string) => {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];

    const base64String = `${contentType};base64,${Buffer.from(
      response.data.toString(),
      "binary",
    ).toString("base64")}`;

    return base64String;
  };
}
