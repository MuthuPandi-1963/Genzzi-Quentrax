import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";
import { PrismaService } from "../../database/prisma.service";
import { ResponseEntity } from "../../common/responser/response.entity";
import { ResponseSender } from "../../common/responser/response.sender";
import { OAuthCallbackDto, UpdateProfileDto } from "./dto/auth.dto";
import { ENV } from "../../config/env.Config";
import { DeviceService } from "src/core/device/device.service";
import { GenzziConfig } from "src/config/genzzi.config";
import { type Request } from "express";

// ── Introspection types ───────────────────────────────────────────────────────

export interface AuthenticatedUser {
  sub: string;
  client_id: string;
  deviceId: string;
  exp: number;
  token_type: string;
  scopes: string[];
  username: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  picture: string | null; // was avatar_url
}

interface IntrospectionData {
  active: boolean;
  token_type: string;
  sub: string;
  client_id: string;
  deviceId: string;
  exp: number;
  scope: string;
  profile: {
    username: string;
    email: string;
    phone: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface IntrospectionResponse {
  success: boolean;
  message: string;
  data: IntrospectionData;
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private deviceService: DeviceService,
  ) {}

  // ── Introspection ───────────────────────────────────────────────────────────

  async introspect(rawCookie: string): Promise<IntrospectionResponse | null> {
    try {
      return await GenzziConfig.introspect(rawCookie);
    } catch {
      return null;
    }
  }

  buildUser(data: IntrospectionData): AuthenticatedUser {
    return {
      sub: data.sub,
      client_id: data.client_id,
      deviceId: data.deviceId,
      exp: data.exp,
      token_type: data.token_type,
      scopes: data.scope.split(" ").filter(Boolean),
      username: data.profile.username,
      email: data.profile.email,
      phone: data.profile.phone,
      full_name: data.profile.full_name,
      picture: data.profile.avatar_url, // mapped → picture
    };
  }

  // ── OAuth / tokens ──────────────────────────────────────────────────────────

  async oauthCallback(
    req: Request,
    dto: OAuthCallbackDto,
    token: {
      refreshToken: string;
      accessToken: string;
    },
  ): Promise<ResponseEntity<any>> {
    // 1. Upsert Auth identity
    const auth = await this.prisma.auth.upsert({
      where: { sub: dto.sub },
      update: {
        email: dto.email,
        username: dto.username,
        picture: dto.picture,
        phone: dto.phone,
      },
      create: {
        sub: dto.sub,
        email: dto.email,
        username: dto.username,
        picture: dto.picture,
        phone: dto.phone,
      },
    });

    // 2. Lazy provision Mailbox
    let mailbox = await this.prisma.mailbox.findUnique({
      where: { auth_id: auth.id },
    });
    if (!mailbox) {
      mailbox = await this.prisma.mailbox.create({
        data: {
          auth_id: auth.id,
          email: auth.email,
          displayName: auth.username,
        },
      });
    }

    const deviceInfo = this.deviceService.buildDeviceInfo(req);
    // 3. Upsert DeviceInfo
    const device = await this.prisma.deviceInfo.upsert({
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
    const accessJti = token.accessToken || crypto.randomUUID();
    const refreshToken = token.refreshToken;

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await this.prisma.sessionToken.create({
      data: {
        user_id: auth.id,
        device_id: device.id,
        access_jti: accessJti,
        refresh_hash: refreshToken,
        ip_address: deviceInfo.ip as string,
        user_agent: deviceInfo.deviceType + deviceInfo.os,
        expires_at: expiresAt,
      },
    });

    const accessToken = this.jwtService.sign(
      { sub: auth.id, deviceId: device.id, jti: accessJti },
      { secret: ENV.JWT_SECRET, expiresIn: "15m" },
    );

    return ResponseSender.success(
      { accessToken, refreshToken, user: auth, mailbox },
      "Authenticated successfully",
    );
  }

  async refreshTokens(token: string): Promise<ResponseEntity<any>> {
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await this.prisma.sessionToken.findFirst({
      where: { refresh_hash: hash, revoked_at: null },
      include: { user: true, device: true },
    });

    if (!session || new Date() > new Date(session.expires_at)) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    // Rotate: mark old as replaced
    const newAccessJti = crypto.randomUUID();
    const newRefreshToken = crypto.randomBytes(32).toString("hex");
    const newRefreshHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    const newExpires = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.$transaction([
      this.prisma.sessionToken.update({
        where: { id: session.id },
        data: { revoked_at: new Date(), replaced_by: newAccessJti },
      }),
      this.prisma.sessionToken.create({
        data: {
          user_id: session.user_id,
          device_id: session.device_id,
          access_jti: newAccessJti,
          refresh_hash: newRefreshHash,
          ip_address: session.ip_address,
          user_agent: session.user_agent,
          expires_at: newExpires,
        },
      }),
    ]);

    const accessToken = this.jwtService.sign(
      { sub: session.user_id, deviceId: session.device_id, jti: newAccessJti },
      { secret: ENV.JWT_SECRET, expiresIn: "15m" },
    );

    return ResponseSender.success(
      { accessToken, refreshToken: newRefreshToken },
      "Tokens rotated successfully",
    );
  }

  async logout(accessJti: string): Promise<ResponseEntity<null>> {
    await this.prisma.sessionToken.updateMany({
      where: { access_jti: accessJti },
      data: { revoked_at: new Date() },
    });
    return ResponseSender.success(null, "Logged out successfully");
  }

  async getProfile(userId: string) {
    const profileData = await this.prisma.auth.findFirst({
      where: { sub: userId },
      include: { mailbox: true },
    });
    return profileData;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.auth.update({
      where: { id: userId },
      data: dto,
    });
  }
}
