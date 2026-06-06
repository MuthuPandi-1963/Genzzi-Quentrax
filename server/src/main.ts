import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ENV } from "./config/env.Config";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { GlobalException } from "./common/exceptions/global.exceptions";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import compression from "compression";
import { CORS_CONFIG } from "./config/cors.config";
import express from "express";
import cookieParser from "cookie-parser";
import { SanitizePipe } from "./common/pipes/santize.pipe";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    rawBody: true,
    bodyParser: true,
  });
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use(
    cookieParser(ENV.JWT_SECRET), // signed cookies support
  );
  // Logger (pino)
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Trust proxy (IMPORTANT for rate limiter + real IP)
  app.set("trust proxy", 1);

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );
  app.use(compression());

  // CORS
  app.enableCors(CORS_CONFIG);

  // Global Validation (DTO protection)
  app.useGlobalPipes(
    new SanitizePipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalException());

  // Global Prefix
  app.setGlobalPrefix("/api/v1", {
    exclude: [{ path: "metrics", method: RequestMethod.GET }],
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(ENV.PORT ?? 4000);
}
void bootstrap();
