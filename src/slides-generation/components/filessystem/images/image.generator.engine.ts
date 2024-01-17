import { ImageGenerationData, ImageSize, OpenAIClient } from "@azure/openai";
import { AIGenerators } from "../generator.interface";
import { config } from "../../../../core";

export class ImageGeneratorEngine implements AIGenerators {
  public readonly PROMPT: string = `
    Generate a visually compelling scene inspired by the following paragraph:

    [CONTEXT]
  `;
  public readonly DEPLOYMENT_NAME: string = config.openai.imageDeploymentName;
  public readonly SIZE: ImageSize = "1024x1024";
  public readonly MAX_NUMBER_OF_IMAGES_TO_GENERATE: number = 1;

  constructor(public readonly client: OpenAIClient) {}

  generate = async (
    slideContents: string,
  ): Promise<ImageGenerationData["url"][]> => {
    const prompt = this.PROMPT.replace("[CONTEXT]", slideContents);


    const result = await this.client.getImages(this.DEPLOYMENT_NAME, prompt, {
      n: this.MAX_NUMBER_OF_IMAGES_TO_GENERATE,
      size: this.SIZE,
    });

    for await (const image of result.data) {
      console.log(`Image generation URL: ${image.url}`);
    }

    return result.data.map((image: ImageGenerationData) => {
      return image.url;
    });
  };
}
