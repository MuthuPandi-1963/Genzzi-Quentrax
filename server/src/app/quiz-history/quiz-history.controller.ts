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
  Req,
} from "@nestjs/common";
import { QuizHistoryService } from "./quiz-history.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateQuizHistoryDto } from "./dto/create-quiz-history.dto";
import { UpdateQuizHistoryDto } from "./dto/update-quiz-history.dto";
import { BulkCreateQuizHistoryDto } from "./dto/bulk-create-quiz-history.dto";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("quiz-history")
@UseGuards(JwtAuthGuard)
export class QuizHistoryController {
  constructor(private readonly quizHistoryService: QuizHistoryService) {}

  // ── All routes require authentication ───────────────────────────────────────

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateQuizHistoryDto, @Req() req: Request) {
    // Extract userId from authenticated user or body fallback
    const userId =
      (req as unknown as { user: { id: string } }).user?.id || dto.userId;
    const history = await this.quizHistoryService.create({ ...dto, userId });
    return ResponseSender.success(
      history,
      "Quiz attempt recorded successfully",
      201,
    );
  }

  @Post("many")
  @UseGuards(RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateQuizHistoryDto) {
    await this.quizHistoryService.createMany(dto);
    return ResponseSender.success(
      null,
      "Quiz histories created successfully",
      201,
    );
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles("STAFF", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.quizHistoryService.findAll();
    return ResponseSender.success(
      result.quizHistories,
      "Quiz history fetched successfully",
      200,
    );
  }

  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async findByUserId(@Param("userId") userId: string) {
    const histories = await this.quizHistoryService.findByUserId(userId);
    return ResponseSender.success(
      histories,
      "User quiz history fetched successfully",
      200,
    );
  }

  @Get("quiz/:quizId")
  @HttpCode(HttpStatus.OK)
  async findByQuizId(@Param("quizId") quizId: string) {
    const histories = await this.quizHistoryService.findByQuizId(quizId);
    return ResponseSender.success(
      histories,
      "Quiz history fetched successfully",
      200,
    );
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const history = await this.quizHistoryService.findOne(id);
    return ResponseSender.success(history, "Quiz history fetched successfully");
  }

  @Put(":id")
  @UseGuards(RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateQuizHistoryDto) {
    const history = await this.quizHistoryService.update(id, dto);
    return ResponseSender.success(history, "Quiz history updated successfully");
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.quizHistoryService.remove(id);
    return ResponseSender.success(null, "Quiz history deleted successfully");
  }
}
