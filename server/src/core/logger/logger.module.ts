// logger.module.ts
import { Global, Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { loggerConfig } from "./logger.config";
import { PinoLogger, LoggerModule as PinoLoggerModule } from "nestjs-pino";

@Global()
@Module({
  imports: [PinoLoggerModule.forRoot(loggerConfig)],
  providers: [
    LoggerService,
    {
      provide: "PINOLOGGER", // Custom provider if needed
      useClass: PinoLogger,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
