import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { ENV } from "../config/env.Config";
import { LoggerService } from "../core/logger/logger.service";
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: LoggerService) {}
  private client!: Redis;

  onModuleInit() {
    const redisConfig = {
      host: ENV.REDIS_HOST,
      port: ENV.REDIS_PORT,
      password: ENV.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    };

    this.client = new Redis(redisConfig);
    this.logger.log("Redis Connected Successfully");
    this.client.on("error", (err) => this.logger.error("Redis error", err));
  }

  getClient(): Redis {
    return this.client;
  }
  async set(key: string, value: any, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }
  async getRaw(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async get(key: string): Promise<string | null> {
    const data = (await this.client.get(key)) as string;
    if (data) {
      try {
        return JSON.parse(data) as string;
      } catch (err) {
        this.logger.error("Failed to parse Redis data", err);
        return null;
      }
    }
    return null;
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async incr(key: string, ttlSeconds?: number) {
    const count = await this.client.incr(key);
    if (count === 1 && ttlSeconds) {
      await this.client.expire(key, ttlSeconds);
    }
    return count;
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch (err) {
      this.logger.error("Error closing Redis connection", err);
    }
  }
}
