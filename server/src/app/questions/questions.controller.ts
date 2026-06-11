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
import { QuestionsService } from "./questions.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { BulkCreateQuestionDto } from "./dto/bulk-create-question.dto";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { Difficulty, QuestionType, QuestionStatus } from "@prisma/client";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // ── Public Routes ─────────────────────────────────────────────────────────

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("topicId") topicId?: string,
    @Query("difficulty") difficulty?: Difficulty,
    @Query("status") status?: QuestionStatus,
    @Query("questionType") questionType?: QuestionType,
  ) {
    const result = await this.questionsService.findAll({
      topicId,
      difficulty,
      status,
      questionType,
    });
    return ResponseSender.success(
      result.questions,
      "Questions fetched successfully",
      200,
    );
  }

  @Public()
  @Get("topic/:id")
  @HttpCode(HttpStatus.OK)
  async findByTopicId(@Param("id") id: string) {
    const questions = await this.questionsService.findByTopicId(id);
    return ResponseSender.success(
      questions,
      "Questions fetched successfully",
      200,
    );
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const question = await this.questionsService.findOne(id);
    return ResponseSender.success(question, "Question fetched successfully");
  }

  // ── Protected Admin/Staff Routes ──────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateQuestionDto) {
    const question = await this.questionsService.create(dto);
    return ResponseSender.success(
      question,
      "Question created successfully",
      201,
    );
  }

  @Post("many")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateQuestionDto) {
    await this.questionsService.createMany(dto);
    return ResponseSender.success(null, "Questions created successfully", 201);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateQuestionDto) {
    const question = await this.questionsService.update(id, dto);
    return ResponseSender.success(question, "Question updated successfully");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.questionsService.remove(id);
    return ResponseSender.success(null, "Question deleted successfully");
  }
}
