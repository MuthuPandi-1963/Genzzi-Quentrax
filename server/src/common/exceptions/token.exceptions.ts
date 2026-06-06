import { UnauthorizedException } from "@nestjs/common";
import {
  AUTH_ERROR_CODE,
  AUTH_ERROR_MESSAGE,
} from "../messages/auth-error.message";

interface AuthExceptionPayload {
  code: string;
  message: string;
}

export class BaseAuthException extends UnauthorizedException {
  constructor(payload: AuthExceptionPayload) {
    super({
      STATUS: "FAILED",
      SUCCESS: false,
      ERROR_CODE: payload.code,
      MESSAGE: payload.message,
    });
  }
}

export class AccessTokenExpiredException extends BaseAuthException {
  constructor() {
    super({
      code: AUTH_ERROR_CODE.ACCESS_TOKEN_EXPIRED,
      message: AUTH_ERROR_MESSAGE.ACCESS_TOKEN_EXPIRED,
    });
  }
}

export class AccessTokenInvalidException extends BaseAuthException {
  constructor() {
    super({
      code: AUTH_ERROR_CODE.ACCESS_TOKEN_INVALID,
      message: AUTH_ERROR_MESSAGE.ACCESS_TOKEN_INVALID,
    });
  }
}

export class RefreshTokenExpiredException extends BaseAuthException {
  constructor() {
    super({
      code: AUTH_ERROR_CODE.REFRESH_TOKEN_EXPIRED,
      message: AUTH_ERROR_MESSAGE.REFRESH_TOKEN_EXPIRED,
    });
  }
}

export class RefreshTokenInvalidException extends BaseAuthException {
  constructor() {
    super({
      code: AUTH_ERROR_CODE.REFRESH_TOKEN_INVALID,
      message: AUTH_ERROR_MESSAGE.REFRESH_TOKEN_INVALID,
    });
  }
}

export class RefreshTokenMissingException extends BaseAuthException {
  constructor() {
    super({
      code: AUTH_ERROR_CODE.REFRESH_TOKEN_MISSING,
      message: AUTH_ERROR_MESSAGE.REFRESH_TOKEN_MISSING,
    });
  }
}
