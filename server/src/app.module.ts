import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { MetricsModule } from "./metrics/metrics.module";
import { HealthModule } from "./health/health.module";
import { ConfigModule } from "@nestjs/config";
import { CoreModule } from "./core/core.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { THROTTLER_CONFIG } from "./common/throttler/global-throttler";
import { APP_GUARD } from "@nestjs/core";
import { CustomThrottlerGuard } from "./common/guards/throttler.guard";
import { RedisService } from "./database/redis.service";
import { AppModule as MainModule } from "./app/app.module";
import { DeviceInfoMiddleware } from "./common/middleware/device-info.middleware";
import { CommonModule } from "./common/common.module";
import { DeviceModule } from "./core/device/device.module";
import { AuthModule } from "./app/auth/auth.module";
import { RawBodyMiddleware } from "./common/middleware/raw-body.middleware";
import { JwtAuthGuard } from "./common/guards/jwt.guard";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory: () => THROTTLER_CONFIG(),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MetricsModule,
    HealthModule,
    CoreModule,
    MainModule,
    CommonModule,
    DeviceModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // ← JWTRefreshGuard removed — plain provider here does nothing
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes("mail/receive");
    consumer
      .apply(DeviceInfoMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
