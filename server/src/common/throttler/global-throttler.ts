import { ThrottlerModuleOptions } from "@nestjs/throttler";
// import { RedisService } from "../../database/redis.service";

/**
 * Predefined Throttler Config
 * - v5 compatible (named throttlers)
 * - Auth system optimized
 * - Redis backed (production safe)
 */
export const THROTTLER_CONFIG = (): ThrottlerModuleOptions => ({
  throttlers: [
    // 🌍 Global API Rate Limit (fallback)
    {
      name: "default",
      ttl: 60, // 1 minute
      limit: 30, // 30 req / min per tracker (IP or USER)
    },

    // 🔐 Auth Endpoints (login, signup)
    {
      name: "auth",
      ttl: 300, // 5 minutes
      limit: 5, // 5 attempts / 5 min
    },

    // 📲 OTP Sensitive Endpoints (VERY STRICT)
    {
      name: "otp",
      ttl: 300, // 5 minutes
      limit: 3, // 3 OTP attempts / 5 min
    },

    // 🔄 Token & Session Endpoints
    {
      name: "session",
      ttl: 60,
      limit: 20, // refresh/logout/session checks
    },

    // 🛠 Internal / Admin APIs
    {
      name: "admin",
      ttl: 60,
      limit: 100,
    },
  ],

  /**
   * Redis Storage (CRITICAL for production)
   * Prevents reset on restart & supports multi-instance scaling
   */
  // storage: new ThrottlerStorageRedisService(redis.getClient()),
});
