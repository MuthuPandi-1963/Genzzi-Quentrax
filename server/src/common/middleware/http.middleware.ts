import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { PinoLogger } from "nestjs-pino";

// `req.requestId` is declared globally in src/types/express/index.d.ts.
// No augmentation needed here — importing this file already makes it a module,
// which would scope any `declare global` block and prevent it from merging.

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: PinoLogger) {}

  private extractRealIP(req: Request): string | null {
    const forwarded = req.headers["x-forwarded-for"];

    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }

    return req.socket.remoteAddress ?? req.ip ?? null;
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();

    const headerRequestId = req.headers["x-request-id"];

    // req.id is typed as ReqId (string | number | object).
    // Guard out the object case — String({}) gives '[object Object]', which is
    // useless as a request ID. Only accept string | number primitives.
    const rawId = req.id;
    const reqId =
      typeof rawId === "string" || typeof rawId === "number"
        ? String(rawId)
        : undefined;

    const requestId =
      (typeof headerRequestId === "string" && headerRequestId) ||
      reqId ||
      randomUUID();

    req.requestId = requestId;

    res.setHeader("x-request-id", requestId);

    const ip = this.extractRealIP(req);

    const userAgent =
      typeof req.headers["user-agent"] === "string"
        ? req.headers["user-agent"]
        : "unknown";

    const { method, originalUrl } = req;

    res.on("finish", () => {
      const duration = Number(process.hrtime.bigint() - start) / 1_000_000;

      this.logger.info({
        type: "HTTP_REQUEST",
        msg: "HTTP request received",
        requestId,
        method,
        path: originalUrl,
        statusCode: res.statusCode,
        ip,
        userAgent,
        responseTimeMs: Number(duration.toFixed(2)),
        contentLength: res.getHeader("content-length") ?? 0,
        timestamp: new Date().toISOString(),
      });
    });

    res.on("error", (error: Error) => {
      this.logger.error({
        type: "HTTP_ERROR",
        msg: error.message,
        requestId,
        method,
        path: originalUrl,
        ip,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}
