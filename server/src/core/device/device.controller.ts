import { Controller, Get, Req, Res } from "@nestjs/common";
import { DeviceService } from "./device.service";
import type { Request, Response } from "express";
import { ResponseEntity } from "../../common/responser/response.entity";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";

@Public()
@Controller("device")
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Public()
  @Throttle({ auth: { limit: 5, ttl: 3600 } })
  @Get("info")
  DeviceInfo(@Req() req: Request, @Res() res: Response) {
    const device = this.deviceService.buildDeviceInfo(req);
    const response = ResponseEntity.success(
      200,
      "device data fetched successfully",
      device,
    );
    return res.json(response);
  }
}
