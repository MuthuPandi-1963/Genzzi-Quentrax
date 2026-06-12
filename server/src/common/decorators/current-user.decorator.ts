// src/common/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// This must match what your JwtStrategy returns (the JWT payload)
export interface AuthenticatedUser {
  sub: string; // auth.id (the 'sub' from JWT)
  authId: string; // same as sub, but explicit
  profileId: string; // userProfile.id
  role: string; // userProfile.role
}

interface RequestWithUser {
  user?: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof AuthenticatedUser | undefined,
    ctx: ExecutionContext,
  ): AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) return null;

    // If data is provided, return that specific property
    if (data) {
      return user[data] ?? null;
    }

    // Otherwise return full user object
    return user;
  },
);
