import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { AssessmentAttemptsService } from "./assessment-attempts.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { UpdateAttemptDto } from "./dto/update-attempt.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("assessment-attempts")
export class AssessmentAttemptsController {
  constructor(private readonly service: AssessmentAttemptsService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const items = await this.service.findAll();
    return ResponseSender.success(items, "Attempts fetched successfully", 200);
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const item = await this.service.findOne(id);
    return ResponseSender.success(item, "Attempt fetched successfully");
  }

  @Public()
  @Get("assessment/:assessmentId")
  @HttpCode(HttpStatus.OK)
  async findByAssessmentId(@Param("assessmentId") assessmentId: string) {
    const items = await this.service.findByAssessmentId(assessmentId);
    return ResponseSender.success(items, "Attempts fetched successfully", 200);
  }

  @Public()
  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async findByUserId(@Param("userId") userId: string) {
    const items = await this.service.findByUserId(userId);
    return ResponseSender.success(items, "Attempts fetched successfully", 200);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAttemptDto) {
    const item = await this.service.create(dto);
    return ResponseSender.success(item, "Attempt created successfully", 201);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateAttemptDto) {
    const item = await this.service.update(id, dto);
    return ResponseSender.success(item, "Attempt updated successfully");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.service.remove(id);
    return ResponseSender.success(null, "Attempt deleted successfully");
  }
}
