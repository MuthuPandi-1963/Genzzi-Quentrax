/* eslint-disable @typescript-eslint/no-empty-object-type */
// token.types.ts
export interface TokenPayloadBase {
  sub: string; // userId
  deviceId: string;
  role: string; // ✅ single role
  [key: string]: any;
  scope?: string; // space-separated scopes
}

export interface RefreshTokenPayload extends TokenPayloadBase {}

export interface AccessTokenPayload extends TokenPayloadBase {}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RotatedTokenResult {
  userId: string;
  refreshToken: string;
}
