import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { LoggerService } from "../core/logger/logger.service";

// ─────────────────────────────────────────────────────────────────────────────
// PRISMA SERVICE
//
// Prisma 6 + @prisma/adapter-pg changes:
//
//  1. PrismaPg accepts a connection string directly — no need to instantiate
//     a pg.Pool manually. Passing Pool still works but the overload that
//     accepted it was removed in the adapter's type definitions, which caused
//     the "Unsafe construction / assignment" ESLint errors.
//
//  2. $on() event types ("query" | "info" | "warn" | "error") are typed as
//     `never` when a driver adapter is active because the adapter takes over
//     the query pipeline and those low-level events are no longer fired by
//     Prisma itself. The $on calls must be removed or guarded.
//     Use middleware ($use) or Prisma's built-in tracing instead.
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }

    // PrismaPg accepts the connection string directly in Prisma 6.
    // Do NOT wrap in pg.Pool — the adapter manages its own pool internally.
    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
      errorFormat: "pretty",

      // ── Logging ─────────────────────────────────────────────────────────────
      // When a driver adapter is active, Prisma's built-in event emitter
      // ($on "query" / "info" / "warn" / "error") is disabled — those events
      // are never fired and the parameter type resolves to `never`.
      //
      // Use the `log` array with emit:"stdout" for development console output,
      // or wire up OpenTelemetry tracing for production observability.
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["warn", "error"],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      // $on() is intentionally omitted — not available with driver adapters.
      // Query-level observability can be added via Prisma middleware ($use):
      //
      //   this.$use(async (params, next) => {
      //     const before = Date.now();
      //     const result = await next(params);
      //     this.logger.debug(`${params.model}.${params.action} — ${Date.now() - before}ms`);
      //     return result;
      //   });

      await this.$connect();
      this.logger.log("Prisma connected successfully");
    } catch (error: unknown) {
      this.logger.error("Prisma connection failed", error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      this.logger.log("Prisma disconnected successfully");
    } catch (error: unknown) {
      this.logger.error("Prisma disconnect failed", error);
    }
  }
}
