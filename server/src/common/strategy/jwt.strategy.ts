import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";

import {
  AccessTokenExpiredException,
  AccessTokenInvalidException,
  RefreshTokenExpiredException,
  RefreshTokenInvalidException,
  RefreshTokenMissingException,
} from "../exceptions/token.exceptions";
import { TokenService } from "../service/token.service";
import { ENV } from "src/config/env.Config";

@Injectable()
export class JWT_ACCESS_STRATEGY extends PassportStrategy(
  Strategy,
  "jwt-access",
) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req) return null;
        if (req.cookies?.["access-token-mail"]) return req.cookies["access-token-mail"];
        if (req.headers["x-access-token-mail"]) return req.headers["x-access-token-mail"];
        if (req.body?.accessToken) return req.body.accessToken;

        const auth = req.headers.authorization;
        if (auth?.startsWith("Bearer ")) return auth.slice(7);

        return null;
      },
      secretOrKey: ENV.ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new AccessTokenInvalidException();
    }

    return {
      userId: payload.sub,
      ...payload,
    };
  }

  handleRequest(err: any, user: any, info: { name: string }) {
    if (info?.name === "TokenExpiredError") {
      throw new AccessTokenExpiredException();
    }

    if (err) throw err;

    if (!user) throw new AccessTokenInvalidException();

    return user;
  }
}

/**
 * ========================
 * REFRESH TOKEN STRATEGY
 * ========================
 */

@Injectable()
export class JWT_REFRESH_STRATEGY extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(private readonly tokenService: TokenService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req) return null;

        if (req.headers["x-refresh-token"])
          return req.headers["x-refresh-token"];

        if (req.cookies?.["refresh-token-mail"]) return req.cookies["refresh-token-mail"];

        if (req.body?.refreshToken) return req.body.refreshToken;

        const auth = req.headers.authorization;
        if (auth?.startsWith("Bearer ")) return auth.slice(7);

        return null;
      },
      secretOrKey: ENV.REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token =
      req.headers["x-refresh-token"] ||
      req.cookies?.["refresh-token-mail"] ||
      req.body?.refreshToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) {
      throw new RefreshTokenMissingException();
    }

    const isValid = await this.tokenService.validateRefreshToken(token);

    if (!isValid) {
      throw new RefreshTokenInvalidException();
    }

    return {
      userId: payload.sub,
      jti: payload.jti,
      deviceId: payload.deviceId ?? null,
      role: payload.role ?? null,
    };
  }

  handleRequest(err: any, user: any, info: { name: string }) {
    if (info?.name === "TokenExpiredError") {
      throw new RefreshTokenExpiredException();
    }

    if (err) throw err;

    if (!user) throw new RefreshTokenInvalidException();

    return user;
  }
}
