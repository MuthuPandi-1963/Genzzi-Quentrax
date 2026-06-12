import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { type Response, type Request } from "express";
import { Throttle } from "@nestjs/throttler";
import { ResponseSender } from "../../common/responser/response.sender";
import { AuthService } from "./auth.service";
import { OAuthCallbackDto } from "./dto/auth.dto";
import { GenzziConfig } from "src/config/genzzi.config";
import { Public } from "src/common/decorators/public.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "./auth.service";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Login ───────────────────────────────────────────────────────────────────

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post("genzzi/login")
  @HttpCode(HttpStatus.OK)
  async oauthGenzziLogin(@Req() req: Request, @Res() res: Response) {
    try {
      // 1. Delegate to Genzzi OAuth
      await GenzziConfig.oauthAuthorize(req, res, () => {});

      const genzziData = res.genzzi;
      if (!genzziData?.token || !genzziData?.profile) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseSender.error("OAuth authorization failed"));
      }

      const profile = plainToInstance(OAuthCallbackDto, genzziData.profile);
      await validateOrReject(profile);
      if (!profile.sub) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseSender.error("Invalid OAuth profile — missing sub"));
      }

      // 2. Upsert user, issue our own tokens
      const { accessToken, refreshToken } =
        await this.authService.oauthCallback(req, profile);

      // 3. Set HttpOnly cookies
      res.cookie("access-token-education", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_TTL_MS,
      });
      res.cookie("refresh-token-education", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_TTL_MS,
      });
    } catch (errors) {
      console.log("errors", errors);
      const messages = (errors as ValidationError[])
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ResponseSender.error(`Invalid OAuth profile: ${messages}`));
    }

    return res
      .status(HttpStatus.OK)
      .json(ResponseSender.success(null, "Authenticated successfully"));
  }

  // ── Refresh ─────────────────────────────────────────────────────────────────

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies = req.cookies as Record<string, string>;

    const refreshToken = cookies["refresh-token-education"];

    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie("access-token-education", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_TTL_MS,
    });

    res.cookie("refresh-token-education", newRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_TTL_MS,
    });

    return res
      .status(HttpStatus.OK)
      .json(ResponseSender.success(null, "Token refreshed successfully"));
  }

  // ── Logout ──────────────────────────────────────────────────────────────────

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies["refresh-token-education"];

    await this.authService.logout(refreshToken);

    res.clearCookie("access-token-education", { path: "/" });
    res.clearCookie("refresh-token-education", { path: "/" });

    return res
      .status(HttpStatus.OK)
      .json(ResponseSender.success(null, "Logged out successfully"));
  }

  // ── Me ───────────────────────────────────────────────────────────────────────

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser, @Res() res: Response) {
    const profile = await this.authService.getProfile(user.authId);
    return res
      .status(HttpStatus.OK)
      .json(ResponseSender.success(profile, "Profile fetched"));
  }
}
