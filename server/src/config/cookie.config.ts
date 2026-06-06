import { ENV } from "./env.Config";
import { Response } from "express";

const isProd = ENV.NODE_ENV === "prod";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd, // HTTPS only in production
  sameSite: isProd ? "none" : "lax", // critical fix
  signed: false,
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  path: "/api/v1", // must be root
} as const;

interface CookieOptions {
  signed?: boolean;
  path?: string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const SendCookie = (
  res: Response,
  name: string,
  token: string,
  options?: CookieOptions,
) => {
  res.cookie(name, token, {
    ...COOKIE_OPTIONS,
    ...options,
  });
};
