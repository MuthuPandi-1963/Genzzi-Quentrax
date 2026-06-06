import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
  };
}

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: AuthenticatedRequest): Promise<string> {
    // Prefer user ID if authenticated
    if (req.user?.id) {
      return `USER_${req.user.id}`;
    }

    // Fallback to proxy-safe IP
    const forwarded = req.headers["x-forwarded-for"];

    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }

    return req.ip ?? "";
  }
}
