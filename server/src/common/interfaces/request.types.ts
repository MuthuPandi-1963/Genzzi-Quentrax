import { type Request } from "express";
import { type DeviceInfo } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Extend Express's Request — NOT the global fetch API Request.
//
// The global `Request` (from lib.dom.d.ts / undici) carries a `Headers`
// object that has no `authorization` property, which is why TypeScript
// reported "Property 'authorization' does not exist on type 'Headers'".
//
// Express's `Request` types headers as `IncomingHttpHeaders` (from Node's
// `http` module), which is a plain object keyed by lowercase header names —
// so `req.headers.authorization` resolves correctly as `string | undefined`.
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string;
  sub: string;
  email: string;
  username: string;
  picture: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  device: DeviceInfo;
  accessJti: string;
}
