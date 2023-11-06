import { IncomingHttpHeaders } from "http";
import "express";
import { Schema } from "joi";
import { Readable } from "node:stream";

interface IParams {
  [key: string]: any;
}

interface IQuery {
  [key: string]: any;
}

interface IInput {
  [key: string]: any;
}

export interface ContextTypes {
  params: IParams;
  query: IQuery;
  input: IInput;
  user?: TokenUser | undefined | null;
  file: RequestFileContents;
  headers: IncomingHttpHeaders;
}

export interface RequestFileContents {
  fileName: string | undefined
  fieldName: string | undefined;
  bufferContents: Buffer | undefined;
  originalFileName: string | undefined;
  mimetype: string | undefined;
  fileSize: number | undefined;
  path: string | undefined;
  fileStream: Readable | undefined;
}

type ExtractPayloadKeys<T> = {
  [K in keyof T]: K extends keyof ContextTypes ? K : never;
}[keyof T];

type ExtractContextPayloadKeys<T> = Pick<T, ExtractPayloadKeys<T>>;

export type Context<T> = T & ExtractContextPayloadKeys<T>;

export interface ValidationSchema {
  inputSchema?: Schema;
  paramsSchema?: Schema;
  querySchema?: Schema;
  fileSchema?: Schema;
}

export interface TokenUser {
  id: string;
  role: string;
}

export interface NewUserOptions {
  firstname: string;
  lastname: string;
  email: string;
}

export interface NewMailTemplateOptions {
  template?: string;
  description?: string;
  from?: string;
  replyTo?: string;
  dynamicContents?: string[];
}

export interface CreateNewUserAccountOptions {
  owner: string;
  currency: string;
  phoneNumber: string;
}

export interface IEMAIL {
  readonly fileName?: string;
  readonly data: any; //NOTE: this is changed
  readonly email?: string;
  readonly subject?: string;
  readonly attachments?: Array<string>;
}
