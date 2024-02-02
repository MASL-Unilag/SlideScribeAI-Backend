import pptxgen from "pptxgenjs";

import { Slides } from "../../../models";
import { FileUploadManagerConfig } from "./file.upload.manager";
import { SlideManager, SlidePagingManager } from "../slides";
import { SlideGenerationInput } from "../types";
import { FileExtractor } from "./file.extractor";
import { RequestFileContents } from "../../../../core";
import { openai } from "../../azure";
import { ImageGeneratorEngine } from "../images";
import { PowerPointManager } from "../powerpointgen";
import { DocumentCategory } from "../../../types";

export class FileManager {
  private _imageEngine: ImageGeneratorEngine;
  private _slideManager: SlideManager;
  private _documentContents: string;

  constructor(private readonly file: RequestFileContents) {
    this._setImageEngine();
    this._setSlideManager();
  }

  public async generateSlide(input: SlideGenerationInput) {
    this._documentContents = await this._getFileContents(this.file, {
      documentCategory: input.docCategory,
    });

    this._slideManager.generate(input);
  }

  public static fileUploadConfigurations = () => {
    return FileUploadManagerConfig.fileUploadConfigurations();
  };

  private async _getFileContents(
    file: RequestFileContents,
    options: {
      documentCategory: typeof DocumentCategory;
    },
  ) {
    console.log(options);
    if (this.documentContentsHasBeenExtracted()) {
      return this._documentContents;
    }

    if (options.documentCategory.PLAIN) {
      return FileExtractor.extract(file);
    }
    if (options.documentCategory.OCR) {
      return FileExtractor.extractUsingOCR(file);
    }

    return FileExtractor.extractFromAudio(file);
  }

  private documentContentsHasBeenExtracted(): boolean {
    return !!this._documentContents;
  }

  private _setImageEngine() {
    this._imageEngine = new ImageGeneratorEngine(openai);
  }

  private _setSlideManager() {
    const powerPointManager = new PowerPointManager(new pptxgen());

    this._slideManager = new SlideManager(
      powerPointManager,
      Slides,
      new SlidePagingManager(),
    );
  }
}
