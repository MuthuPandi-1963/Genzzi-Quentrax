import { Module } from "@nestjs/common";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { SessionModule } from "./session/session.module";
import { CoreModule } from "src/core/core.module";
import { DatabaseModule } from "src/database/database.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MailModule,
    AuthModule,
    SessionModule,
    CoreModule,
    DatabaseModule,
    JwtModule,
  ],
})
export class AppModule {}
