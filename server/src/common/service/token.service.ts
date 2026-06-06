import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoggerService } from "src/core/logger/logger.service";
import {
  AccessTokenPayload,
  GeneratedTokens,
  RefreshTokenPayload,
  RotatedTokenResult,
} from "../interfaces/token.types";
import { RedisService } from "src/database/redis.service";
import { ENV } from "src/config/env.Config";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
    private readonly logger: LoggerService,
  ) {}

  private redisClient() {
    return this.redis.getClient();
  }

  /** Sign any payload with a specific key type */
  async signToken(
    payload: Record<string, any>,
    tokenType: "id_token" | "access_token" | "refresh_token" = "access_token",
  ): Promise<string> {
    const secret =
      tokenType === "id_token"
        ? (ENV.ID_TOKEN_SECRET ?? ENV.ACCESS_SECRET)
        : tokenType === "refresh_token"
          ? ENV.REFRESH_SECRET
          : ENV.ACCESS_SECRET;

    const expiresIn =
      tokenType === "id_token"
        ? this.expToSeconds(ENV.ID_TOKEN_EXPIRATION ?? "1h")
        : tokenType === "refresh_token"
          ? this.expToSeconds(ENV.REFRESH_EXPIRATION)
          : this.expToSeconds(ENV.ACCESS_EXPIRATION);

    return this.jwt.signAsync(payload, { secret, expiresIn });
  }
  /** Generate Access + Refresh */
  async createTokens(
    userId: string,
    deviceId: string,
    role: string,
    extraPayload: Record<string, any> = {},
  ): Promise<GeneratedTokens> {
    const accessJti = crypto.randomUUID();
    const refreshJti = crypto.randomUUID();
    const refreshToken = await this.createRefreshToken(
      userId,
      deviceId,
      role,
      refreshJti,
      extraPayload,
    );
    const accessToken = await this.createAccessToken(
      userId,
      deviceId,
      role,
      accessJti,
      extraPayload,
    );

    return { accessToken, refreshToken };
  }
  /** Validate Access Token */
  validateAccessToken(token: string): AccessTokenPayload {
    try {
      const decoded = this.verifyAccessJwt(token);
      return decoded;
    } catch (err) {
      this.logger.error("Access token validation error", err);
      throw new UnauthorizedException("Invalid access token");
    }
  }
  async RevokeToken(
    token: string,
    tokenName: "access" | "refresh" = "refresh",
  ) {
    if (!token) return false;

    let refreshDecoded: RefreshTokenPayload | null = null;

    try {
      if (tokenName === "refresh") {
        refreshDecoded = this.verifyRefreshJwt(token);
      }

      if (refreshDecoded) {
        const { sub: userId, deviceId } = refreshDecoded;

        const key = this.refreshKey(userId, deviceId);

        await this.redis.getClient().del(key);

        return true;
      }

      return false;
    } catch (error: unknown) {
      console.log(error);
      return false;
    }
  }

  /** Access Token */
  async createAccessToken(
    userId: string,
    deviceId: string,
    role: string,
    accessJti: string = crypto.randomUUID(),
    extraPayload: Record<string, any> = {},
  ): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: userId,
      deviceId,
      role,
      ...extraPayload,
      accessJti,
    };
    return this.signAccessJwt(payload);
  }

  /** Refresh Token */
  async createRefreshToken(
    userId: string,
    deviceId: string,
    role: string,
    refreshJti: string,
    extraPayload: Record<string, any> = {},
  ): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: userId,
      deviceId,
      role,
      refreshJti,
      ...extraPayload,
    };

    const token = await this.signRefreshJwt(payload);
    const key = this.refreshKey(userId, deviceId); // ✅ Correct order
    const ttl = this.expToSeconds(ENV.REFRESH_EXPIRATION);

    await this.redisClient().set(key, await hash(token, 10), "EX", ttl);

    return token;
  }

  /** Rotate Refresh Token */
  async rotateRefreshToken(oldToken: string): Promise<RotatedTokenResult> {
    const decoded = this.verifyRefreshJwt(oldToken);
    const { sub: userId, deviceId, role } = decoded;

    await this.revokeRefreshToken(this.refreshKey(userId, deviceId)); // ✅ Correct order

    const newToken = await this.createRefreshToken(
      userId,
      deviceId,
      role,
      crypto.randomUUID(),
    );
    return { userId, refreshToken: newToken };
  }

  private revokeRefreshToken(key: string) {
    return this.redisClient().del(key);
  }

  /** Validate Refresh Token */
  async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const decoded = this.verifyRefreshJwt(token);
      const { sub, deviceId } = decoded;

      const key = this.refreshKey(sub, deviceId); // ✅ Correct order
      const stored = await this.redisClient().get(key);

      if (!stored)
        throw new UnauthorizedException("Refresh token revoked/expired");

      const valid = await compare(token, stored);
      if (!valid) throw new UnauthorizedException("Invalid refresh token");

      return decoded;
    } catch (err) {
      this.logger.error("Refresh token validation error", err);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  /** JWT Helpers */
  private signAccessJwt(payload: AccessTokenPayload) {
    return this.jwt.signAsync(payload, {
      secret: ENV.ACCESS_SECRET,
      expiresIn: this.expToSeconds(ENV.ACCESS_EXPIRATION),
    });
  }

  private signRefreshJwt(payload: RefreshTokenPayload) {
    return this.jwt.signAsync(payload, {
      secret: ENV.REFRESH_SECRET,
      expiresIn: this.expToSeconds(ENV.REFRESH_EXPIRATION),
    });
  }

  private verifyRefreshJwt(token: string): RefreshTokenPayload {
    return this.jwt.verify(token, {
      secret: ENV.REFRESH_SECRET,
    });
  }
  private verifyAccessJwt(token: string): RefreshTokenPayload {
    return this.jwt.verify(token, {
      secret: ENV.ACCESS_SECRET,
    });
  }

  /** Redis Key: refresh:userId:deviceId:jti */
  private refreshKey(userId: string, deviceId: string) {
    return `refresh:${userId}:${deviceId}`;
  }

  /** Exp Parsing */
  private expToSeconds(exp: string): number {
    // handle pure numbers: "120" -> 120 seconds
    if (/^\d+$/.test(exp)) {
      return parseInt(exp, 10);
    }

    const map: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    const match = exp.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(
        `Invalid expiration format: ${exp}. Use like "15m", "30d", "10h", "45s"`,
      );
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    return value * map[unit];
  }
}
