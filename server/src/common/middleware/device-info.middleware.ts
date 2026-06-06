// src/common/middleware/device-info.middleware.ts

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { DeviceService } from "src/core/device/device.service";

@Injectable()
export class DeviceInfoMiddleware implements NestMiddleware {
  constructor(private readonly deviceInfoService: DeviceService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // console.log('cookies', req.cookies, req.signedCookies);

    req["deviceInfo"] = this.deviceInfoService.buildDeviceInfo(req);
    next();
  }
}
