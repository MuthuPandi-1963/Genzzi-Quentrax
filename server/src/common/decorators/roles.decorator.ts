import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

/**
 * @Roles("ADMIN", "STAFF")
 * Apply to controller methods to restrict access to specific user roles.
 * Must be used with RolesGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
