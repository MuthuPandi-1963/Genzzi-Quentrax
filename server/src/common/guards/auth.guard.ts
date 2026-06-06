import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthService } from "src/app/auth/auth.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ── 1. @IsPublic() → skip immediately ────────────────────────────────
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // method decorator wins
      context.getClass(), // then class decorator
    ]);

    if (isPublic) {
      this.logger.debug("Route is public — skipping auth");
      return true;
    }

    // ── 2. Cookie must be present ─────────────────────────────────────────
    const request = context.switchToHttp().getRequest<Request>();
    const rawCookie = request.cookies["refresh-token-mail"];
    if (!rawCookie) {
      throw new UnauthorizedException("No session cookie provided");
    }

    // ── 3. Call introspection API ─────────────────────────────────────────
    const response = await this.authService.introspect(rawCookie);
    if (!response) {
      throw new UnauthorizedException("Token introspection failed");
    }

    // ── 4. Check top-level success flag ───────────────────────────────────
    if (!response.success) {
      this.logger.warn(`Introspection rejected: ${response.message}`);
      throw new UnauthorizedException(response.message ?? "Unauthorized");
    }

    // ── 5. Check active flag inside data ─────────────────────────────────
    if (!response.data?.active) {
      this.logger.warn("Token is not active");
      throw new UnauthorizedException("Token is inactive or expired");
    }

    // ── 6. Check token expiry as a safety net ────────────────────────────
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (response.data.exp && response.data.exp < nowSeconds) {
      this.logger.warn(`Token expired at ${response.data.exp}`);
      throw new UnauthorizedException("Token has expired");
    }

    // ── 7. Attach clean user object to request ───────────────────────────
    request["user"] = this.authService.buildUser(response.data);

    return true;
  }
}
