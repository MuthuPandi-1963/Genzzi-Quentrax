import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

/**
 * RolesGuard
 * ──────────
 * Checks if the authenticated user has one of the required roles.
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles("ADMIN", "STAFF")
 *
 * Assumes JwtAuthGuard has already populated req.user with the authenticated user.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Collect required roles from handler + class level
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No roles required → allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2. Extract user from request (set by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException("Access denied — user not authenticated");
    }

    // 3. Check if user role matches any required role
    const userRole = user.role;

    if (!userRole) {
      throw new ForbiddenException("Access denied — user has no role assigned");
    }

    const hasRole = requiredRoles.some((role) => role === userRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied — required roles: ${requiredRoles.join(", ")}`,
      );
    }

    return true;
  }
}
