import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { AccessTokenInvalidException } from "../exceptions/token.exceptions";

@Injectable()
export class GlobalAuthGuard extends AuthGuard("jwt-access") {
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

    if (isPublic) {
      return true;
    }

    const refreshGuardUsed = this.reflector.getAllAndOverride<boolean>(
      "refreshOnly",
      [context.getHandler(), context.getClass()],
    );

    if (refreshGuardUsed) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: Error | null, user: TUser | null): TUser {
    if (err) {
      throw err;
    }

    if (!user) {
      throw new AccessTokenInvalidException();
    }

    return user;
  }
}

@Injectable()
export class JWTRefreshGuard extends AuthGuard("jwt-refresh") {}
