import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { BulkCreateTopicDto } from "./dto/bulk-create-topic.dto";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("topics")
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  // ── Public Routes ─────────────────────────────────────────────────────────

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query("categoryId") categoryId?: string) {
    const result = await this.topicsService.findAll(categoryId);
    return ResponseSender.success(
      result.topics,
      "Topics fetched successfully",
      200,
    );
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const topic = await this.topicsService.findOne(id);
    return ResponseSender.success(topic, "Topic fetched successfully");
  }

  // ── Protected Admin/Staff Routes ──────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTopicDto) {
    const topic = await this.topicsService.create(dto);
    return ResponseSender.success(topic, "Topic created successfully", 201);
  }

  @Post("many")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateTopicDto) {
    await this.topicsService.createMany(dto);
    return ResponseSender.success(null, "Topics created successfully", 201);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateTopicDto) {
    const topic = await this.topicsService.update(id, dto);
    return ResponseSender.success(topic, "Topic updated successfully");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.topicsService.remove(id);
    return ResponseSender.success(null, "Topic deleted successfully");
  }
}
