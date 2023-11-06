import { Request } from "express";
import { ContextTypes, RequestFileContents } from "../types";

class ParseControllerArgs {
  parse = (req: Request) => {
    return {
      input: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      user: req.user,
      file: ParseControllerArgs.parseFileContents(req),
    };
  };

  //TODO: tidy this up later.
  private static parseFileContents = (req: Request): RequestFileContents => {

      return {
        fileName: req?.file?.filename,
        fieldName: req?.file?.fieldname,
        bufferContents: req?.file?.buffer,
        originalFileName: req?.file?.originalname,
        mimetype: req?.file?.mimetype,
        fileSize: req?.file?.size,
        path: req?.file?.path,
        fileStream: req?.file?.stream!,
      }


  };
}

export default new ParseControllerArgs();
