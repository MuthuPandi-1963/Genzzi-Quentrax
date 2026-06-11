import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ENV } from "../../config/env.Config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DeviceModule } from "src/core/device/device.module";
import { TokenService } from "src/common/service/token.service";
import {
  JWT_ACCESS_STRATEGY,
  JWT_REFRESH_STRATEGY,
} from "src/common/strategy/jwt.strategy";

@Module({
  imports: [
    DeviceModule,
    PassportModule.register({ defaultStrategy: "jwt-access-education" }),
    JwtModule.register({
      secret: ENV.ACCESS_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JWT_ACCESS_STRATEGY,
    JWT_REFRESH_STRATEGY,
  ],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
