import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {
  Strategy,
  StrategyOptionsWithoutRequest,
  StrategyOptionsWithRequest,
} from "passport-jwt";
import { Request } from "express";
import { ENV } from "src/config/env.Config";
import {
  AccessTokenExpiredException,
  AccessTokenInvalidException,
  RefreshTokenExpiredException,
  RefreshTokenInvalidException,
  RefreshTokenMissingException,
} from "../exceptions/token.exceptions";
import { TokenService } from "../service/token.service";

// ── Shared payload interfaces ─────────────────────────────────────────────────

interface JwtBasePayload {
  sub: string;
  iat?: number;
  exp?: number;
}

interface JwtAccessPayload extends JwtBasePayload {
  accessToken?: string;
}

interface JwtRefreshPayload extends JwtBasePayload {
  jti: string;
  deviceId?: string | null;
  role?: string | null;
  refreshToken?: string;
}

interface TokenInfo {
  name: string;
  message?: string;
}

// ── JWT_ACCESS_STRATEGY ───────────────────────────────────────────────────────
const accessOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: (req: Request): string | null => {
    if (!req) return null;
    if (req.cookies?.["access-token-education"])
      return req.cookies["access-token-education"] as string;
    const header = req.headers["x-access-token-education"];
    if (header) return Array.isArray(header) ? header[0] : header;
    const body = req.body as { accessToken?: string } | undefined;
    if (body?.accessToken) return body.accessToken;
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.slice(7);
    return null;
  },
  secretOrKey: ENV.ACCESS_SECRET,
  ignoreExpiration: false,
};

const refreshOptions: StrategyOptionsWithRequest = {
  jwtFromRequest: (req: Request): string | null => {
    if (!req) return null;
    const header = req.headers["x-refresh-token-education"];
    if (header) return Array.isArray(header) ? header[0] : header;
    if (req.cookies?.["refresh-token-education"])
      return req.cookies["refresh-token-education"] as string;
    const body = req.body as { refreshToken?: string } | undefined;
    if (body?.refreshToken) return body.refreshToken;
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.slice(7);
    return null;
  },
  secretOrKey: ENV.REFRESH_SECRET,
  ignoreExpiration: false,
  passReqToCallback: true,
};
@Injectable()
export class JWT_ACCESS_STRATEGY extends PassportStrategy(
  Strategy,
  "jwt-access-education",
) {
  constructor() {
    super(accessOptions);
  }

  validate(payload: JwtAccessPayload): { userId: string } & JwtAccessPayload {
    if (!payload?.sub) throw new AccessTokenInvalidException();
    return { userId: payload.sub, ...payload };
  }

  handleRequest<T>(err: Error | null, user: T, info: TokenInfo): T {
    if (info?.name === "TokenExpiredError")
      throw new AccessTokenExpiredException();
    if (err) throw err;
    if (!user) throw new AccessTokenInvalidException();
    return user;
  }
}

// ── JWT_REFRESH_STRATEGY ──────────────────────────────────────────────────────

@Injectable()
export class JWT_REFRESH_STRATEGY extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(private readonly tokenService: TokenService) {
    super(refreshOptions);
  }

  async validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): Promise<{
    userId: string;
    jti: string;
    deviceId: string | null;
    role: string | null;
  }> {
    const body = req.body as { refreshToken?: string } | undefined;
    const header = req.headers["x-refresh-token-education"];
    const token: string | null =
      (Array.isArray(header) ? header[0] : header) ??
      (req.cookies?.["refresh-token-education"] as string | undefined) ??
      body?.refreshToken ??
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) throw new RefreshTokenMissingException();

    const isValid = await this.tokenService.validateRefreshToken(token);
    if (!isValid) throw new RefreshTokenInvalidException();

    return {
      userId: payload.sub,
      jti: payload.jti,
      deviceId: payload.deviceId ?? null,
      role: payload.role ?? null,
    };
  }

  handleRequest<T>(err: Error | null, user: T, info: TokenInfo): T {
    if (info?.name === "TokenExpiredError")
      throw new RefreshTokenExpiredException();
    if (err) throw err;
    if (!user) throw new RefreshTokenInvalidException();
    return user;
  }
}
