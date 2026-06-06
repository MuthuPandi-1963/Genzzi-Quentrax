import { Controller, Get, Res } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import type { Response } from "express";

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}
  @Get()
  async metrics(@Res() res: Response) {
    res.set("Content-Type", "text/plain");
    res.send(await this.metricsService.getMetrics());
  }
}
