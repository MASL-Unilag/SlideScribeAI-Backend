import { ImageGenerationData } from "@azure/openai";

export interface AIGenerators {
  generate(...args: any[]): Promise<ImageGenerationData[] | any>;
}
