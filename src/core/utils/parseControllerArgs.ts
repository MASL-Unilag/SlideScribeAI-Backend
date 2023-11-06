import { Request } from "express";
import { Context } from "../types";
import { RequestFileContents } from "../types";

class ParseControllerArgs {
  parse = (req: Request): Context => {
    return {
      input: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      user: req.user,
      files: ParseControllerArgs.parseFileContents(req),
    };
  };

  //TODO: tidy this up later.
  private static parseFileContents = (req: Request): RequestFileContents[] => {
    const results: RequestFileContents[] = [];

    if (req.file) {
      results.push({
        fileName: req.file.filename,
        fieldName: req.file.fieldname,
        bufferContents: req.file.buffer,
        originalFileName: req.file.originalname,
        mimetype: req.file.mimetype,
        fileSize: req.file.size,
        path: req.file.path,
        fileStream: req.file.stream,
      });
    }

    (req.files as Express.Multer.File[])?.forEach((file) => {
      results.push({
        fileName: file.filename,
        fieldName: file.fieldname,
        bufferContents: file.buffer,
        originalFileName: file.originalname,
        mimetype: file.mimetype,
        fileSize: file.size,
        path: file.path,
        fileStream: file.stream,
      });
    });

    return results;
  };
}

export default new ParseControllerArgs();
