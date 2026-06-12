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
import { QuizzesService } from "./quizzes.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { BulkCreateQuizDto } from "./dto/bulk-create-quiz.dto";
import { AddQuestionsToQuizDto } from "./dto/add-questions-to-quiz.dto";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { QuizStatus } from "@prisma/client";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("quizzes")
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  // ── Public Routes ─────────────────────────────────────────────────────────

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("status") status?: QuizStatus,
    @Query("creatorId") creatorId?: string,
    @Query("tag") tag?: string,
    @Query("topicId") topicId?: string,
  ) {
    const result = await this.quizzesService.findAll({
      status,
      creatorId,
      tag,
      topicId,
    });
    return ResponseSender.success(
      result.quizzes,
      "Quizzes fetched successfully",
      200,
    );
  }

  @Public()
  @Get("topic/:id")
  @HttpCode(HttpStatus.OK)
  async findByTopicId(@Param("id") id: string) {
    const quizzes = await this.quizzesService.findByTopicId(id);
    return ResponseSender.success(quizzes, "Quizzes fetched successfully", 200);
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const quiz = await this.quizzesService.findOne(id);
    return ResponseSender.success(quiz, "Quiz fetched successfully");
  }

  // ── Protected Admin/Staff Routes ──────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateQuizDto) {
    const quiz = await this.quizzesService.create(dto);
    return ResponseSender.success(quiz, "Quiz created successfully", 201);
  }

  @Post("many")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateQuizDto) {
    await this.quizzesService.createMany(dto);
    return ResponseSender.success(null, "Quizzes created successfully", 201);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateQuizDto) {
    const quiz = await this.quizzesService.update(id, dto);
    return ResponseSender.success(quiz, "Quiz updated successfully");
  }

  @Put(":id/questions")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async addQuestions(
    @Param("id") id: string,
    @Body() dto: AddQuestionsToQuizDto,
  ) {
    const quiz = await this.quizzesService.addQuestions(id, dto);
    return ResponseSender.success(quiz, "Quiz questions updated successfully");
  }

  @Put(":id/questions/remove")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async removeQuestions(
    @Param("id") id: string,
    @Body() dto: AddQuestionsToQuizDto,
  ) {
    const quiz = await this.quizzesService.removeQuestions(id, dto);
    return ResponseSender.success(
      quiz,
      "Questions removed from quiz successfully",
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.quizzesService.remove(id);
    return ResponseSender.success(null, "Quiz deleted successfully");
  }
}
