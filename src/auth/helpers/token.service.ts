import { Encryptor } from "../../app";
import { config } from "../../core";
import { IJwtData } from "../types";

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
    const accessToken = jwt.sign(data, config.auth.accessTokenSecret, {
      expiresIn: config.auth.accessTokenExpiresIn,
      jwtid: crypto.randomUUID(),
    });

    return this.encryptionService.encrypt(accessToken);
  }

  private _generateRefreshToken(data: IJwtData): string {
    const refreshToken = jwt.sign(data, config.auth.refreshTokenSecret, {
      expiresIn: config.auth.refreshTokenExpiresIn,
      jwtid: crypto.randomUUID(),
    });

    return this.encryptionService.encrypt(refreshToken);
  }
}
