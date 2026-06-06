// src/common/response/response.sender.ts

import { HttpStatus } from "@nestjs/common";
import { ResponseEntity } from "./response.entity";

export class ResponseSender {
  static success<T>(
    data: T | null,
    message = "Success",
    statusCode: HttpStatus = HttpStatus.OK,
    meta?: Record<string, any>,
  ): ResponseEntity<T> {
    return ResponseEntity.success(statusCode, message, data, {
      code: "SUCCESS",
      meta,
    });
  }

  static error(
    message = "Error",
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code = "ERROR",
    meta?: Record<string, any>,
  ): ResponseEntity<null> {
    return ResponseEntity.error(statusCode, message, {
      code,
      meta,
    });
  }
}
