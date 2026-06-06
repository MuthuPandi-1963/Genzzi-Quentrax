import { MiddlewareConsumer, Module } from "@nestjs/common";
import { DeviceModule } from "./device/device.module";
import { LoggerModule } from "./logger/logger.module";
import { HttpLoggerMiddleware } from "../common/middleware/http.middleware";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [LoggerModule, DeviceModule, SocketModule],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*path");
  }
}
