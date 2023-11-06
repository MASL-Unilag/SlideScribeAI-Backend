import { FileExtractorEngine } from "./engine";
import * as parser from "xlsx";

export class ExcelFileExtractor implements FileExtractorEngine {
  async extract<T extends any = any>(fileContents: Buffer): Promise<T[]> {
    const workbook = parser.read(fileContents, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = parser.utils.sheet_to_json(sheet, { header: 1 });
    return jsonData as unknown as any;
  }
}
