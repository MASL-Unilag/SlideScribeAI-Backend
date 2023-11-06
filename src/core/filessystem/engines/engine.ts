export interface FileExtractorEngine {
  extract<T>(fileContents: Buffer | Uint8Array): Promise<T[]>;
}
