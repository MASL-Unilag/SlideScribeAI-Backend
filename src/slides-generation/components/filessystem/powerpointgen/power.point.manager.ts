import pptxgen from "pptxgenjs";
import { StringHelper } from "../../../../core";

export interface PowerPointSlideStyles extends pptxgen.TextPropsOptions {}

export type Slide = {
  title: string;
  content: pptxgen.Slide;
};

export interface Presentation {
  name: string;
  slides: Record<
    number, // the slide page number.
    Slide
  >;
}

export interface StreamOptions {
  shouldCompress?: boolean;
}

export interface SlideProperties {
  title?: string;
  content: string;
  imageUrl?: string;
  sectionTitle?: string;
}

export interface SlideOptions {
  slideNumber?: number;
  styles: PowerPointSlideStyles;
}

export interface ImageOptions {
  imageURL: string;
  placeholder?: string;
}

export class PowerPointManager {
  // a presentation is a collection of slides.
  private presentation: Presentation = {
    name: "",
    slides: {},
  };
  private pageCount: number = 0;

  constructor(
    private readonly powerPointCreator: pptxgen,
    name: string,
  ) {
    // this.powerPointCreator.defineSlideMaster({
    //   title: name,
    //   margin: [0.5, 0.25, 1.0, 0.25],
    //   background: {
    //     color: StringHelper.generateHexColorCode(),
    //     transparency: Math.ceil(Math.random() * 100),
    //   },
    //   slideNumber: {
    //     x: 1.0,
    //     y: 1.0,
    //     color: StringHelper.generateHexColorCode(),
    //   },
    // });
  }

  /**
   * @description This gives name to the presentation file (name.pptx)
   * @param {string} name
   * @returns {PowerPointManager}
   */
  addNameOfPresentation(name: string) {
    this.presentation.name = name;
    return this;
  }

  addSlide = async (
    props: SlideProperties,
    { styles }: SlideOptions,
  ) => {
    const slide = await this.powerPointCreator.addSlide();

    slide.addText(props.content, { ...styles });
    // slide.addImage({ data: props.imageUrl, placeholder: "images/slide" });

    this.presentation.slides[++this.pageCount] = {
      title: props.title || "Unspecified",
      content: slide,
    };
    return this;
  };

  // addSlideContent = async (
  //   content: string,
  //   { slideNumber, styles }: SlideOptions,
  // ) => {
  //   const number = slideNumber ?? this.pageCount;
  //   const slide = this._getSlide(number); // get the slide
  //   slide.content.addText(content, { ...styles }); // add contents to the slide.
  //   this._editPresentationSlide(number, slide); // edit the slide presentation.
  // };

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

  private _getSlide = (pageNum: number) => {
    return this.presentation.slides[pageNum];
  };

  private _editPresentationSlide = (num: number, content: Slide) => {
    this.presentation.slides[num] = content; // update the presentation file contents.
  };

  private _editSlideName = (num: number, name: string) => {
    this.presentation.slides[num].title = name; // update the presentation name
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
