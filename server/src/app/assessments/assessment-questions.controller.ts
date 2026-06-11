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
import { AssessmentQuestionsService } from "./assessment-questions.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateAssessmentQuestionDto } from "./dto/create-assessment-question.dto";
import { UpdateAssessmentQuestionDto } from "./dto/update-assessment-question.dto";
import { BulkCreateAssessmentQuestionDto } from "./dto/bulk-create-assessment-question.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("assessment-questions")
export class AssessmentQuestionsController {
  constructor(private readonly service: AssessmentQuestionsService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const items = await this.service.findAll();
    return ResponseSender.success(
      items,
      "Assessment questions fetched successfully",
      200,
    );
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const item = await this.service.findOne(id);
    return ResponseSender.success(
      item,
      "Assessment question fetched successfully",
    );
  }

  @Public()
  @Get("assessment/:assessmentId")
  @HttpCode(HttpStatus.OK)
  async findByAssessmentId(@Param("assessmentId") assessmentId: string) {
    const items = await this.service.findByAssessmentId(assessmentId);
    return ResponseSender.success(
      items,
      "Assessment questions fetched successfully",
      200,
    );
  }

  @Public()
  @Get("question/:questionId")
  @HttpCode(HttpStatus.OK)
  async findByQuestionId(@Param("questionId") questionId: string) {
    const items = await this.service.findByQuestionId(questionId);
    return ResponseSender.success(
      items,
      "Assessment questions fetched successfully",
      200,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAssessmentQuestionDto) {
    const item = await this.service.create(dto);
    return ResponseSender.success(
      item,
      "Assessment question created successfully",
      201,
    );
  }

  @Post("many")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateAssessmentQuestionDto) {
    await this.service.createMany(dto);
    return ResponseSender.success(
      null,
      "Assessment questions created successfully",
      201,
    );
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateAssessmentQuestionDto,
  ) {
    const item = await this.service.update(id, dto);
    return ResponseSender.success(
      item,
      "Assessment question updated successfully",
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.service.remove(id);
    return ResponseSender.success(
      null,
      "Assessment question deleted successfully",
    );
  }
}
