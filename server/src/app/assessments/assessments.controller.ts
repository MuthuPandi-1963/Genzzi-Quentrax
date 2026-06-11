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
import { AssessmentsService } from "./assessments.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateAssessmentDto } from "./dto/create-assessment.dto";
import { UpdateAssessmentDto } from "./dto/update-assessment.dto";
import { BulkCreateAssessmentDto } from "./dto/bulk-create-assessment.dto";
import { PublishAssessmentDto } from "./dto/publish-assessment.dto";
import { AssignUsersDto } from "./dto/assign-users.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { AssessmentStatus } from "@prisma/client";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("assessments")
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  // ── Public Routes ─────────────────────────────────────────────────────────

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("status") status?: AssessmentStatus,
    @Query("published") published?: string,
    @Query("topicId") topicId?: string,
  ) {
    const isPublished =
      published === "true" ? true : published === "false" ? false : undefined;
    const result = await this.assessmentsService.findAll({
      status,
      published: isPublished,
      topicId,
    });
    return ResponseSender.success(
      result.assessments,
      "Assessments fetched successfully",
      200,
    );
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const assessment = await this.assessmentsService.findOne(id);
    return ResponseSender.success(
      assessment,
      "Assessment fetched successfully",
    );
  }

  // ── Protected Admin/Staff Routes ──────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAssessmentDto) {
    const assessment = await this.assessmentsService.create(dto);
    return ResponseSender.success(
      assessment,
      "Assessment created successfully",
      201,
    );
  }

  @Post("many")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateAssessmentDto) {
    await this.assessmentsService.createMany(dto);
    return ResponseSender.success(
      null,
      "Assessments created successfully",
      201,
    );
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateAssessmentDto) {
    const assessment = await this.assessmentsService.update(id, dto);
    return ResponseSender.success(
      assessment,
      "Assessment updated successfully",
    );
  }

  @Post(":id/publish")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async publish(@Param("id") id: string, @Body() dto: PublishAssessmentDto) {
    const assessment = await this.assessmentsService.publish(id, dto);
    return ResponseSender.success(
      assessment,
      "Assessment published successfully",
    );
  }

  @Post(":id/assign")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async assignUsers(@Param("id") id: string, @Body() dto: AssignUsersDto) {
    const assignments = await this.assessmentsService.assignUsers(id, dto);
    return ResponseSender.success(assignments, "Users assigned successfully");
  }

  @Get(":id/assignments")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async getAssignments(@Param("id") id: string) {
    const assignments = await this.assessmentsService.getAssignments(id);
    return ResponseSender.success(
      assignments,
      "Assignments fetched successfully",
      200,
    );
  }

  @Get(":id/attempts")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async getAttempts(@Param("id") id: string) {
    const attempts = await this.assessmentsService.getAttempts(id);
    return ResponseSender.success(
      attempts,
      "Attempts fetched successfully",
      200,
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.assessmentsService.remove(id);
    return ResponseSender.success(null, "Assessment deleted successfully");
  }
}
