
export interface FileExtractorEngine {
  extract(bufferContents: Buffer): Promise<any>;
}