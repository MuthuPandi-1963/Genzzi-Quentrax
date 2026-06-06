import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../database/prisma.service";
import { ENV } from "../../config/env.Config";
import { AuthenticatedRequest } from "../interfaces/request.types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException("No token provided");

    try {
      const payload = this.jwtService.verify<{
        sub: string;
        deviceId: string;
        jti: string;
      }>(token, {
        secret: ENV.JWT_SECRET,
        ignoreExpiration: false,
      });

      const session = await this.prisma.sessionToken.findUnique({
        where: { access_jti: payload.jti },
        include: { user: true, device: true },
      });

      if (
        !session ||
        session.revoked_at ||
        new Date() > new Date(session.expires_at)
      ) {
        throw new UnauthorizedException("Session revoked or expired");
      }

      request.user = session?.user as AuthenticatedRequest["user"];
      request.device = session.device;
      request.session = session;
      request.accessJti = payload.jti;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }

  private extractToken(req: AuthenticatedRequest): string | undefined {
    const auth =
      req.headers?.authorization ??
      (req.cookies["refresh-token-mail"] as string);
    return auth?.split(" ")[1] ?? auth;
  }
}
