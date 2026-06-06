// src/common/entities/response.entity.ts

export interface BaseResponse<T = unknown> {
  statusCode: number; // MANDATORY
  success: boolean; // MANDATORY
  message: string; // MANDATORY
  data: T | null; // MANDATORY

  // Optional fields
  code?: string;
  meta?: Record<string, any> | null;
  path?: string;
  timestamp?: string;
}

export class ResponseEntity<T = unknown> implements BaseResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;

  code?: string;
  meta?: Record<string, any> | null;
  path?: string;
  timestamp?: string;

  constructor(payload: BaseResponse<T>) {
    this.statusCode = payload.statusCode;
    this.success = payload.success;
    this.message = payload.message;
    this.data = payload.data ?? null;

    this.code = payload.code;
    this.meta = payload.meta ?? null;
    this.path = payload.path;
    this.timestamp = payload.timestamp ?? new Date().toISOString();
  }

  static success<T>(
    statusCode: number,
    message: string,
    data: T | null = null,
    options?: {
      code?: string;
      meta?: Record<string, any>;
      path?: string;
    },
  ): ResponseEntity<T> {
    return new ResponseEntity<T>({
      statusCode,
      success: true,
      message,
      data,
      code: options?.code ?? "SUCCESS",
      meta: options?.meta ?? null,
      path: options?.path,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    statusCode: number,
    message: string,
    options?: {
      code?: string;
      meta?: Record<string, any>;
      path?: string;
    },
  ): ResponseEntity<null> {
    return new ResponseEntity<null>({
      statusCode,
      success: false,
      message,
      data: null,
      code: options?.code ?? "ERROR",
      meta: options?.meta ?? null,
      path: options?.path,
      timestamp: new Date().toISOString(),
    });
  }
}
