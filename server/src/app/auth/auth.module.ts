import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ENV } from "../../config/env.Config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DeviceModule } from "src/core/device/device.module";

@Module({
  imports: [
    DeviceModule,
    JwtModule.register({
      secret: ENV.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
