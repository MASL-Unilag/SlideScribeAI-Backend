import { Encryptor } from "../../app";
import { UnAuthorizedError, config } from "../../core";
import { IJwtData } from "../types";

import crypto from "node:crypto";
import * as jwt from "jsonwebtoken";
import { AppMessages } from "../../common";

export class TokenService {
  constructor(private readonly encryptionService: Encryptor) {}

  async getTokens(data: IJwtData): Promise<string[]> {
    return await Promise.all([
      this._generateAccessToken(data),
      this._generateRefreshToken(data),
    ]);
  }

  async extractTokenDetails(tokenFromHeader: string, secret: string) {
    // get the token from the bearer string.
    const token = tokenFromHeader.split(" ").pop()!;

    // verify the token
    const tokenDetails = await this.verifyToken(
      token,
      secret,
    );
    if (!tokenDetails)
      throw new UnAuthorizedError(AppMessages.INFO.INVALID_OPERATION);

    // extract the token information
    let tokenPayload = tokenDetails as jwt.JwtPayload;
    let timeToExpiry = tokenPayload.exp as number;

    return {
      token,
      expiration: new Date(timeToExpiry * 1000),
    };
  }

  async verifyToken(token: string, secret: string): Promise<jwt.JwtPayload> {
    return jwt.verify(token, secret) as jwt.JwtPayload;
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
