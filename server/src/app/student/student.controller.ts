// src/app/student/student.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { JwtAuthGuard } from "../../common/guards/jwt.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateProfileDto } from "./dto/create-student.dto";
import { Throttle } from "@nestjs/throttler";
import { Prisma } from "@prisma/client";

@Controller("student")
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════

  @Get("dashboard")
  @HttpCode(HttpStatus.OK)
  async getDashboard(@CurrentUser("profileId") userId: string) {
    const data = await this.studentService.getDashboard(userId);
    return ResponseSender.success(data, "Dashboard loaded successfully");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIZ OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  @Post("quizzes/:quizId/start")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async startQuiz(
    @CurrentUser("profileId") userId: string,
    @Param("quizId") quizId: string,
  ) {
    const result = await this.studentService.startQuiz(userId, quizId);
    return ResponseSender.success(result, "Quiz started");
  }

  @Post("quizzes/:historyId/submit")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async submitQuiz(
    @CurrentUser("profileId") userId: string,
    @Param("historyId") historyId: string,
    @Body("answers") answers: Prisma.JsonObject,
  ) {
    const result = await this.studentService.submitQuiz(
      userId,
      historyId,
      answers,
    );
    return ResponseSender.success(result, "Quiz submitted successfully");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSESSMENT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  @Post("assessments/:assignmentId/start")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async startAssessment(
    @CurrentUser("profileId") userId: string,
    @Param("assignmentId") assignmentId: string,
  ) {
    const result = await this.studentService.startAssessment(
      userId,
      assignmentId,
    );
    return ResponseSender.success(result, "Assessment started");
  }

  @Post("assessments/:attemptId/submit")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async submitAssessment(
    @CurrentUser("profileId") userId: string,
    @Param("attemptId") attemptId: string,
    @Body("answers") answers: Prisma.JsonObject,
  ) {
    const result = await this.studentService.submitAssessment(
      userId,
      attemptId,
      answers,
    );
    return ResponseSender.success(result, "Assessment submitted successfully");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS & ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════

  @Get("progress")
  @HttpCode(HttpStatus.OK)
  async getProgress(@CurrentUser("profileId") userId: string) {
    const data = await this.studentService.getProgress(userId);
    return ResponseSender.success(data, "Progress loaded");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEADERBOARD
  // ═══════════════════════════════════════════════════════════════════════════

  @Get("leaderboard")
  @HttpCode(HttpStatus.OK)
  async getLeaderboard(@Query("limit") limit?: string) {
    const data = await this.studentService.getLeaderboard(
      limit ? parseInt(limit, 10) : 50,
    );
    return ResponseSender.success(data, "Leaderboard loaded");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════════════════════

  @Put("profile")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser("profileId") userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const data = await this.studentService.updateProfile(userId, dto);
    return ResponseSender.success(data, "Profile updated successfully");
  }
}
