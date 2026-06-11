import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { UpdateAttemptDto } from "./dto/update-attempt.dto";
import { Prisma, AttemptStatus } from "@prisma/client";

@Injectable()
export class AssessmentAttemptsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.assessmentAttempt.findMany({
      include: { assessment: true, user: true },
      orderBy: { startedAt: "desc" },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.assessmentAttempt.findUnique({
      where: { id },
      include: { assessment: true, user: true },
    });

    if (!item) throw new NotFoundException("Attempt not found");
    return item;
  }

  async findByAssessmentId(assessmentId: string) {
    return this.prisma.assessmentAttempt.findMany({
      where: { assessmentId },
      include: { user: true },
      orderBy: { startedAt: "desc" },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.assessmentAttempt.findMany({
      where: { userId },
      include: { assessment: true },
      orderBy: { startedAt: "desc" },
    });
  }

  async create(dto: CreateAttemptDto) {
    return this.prisma.assessmentAttempt.create({
      data: {
        assessmentId: dto.assessmentId,
        userId: dto.userId,
        score: dto.score ?? 0,
        answers: dto.answers
          ? (dto.answers as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        status: AttemptStatus.IN_PROGRESS,
        violations: dto.violations ?? 0,
      },
      include: { assessment: true, user: true },
    });
  }

  async update(id: string, dto: UpdateAttemptDto) {
    try {
      return await this.prisma.assessmentAttempt.update({
        where: { id },
        data: {
          score: dto.score ?? undefined,
          answers:
            dto.answers !== undefined
              ? (dto.answers as Prisma.InputJsonValue)
              : undefined,
          status: dto.score !== undefined ? AttemptStatus.COMPLETED : undefined,
          completedAt: dto.score !== undefined ? new Date() : undefined,
          violations: dto.violations ?? undefined,
        },
        include: { assessment: true, user: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as { code: string }).code === "P2025"
      ) {
        throw new NotFoundException("Attempt not found");
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.assessmentAttempt.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as { code: string }).code === "P2025"
      ) {
        throw new NotFoundException("Attempt not found");
      }
      throw error;
    }
  }
}
