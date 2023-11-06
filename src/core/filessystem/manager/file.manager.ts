import { RequestFileContents } from "../../types";
import { CSVFileExtractor, ExcelFileExtractor } from "../engines";
import { FileExtractorEngine } from "../engines/engine";

export class FileManager {
  private _extractorEngine: FileExtractorEngine;

  async extractFileContents(file: RequestFileContents[]): Promise<any> {
    const contents = await this._getJSONContents(file[0]); //FIXME: rework this
    return this._formatParsedData(contents);
  }

  private async _getJSONContents(file: RequestFileContents) {
    this._extractorEngine =
      file.mimetype === "text/csv"
        ? new CSVFileExtractor()
        : new ExcelFileExtractor();
    return this._extractorEngine.extract(
      file.bufferContents!,
    ) as unknown as any[];
  }

  private async _formatParsedData(contents: any) {
    return contents.reduce(
      (
        acc: { columns: any[]; information: any[] },
        data: any,
        index: number,
      ) => {

        // first row in a csv or excel file contains the 
        // column names for each record for example 
        // in a CSV containing the names and emails of students
        // name,email ----> This is first row and it is at index 0 after parsing.
        // david,davidtofunmidada@gmail.com
        const isFirstRow  = index === 0;
        //TODO: add validation to make sure to remove mails record that has empty space
        // should be removed from the data.
        isFirstRow ? acc.columns.push(...data) : acc.information.push(data);

        return acc;
      },
      { columns: [], information: [] },
    );
  }
}
