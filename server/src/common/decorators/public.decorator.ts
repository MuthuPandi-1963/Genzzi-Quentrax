import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/**
 * @Public()
 * Skip JWT authentication for this route.
 * Must be used with JwtAuthGuard that checks for this metadata.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
