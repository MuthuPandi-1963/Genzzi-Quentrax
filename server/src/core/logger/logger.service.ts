import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class LoggerService {
  constructor(private readonly logger: PinoLogger) {}

  setContext(context: string) {
    this.logger.setContext(context);
  }

  log(message: string, data?: any) {
    this.logger.info(data || {}, message);
  }

  error(message: string, error?: unknown) {
    this.logger.error({ err: error }, message);
  }

  warn(message: string, data?: any) {
    this.logger.warn(data || {}, message);
  }

  debug(message: string, data?: any) {
    this.logger.debug(data || {}, message);
  }
}
