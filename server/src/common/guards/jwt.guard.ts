import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Observable } from "rxjs";
import { AuthenticatedUser } from "src/app/auth/auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt-access-education") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest<TUser = AuthenticatedUser>(
    err: any,
    user: any,
    info: { message: string },
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException(
        info?.message ?? "Access token missing or invalid",
      );
    }

    return user as TUser;
  }
}
