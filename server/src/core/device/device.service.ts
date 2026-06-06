// ../../core/device/device.service.ts

import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import * as crypto from "crypto";
import { DeviceInfo, geo } from "../../common/interfaces/deviceInfo";
import { RedisService } from "../../database/redis.service";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class DeviceService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  private extractIP(req: Request): string | null {
    const forwarded = req.headers["x-forwarded-for"] as string;
    if (forwarded) return forwarded.split(",")[0].trim();
    return req.socket?.remoteAddress || req.ip || null;
  }

  private generateFingerprint(
    ip: string | null,
    browser: string,
    os: string,
    deviceType: string,
  ): string {
    const raw = `${ip}-${browser}-${os}-${deviceType}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  private async getGeoFromCache(ip: string) {
    const cacheKey = `geo:${ip}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    try {
      const response: {
        data: { status: string };
      } = await axios.get(
        `https://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,timezone,isp`,
        { timeout: 3000 },
      );
      if (response.data.status === "success") {
        await this.redis.set(cacheKey, response.data, 86400); // 24h
        return response.data;
      }
    } catch {
      // geo is optional — silent fail
    }

    return null;
  }

  buildDeviceInfo(req: Request): DeviceInfo {
    const ua = req.headers["user-agent"] || "";
    const parser = new UAParser(ua);
    const result = parser.getResult();

    const ip = this.extractIP(req);
    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const deviceType = result.device.type || "desktop";
    const fingerprint = this.generateFingerprint(ip, browser, os, deviceType);

    const deviceInfo: DeviceInfo = {
      ip,
      browser,
      os,
      deviceType,
      fingerprint,
      geo: null,
    };

    // Non-blocking geo fetch
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      this.getGeoFromCache(ip)
        .then((geo) => {
          deviceInfo.geo = geo as geo;
        })
        .catch(() => {});
    }

    return deviceInfo;
  }

  /**
   * Upsert device record for a user.
   * If same fingerprint exists → update last_seen + ip.
   * If new fingerprint → create new record.
   * Non-blocking — caller does NOT need to await this.
   */
  async saveDevice(userId: string, req: Request): Promise<void> {
    try {
      const info = this.buildDeviceInfo(req);
      const ua = req.headers["user-agent"] || "";

      const location = info.geo
        ? `${info.geo.city ?? ""}, ${info.geo.regionName ?? ""}, ${info.geo.country ?? ""}`.trim()
        : null;

      await this.prisma.deviceInfo.upsert({
        where: { device_fingerprint: info.fingerprint as string },
        update: {
          ip_address: info.ip ?? "unknown",
          last_seen: new Date(),
          location,
        },
        create: {
          user_id: userId,
          device_name: `${info.browser} on ${info.os}`,
          device_fingerprint: info.fingerprint as string,
          ip_address: info.ip ?? "unknown",
          user_agent: ua,
          location,
          trusted: false,
          last_seen: new Date(),
        },
      });
    } catch (err) {
      // Device tracking should never break auth flow
      console.error("saveDevice failed silently:", err);
    }
  }
}
