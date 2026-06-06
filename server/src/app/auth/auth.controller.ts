// src/app/auth/auth.controller.ts
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { type Response, type Request } from "express";
import { Throttle } from "@nestjs/throttler";
import { ResponseSender } from "../../common/responser/response.sender";
import { AuthService } from "./auth.service";
import { OAuthCallbackDto } from "./dto/auth.dto";
import { GenzziConfig } from "src/config/genzzi.config";
import { SendCookie } from "src/config/cookie.config";
import { ENV } from "src/config/env.Config";
import { Public } from "src/common/decorators/public.decorator";

// ───────────────────────────────────────────
// Type Definitions for Genzzi OAuth Response
// ───────────────────────────────────────────

interface GenzziTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
}

// interface GenzziProfile {
//   sub: string;
//   email: string;
//   username?: string;
//   phone?: string;
//   picture?: string;
//   [key: string]: unknown;
// }

// interface GenzziOAuthData {
//   token: GenzziTokenResponse;
//   profile: GenzziProfile;
// }

// Extend Express Response to include genzzi property

interface GenzziIntrospectResponse {
  active?: boolean;
  data?: {
    sub?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// ───────────────────────────────────────────
// Controller
// ───────────────────────────────────────────

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post("/genzzi/login")
  async oauthGenzziLogin(@Req() req: Request, @Res() res: Response) {
    await GenzziConfig.oauthAuthorize(req, res, () => {});

    const genzziData = res.genzzi;
    if (!genzziData) {
      return res
        .status(400)
        .json(
          ResponseSender.error("OAuth authorization failed — no data received"),
        );
    }

    const tokens = genzziData.token as GenzziTokenResponse;
    const profile = genzziData.profile as OAuthCallbackDto;

    if (!tokens?.access_token || !profile?.sub) {
      return res
        .status(400)
        .json(
          ResponseSender.error(
            "OAuth authorization failed — invalid tokens or profile",
          ),
        );
    }

    // Store OAuth tokens in cookies
    SendCookie(res, "refresh-token-mail", tokens.refresh_token ?? "");
    SendCookie(res, "access-token-mail", tokens.access_token ?? "");

    // Upsert local user
    await this.authService.oauthCallback(req, profile, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });

    return res
      .status(200)
      .json(ResponseSender.success({ profile }, "Authenticated successfully"));
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies = req.cookies as { "refresh-token-mail"?: string };
    const refreshToken = cookies["refresh-token-mail"];

    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    // One-time check: ask Genzzi if it's still valid
    const check: unknown = await GenzziConfig.introspect(refreshToken);

    return res.status(200).json(ResponseSender.success(null, "Token verified"));
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const cookies = req.cookies as {
      "refresh-token-mail"?: string;
      "access-token-mail"?: string;
    };
    const refreshToken = cookies["refresh-token-mail"];
    const accessToken = cookies["access-token-mail"];

    if (refreshToken) {
      try {
        const response: unknown = await GenzziConfig.revokeToken({
          token: refreshToken,
          token_type: "refresh_token",
        });
      } catch (error) {
        console.error("Token revocation failed:", error);
      }
    }

    // Clear cookies
    res.clearCookie("refresh-token-mail");
    res.clearCookie("access-token-mail");

    const result = await this.authService.logout(accessToken ?? "");
    return res.status(result.statusCode).json(result);
  }

  @Public()
  @Get("me")
  async me(@Req() req: Request, @Res() res: Response) {
    const cookies = req.cookies as {
      "access-token-mail"?: string;
      "refresh-token-mail"?: string;
    };
    const accessToken = cookies["access-token-mail"];
    const refreshToken = cookies["refresh-token-mail"];

    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    if (!accessToken) {
      throw new UnauthorizedException("No access token provided");
    }

    // One-time OAuth verification
    const introspect: GenzziIntrospectResponse = (await GenzziConfig.introspect(
      refreshToken,
    )) as GenzziIntrospectResponse;

    // Extract user identifier from introspect response
    const userId = introspect.data?.sub;
    if (!userId) {
      throw new UnauthorizedException("Invalid or expired OAuth token");
    }

    const profile = await this.authService.getProfile(
      `${userId}_${ENV.GENZZI_CLIENT_ID}`,
    );
    return res
      .status(HttpStatus.OK)
      .json(ResponseSender.success(profile, "Profile fetched"));
  }
}
