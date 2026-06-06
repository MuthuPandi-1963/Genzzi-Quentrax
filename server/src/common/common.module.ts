// src/common/common.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TokenService } from "./service/token.service";
import { DatabaseModule } from "src/database/database.module";
import { CoreModule } from "src/core/core.module";
import {
  JWT_ACCESS_STRATEGY,
  JWT_REFRESH_STRATEGY,
} from "./strategy/jwt.strategy";
import { ENV } from "src/config/env.Config";

@Module({
  imports: [
    DatabaseModule, // ← RedisService for TokenService
    CoreModule, // ← LoggerService for TokenService
    PassportModule.register({ defaultStrategy: "jwt-access" }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: ENV.ACCESS_SECRET,
        signOptions: { expiresIn: Number(ENV.ACCESS_EXPIRATION) },
      }),
    }),
  ],
  providers: [
    TokenService,
    JWT_ACCESS_STRATEGY, // ← strategies live here with their deps
    JWT_REFRESH_STRATEGY,
  ],
  exports: [
    TokenService,
    JWT_ACCESS_STRATEGY,
    JWT_REFRESH_STRATEGY,
    PassportModule,
    JwtModule,
    DatabaseModule, // ← re-export so importers get RedisService too
  ],
})
export class CommonModule {}
