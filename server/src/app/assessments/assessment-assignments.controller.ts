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
import { AssessmentAssignmentsService } from "./assessment-assignments.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateAssignmentDto } from "./dto/create-assignment.dto";
import { UpdateAssignmentDto } from "./dto/update-assignment.dto";
import { BulkCreateAssignmentDto } from "./dto/bulk-create-assignment.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("assessment-assignments")
export class AssessmentAssignmentsController {
  constructor(private readonly service: AssessmentAssignmentsService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const items = await this.service.findAll();
    return ResponseSender.success(
      items,
      "Assignments fetched successfully",
      200,
    );
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const item = await this.service.findOne(id);
    return ResponseSender.success(item, "Assignment fetched successfully");
  }

  @Public()
  @Get("assessment/:assessmentId")
  @HttpCode(HttpStatus.OK)
  async findByAssessmentId(@Param("assessmentId") assessmentId: string) {
    const items = await this.service.findByAssessmentId(assessmentId);
    return ResponseSender.success(
      items,
      "Assignments fetched successfully",
      200,
    );
  }

  @Public()
  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async findByUserId(@Param("userId") userId: string) {
    const items = await this.service.findByUserId(userId);
    return ResponseSender.success(
      items,
      "Assignments fetched successfully",
      200,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAssignmentDto) {
    const item = await this.service.create(dto);
    return ResponseSender.success(item, "Assignment created successfully", 201);
  }

  @Post("many")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateAssignmentDto) {
    await this.service.createMany(dto);
    return ResponseSender.success(
      null,
      "Assignments created successfully",
      201,
    );
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateAssignmentDto) {
    const item = await this.service.update(id, dto);
    return ResponseSender.success(item, "Assignment updated successfully");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.service.remove(id);
    return ResponseSender.success(null, "Assignment deleted successfully");
  }
}
