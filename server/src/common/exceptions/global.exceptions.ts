import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ResponseEntity } from "../responser/response.entity";

// ── Proper types instead of any ─────────────────────────────────────────────

interface PrismaError {
  code: string;
  meta?: Record<string, unknown>;
  message?: string;
}

interface ValidationError {
  status: number;
  response: {
    message: string | string[];
  };
}

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
}

type ErrorDetails =
  | { message?: string | string[]; error?: string }
  | Record<string, unknown>
  | string
  | string[]
  | null;

// ────────────────────────────────────────────────────────────────────────────

@Catch()
export class GlobalException implements ExceptionFilter {
  private readonly logger = new Logger(GlobalException.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isProduction = process.env.NODE_ENV === "prod";

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let errorCode = "UNHANDLED_EXCEPTION";
    let details: ErrorDetails = null;

    // 1️⃣ NestJS HttpException
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | HttpExceptionResponse;

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else {
        message = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(", ")
          : (exceptionResponse.message ?? message);

        errorCode = exceptionResponse.error ?? "HTTP_EXCEPTION";
        details = exceptionResponse;
      }
    }

    // 2️⃣ Prisma errors
    else if (this.isPrismaError(exception)) {
      const prismaError = exception;

      switch (prismaError.code) {
        case "P2002":
          statusCode = HttpStatus.CONFLICT;
          message = "Unique constraint violation";
          errorCode = "PRISMA_UNIQUE_CONSTRAINT";
          break;

        case "P2025":
          statusCode = HttpStatus.NOT_FOUND;
          message = "Record not found";
          errorCode = "PRISMA_RECORD_NOT_FOUND";
          break;

        default:
          statusCode = HttpStatus.BAD_REQUEST;
          message = "Database error";
          errorCode = "PRISMA_ERROR";
      }

      details = prismaError.meta ?? null;
    }

    // 3️⃣ Validation errors
    else if (this.isValidationError(exception)) {
      const validationError = exception;
      statusCode = HttpStatus.BAD_REQUEST;
      message = "Validation failed";
      errorCode = "VALIDATION_ERROR";
      details = validationError.response?.message ?? null;
    }

    // 🔒 Log internally
    this.logger.error({
      errorCode,
      method: request.method,
      url: request.url,
      statusCode,
      message:
        exception instanceof Error ? exception.message : String(exception),
      exceptionType: exception?.constructor?.name ?? typeof exception,
      stack: exception instanceof Error ? exception.stack : undefined,
      details,
    });

    response.status(statusCode).json(
      ResponseEntity.error(statusCode, message, {
        code: errorCode,
        meta: !isProduction && details !== null ? { details } : undefined,
        path: request.url,
      }),
    );
  }

  private isPrismaError(exception: unknown): exception is PrismaError {
    return (
      typeof exception === "object" &&
      exception !== null &&
      "code" in exception &&
      typeof (exception as Record<string, unknown>).code === "string" &&
      ((exception as Record<string, unknown>).code as string).startsWith("P")
    );
  }

  private isValidationError(exception: unknown): exception is ValidationError {
    return (
      typeof exception === "object" &&
      exception !== null &&
      "status" in exception &&
      (exception as Record<string, unknown>).status === 400 &&
      "response" in exception &&
      typeof (exception as Record<string, unknown>).response === "object" &&
      (exception as Record<string, unknown>).response !== null &&
      "message" in ((exception as Record<string, unknown>).response as object)
    );
  }
}
