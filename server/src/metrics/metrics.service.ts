import { Injectable } from "@nestjs/common";
import * as client from "prom-client";

@Injectable()
export class MetricsService {
  private readonly register = new client.Registry();
  private readonly httpDuration: client.Histogram<string>;

  constructor() {
    client.collectDefaultMetrics({ register: this.register });

    this.httpDuration = new client.Histogram({
      name: "http_request_duration_seconds",
      help: "HTTP request duration",
      labelNames: ["method", "route", "status"],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.register],
    });
  }

  startTimer() {
    return this.httpDuration.startTimer();
  }

  async getMetrics() {
    return this.register.metrics();
  }
}
