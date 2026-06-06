import { Module } from "@nestjs/common";
import { SessionTokenService } from "./session.service";
import { SessionTokenController } from "./session.controller";
import { DatabaseModule } from "src/database/database.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [DatabaseModule,JwtModule],
  controllers: [SessionTokenController],
  providers: [SessionTokenService],
})
export class SessionModule {}
