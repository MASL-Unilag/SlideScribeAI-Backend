import pptxgen from "pptxgenjs";
import {
  Presentation,
  SlideOptions,
  SlideProperties,
  StreamOptions,
} from "../types";

export class PowerPointManager {
  // a presentation is a collection of slides.
  private presentation: Presentation = {
    name: "",
    slides: {},
  };
  private pageCount: number = 0;

  constructor(private readonly powerPointCreator: pptxgen) {}

  /**
   * @description This gives name to the presentation file (name.pptx)
   * @param {string} name
   * @returns {PowerPointManager}
   */
  addNameOfPresentation(name: string) {
    this.presentation.name = name;
    return this;
  }

  addSlide = async (props: SlideProperties, { styles }: SlideOptions) => {
    const slide = await this.powerPointCreator.addSlide();

    slide.addText(props.content, { ...styles });
    this.presentation.slides[++this.pageCount] = {
      title: props.title || "Unspecified",
      content: slide,
    };
    return this;
  };

  toStream = async (options?: StreamOptions) => {
    const content = await this.powerPointCreator.write({
      outputType: "STREAM",
      compression: options?.shouldCompress,
    });
    return {
      name: this.presentation.name,
      stream: content,
    };
  };
}

// const slide = pptx.addSlide();

// slide.addText("This is a test slide", {
//   x: 100,
//   y: 100,
//   w: 10,
//   bold: true,
//   italic: true,
//   strike: true,
//   fontSize: 36,
//   fill: { color: "F1F1F1" },
//   align: "center",
// });

// const presentationFile = pptx.write({
//   outputType: "STREAM",
//   compression: true,
// });
