import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";
import { PrismaService } from "../../database/prisma.service";
import { RedisService } from "../../database/redis.service";
import { OAuthCallbackDto, UpdateProfileDto } from "./dto/auth.dto";
import { ENV } from "../../config/env.Config";
import { DeviceService } from "src/core/device/device.service";
import { type Request } from "express";
import { UserProfile } from "@prisma/client";

export interface AuthenticatedUser {
  userId: string;
  authId: string;
  role: string;
  sub: string;
}

const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const REDIS_REFRESH_PREFIX = "rft-education:";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly deviceService: DeviceService,
  ) {}

  // ── Login ───────────────────────────────────────────────────────────────────

  async oauthCallback(
    req: Request,
    dto: OAuthCallbackDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Upsert Auth identity
    const auth = await this.prisma.auth.upsert({
      where: { sub: dto.sub },
      update: {
        email: dto.email,
        username: dto.username,
        picture: dto.picture ?? null,
        phone: dto.phone ?? null,
      },
      create: {
        sub: dto.sub,
        email: dto.email,
        username: dto.username,
        picture: dto.picture ?? null,
        phone: dto.phone ?? null,
      },
    });

    // 2. Upsert UserProfile
    const profile = await this.prisma.userProfile.upsert({
      where: { authId: auth.id },
      update: {
        name: dto.username,
        avatar: dto.picture ?? null,
      },
      create: {
        name: dto.username,
        avatar: dto.picture ?? null,
        authId: auth.id,
      },
    });

    // 3. Upsert DeviceInfo
    const deviceInfo = this.deviceService.buildDeviceInfo(req);
    await this.prisma.deviceInfo.upsert({
      where: { device_fingerprint: deviceInfo.fingerprint },
      update: {
        device_name: deviceInfo.browser,
        ip_address: deviceInfo.ip as string,
        user_agent: deviceInfo.deviceType + deviceInfo.os,
        location: JSON.stringify(deviceInfo.geo),
        last_seen: new Date(),
      },
      create: {
        user_id: auth.id,
        device_fingerprint: deviceInfo.fingerprint,
        device_name: deviceInfo.browser,
        ip_address: deviceInfo.ip as string,
        user_agent: deviceInfo.deviceType + deviceInfo.os,
        location: JSON.stringify(deviceInfo.geo),
        last_seen: new Date(),
      },
    });

    // 4. Issue tokens
    const accessToken = this.issueAccessToken(
      auth.id,
      profile.id,
      profile.role,
    );
    const refreshToken = this.generateRefreshToken();

    // 5. Store refresh token hash in Redis
    await this.storeRefreshToken(auth.id, refreshToken);

    return { accessToken, refreshToken };
  }

  // ── Refresh ─────────────────────────────────────────────────────────────────

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const hash = this.hashToken(refreshToken);

    // Look up all keys for this hash — we store as rft-education:{authId}
    // We need to find which authId owns this token
    const authId = await this.redis.get(`${REDIS_REFRESH_PREFIX}hash:${hash}`);
    if (!authId) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const stored = await this.redis.get(`${REDIS_REFRESH_PREFIX}${authId}`);
    if (stored !== hash) {
      throw new UnauthorizedException("Refresh token reuse detected");
    }

    const auth = await this.prisma.auth.findUnique({
      where: { id: authId },
      include: { userProfile: true },
    });

    if (!auth || !auth?.userProfile) {
      throw new UnauthorizedException("User not found");
    }

    const profile = auth.userProfile as UserProfile;

    // Rotate refresh token
    await this.redis.del(`${REDIS_REFRESH_PREFIX}${authId}`);
    await this.redis.del(`${REDIS_REFRESH_PREFIX}hash:${hash}`);

    const newRefreshToken = this.generateRefreshToken();
    await this.storeRefreshToken(authId, newRefreshToken);

    const accessToken = this.issueAccessToken(authId, profile.id, profile.role);

    return { accessToken };
  }

  // ── Logout ──────────────────────────────────────────────────────────────────

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const hash = this.hashToken(refreshToken);
    const authId = await this.redis.get(`${REDIS_REFRESH_PREFIX}hash:${hash}`);
    if (authId) {
      await this.redis.del(`${REDIS_REFRESH_PREFIX}${authId}`);
      await this.redis.del(`${REDIS_REFRESH_PREFIX}hash:${hash}`);
    }
  }

  // ── Profile ─────────────────────────────────────────────────────────────────

  async getProfile(authId: string) {
    return this.prisma.auth.findUnique({
      where: { id: authId },
      include: { userProfile: true },
    });
  }

  async updateProfile(authId: string, dto: UpdateProfileDto) {
    return this.prisma.userProfile.update({
      where: { authId: authId },
      data: {
        name: dto.username,
        avatar: dto.picture,
      },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private issueAccessToken(
    authId: string,
    profileId: string,
    role: string,
  ): string {
    return this.jwtService.sign(
      { sub: authId, authId, profileId, role },
      { secret: ENV.ACCESS_SECRET, expiresIn: "15m" },
    );
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString("hex");
  }

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private async storeRefreshToken(
    authId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = this.hashToken(refreshToken);
    // Store hash by authId (for lookup during refresh)
    await this.redis.set(
      `${REDIS_REFRESH_PREFIX}${authId}`,
      hash,
      REFRESH_TTL_SECONDS,
    );
    // Store authId by hash (for reverse lookup)
    await this.redis.set(
      `${REDIS_REFRESH_PREFIX}hash:${hash}`,
      authId,
      REFRESH_TTL_SECONDS,
    );
  }
}
