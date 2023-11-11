import { Encryptor } from "../../app";
import { config } from "../../core";
import { IJwtData } from "../types";

import crypto from "node:crypto";
import * as jwt from "jsonwebtoken";

export class TokenService {
  constructor(private readonly encryptionService: Encryptor) {}

  async getTokens(data: IJwtData): Promise<string[]> {
    return await Promise.all([
      this._generateAccessToken(data),
      this._generateRefreshToken(data),
    ]);
  }

  private _generateAccessToken(data: IJwtData): string {
    const accessToken = this._generateToken({
      data,
      secret: config.auth.accessTokenSecret,
      expiresIn: config.auth.accessTokenExpiresIn,
    });

    return this.encryptionService.encrypt(accessToken);
  }

  private _generateRefreshToken(data: IJwtData): string {
    const refreshToken = this._generateToken({
      data,
      secret: config.auth.refreshTokenSecret,
      expiresIn: config.auth.refreshTokenExpiresIn,
    });

    return this.encryptionService.encrypt(refreshToken);
  }

  private _generateToken({
    data,
    secret,
    expiresIn,
  }: {
    data: IJwtData;
    expiresIn: string;
    secret: string;
  }): string {
    return jwt.sign(data, secret, {
      expiresIn: expiresIn,
      jwtid: crypto.randomUUID(),
    });
  }
}
