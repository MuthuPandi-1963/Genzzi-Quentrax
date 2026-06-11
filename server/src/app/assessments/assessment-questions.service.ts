import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateAssessmentQuestionDto } from "./dto/create-assessment-question.dto";
import { UpdateAssessmentQuestionDto } from "./dto/update-assessment-question.dto";
import { BulkCreateAssessmentQuestionDto } from "./dto/bulk-create-assessment-question.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class AssessmentQuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.assessmentQuestion.findMany({
      include: { assessment: true, question: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.assessmentQuestion.findUnique({
      where: { id },
      include: { assessment: true, question: true },
    });

    if (!item) throw new NotFoundException("Assessment question not found");
    return item;
  }

  async findByAssessmentId(assessmentId: string) {
    return await this.prisma.assessmentQuestion.findMany({
      where: { assessmentId },
      include: { question: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findByQuestionId(questionId: string) {
    return this.prisma.assessmentQuestion.findMany({
      where: { questionId },
      include: { assessment: true },
    });
  }

  async create(dto: CreateAssessmentQuestionDto) {
    try {
      return await this.prisma.assessmentQuestion.create({
        data: {
          assessmentId: dto.assessmentId,
          questionId: dto.questionId,
          sortOrder: dto.sortOrder ?? 0,
          pointsOverride: dto.pointsOverride ?? null,
        },
        include: { assessment: true, question: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2002") {
          throw new BadRequestException(
            "This question is already linked to this assessment",
          );
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateAssessmentQuestionDto) {
    const result = await this.prisma.assessmentQuestion.createMany({
      data: dto.assessmentQuestions.map((aq) => ({
        assessmentId: aq.assessmentId,
        questionId: aq.questionId,
        sortOrder: aq.sortOrder ?? 0,
        pointsOverride: aq.pointsOverride ?? null,
      })),
      skipDuplicates: true,
    });
    return { count: result.count };
  }

  async update(id: string, dto: UpdateAssessmentQuestionDto) {
    try {
      return await this.prisma.assessmentQuestion.update({
        where: { id },
        data: {
          sortOrder: dto.sortOrder ?? undefined,
          pointsOverride: dto.pointsOverride ?? undefined,
        },
        include: { assessment: true, question: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as { code: string }).code === "P2025"
      ) {
        throw new NotFoundException("Assessment question not found");
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.assessmentQuestion.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as { code: string }).code === "P2025"
      ) {
        throw new NotFoundException("Assessment question not found");
      }
      throw error;
    }
  }
}
