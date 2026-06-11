import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ENV } from "./env.Config";

const parseOrigins = (origins?: string): string[] => {
  if (!origins) return [];
  return origins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
};

const ALLOWED_ORIGINS = [
  ENV.WEB_CLIENT_URL,
  ...parseOrigins(ENV.ALLOWED_ORIGINS), // e.g: https://app.com,https://admin.com
].filter(Boolean);

export const CORS_CONFIG: CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server & tools like Postman (no origin)
    if (!origin) {
      return callback(null, true);
    }

    // Strict allowlist check (production safe)
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS BLOCKED: ${origin}`), false);
  },

  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],

  credentials: true, // required for cookies / OAuth sessions

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-mobile-client",
    "x-device-id",
    "x-access-token",
    "x-refresh-token-education",
  ],

  exposedHeaders: ["x-access-token", "x-refresh-token-education"],

  maxAge: 86400, // 24 hours preflight cache (performance boost)
  optionsSuccessStatus: 204,
};
