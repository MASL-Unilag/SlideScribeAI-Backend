import { FileExtractorEngine } from "./engine";
import * as parser from "csv-parse";
import { CsvError } from "csv-parse";

export class CSVFileExtractor implements FileExtractorEngine {
  async extract<T>(fileContents: Buffer): Promise<T[]> {
    return new Promise((resolve, reject) => {
      parser.parse(
        fileContents,
        {
          delimiter: [","],
          skip_records_with_empty_values: true,
          skip_empty_lines: true,
        },
        (error: CsvError, records: T[]) => {
          if (error) reject(error);
          resolve(records);
        },
      );
    });
  }
}
