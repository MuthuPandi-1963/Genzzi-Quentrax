import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateAssessmentDto } from "./dto/create-assessment.dto";
import { UpdateAssessmentDto } from "./dto/update-assessment.dto";
import { BulkCreateAssessmentDto } from "./dto/bulk-create-assessment.dto";
import { PublishAssessmentDto } from "./dto/publish-assessment.dto";
import { AssignUsersDto } from "./dto/assign-users.dto";
import {
  AssessmentResponse,
  AssessmentListResponse,
} from "./types/assessment.types";
import {
  Prisma,
  AssessmentStatus,
  AssignmentStatus,
  AssessmentAssignment,
} from "@prisma/client";

// ═════════════════════════════════════════════════════════════════════════════
// Service
// ═════════════════════════════════════════════════════════════════════════════

@Injectable()
export class AssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Read Operations ───────────────────────────────────────────────────────

  async findAll(filters: {
    status?: AssessmentStatus;
    published?: boolean;
    topicId?: string;
  }): Promise<AssessmentListResponse> {
    const where: Prisma.AssessmentWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.published !== undefined) where.published = filters.published;
    if (filters.topicId) where.topicId = filters.topicId;

    const assessments = await this.prisma.assessment.findMany({
      where,
      include: {
        creator: true,
        topic: true,
        assessmentQuestions: { include: { question: true } },
        assignments: { include: { user: true } },
        attempts: true,
        quizzes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      assessments,
      count: assessments.length,
    };
  }

  async findOne(id: string): Promise<AssessmentResponse> {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        creator: true,
        topic: true,
        assessmentQuestions: { include: { question: true } },
        assignments: { include: { user: true } },
        attempts: true,
        quizzes: true,
      },
    });

    if (!assessment) {
      throw new NotFoundException("Assessment not found");
    }

    return assessment;
  }

  // ── Write Operations ──────────────────────────────────────────────────────

  async create(dto: CreateAssessmentDto): Promise<AssessmentResponse> {
    if (!dto.title || dto.title.trim() === "") {
      throw new BadRequestException("Assessment title is required");
    }

    if (!dto.creatorId) {
      throw new BadRequestException("Creator ID is required");
    }

    try {
      const assessment = await this.prisma.assessment.create({
        data: {
          title: dto.title.trim(),
          description: dto.description ?? null,
          status: dto.status ?? AssessmentStatus.DRAFT,
          deadline: dto.deadline ? new Date(dto.deadline) : null,
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
          timeLimit: dto.timeLimit ?? null,
          startDate: dto.startDate ? new Date(dto.startDate) : null,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          published: dto.published ?? false,
          topicId: dto.topicId ?? null,
          passingScore: dto.passingScore ?? 50,
          maxAttempts: dto.maxAttempts ?? 1,
          maxViolations: dto.maxViolations ?? 3,
          proctoredMode: dto.proctoredMode ?? false,
          shuffleQuestions: dto.shuffleQuestions ?? false,
          shuffleOptions: dto.shuffleOptions ?? false,
          allowReview: dto.allowReview ?? true,
          allowRetry: dto.allowRetry ?? true,
          showResultImmediately: dto.showResultImmediately ?? true,
          creatorId: dto.creatorId,
        },
        include: {
          creator: true,
          topic: true,
        },
      });

      return assessment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2002") {
          throw new ConflictException(
            "Assessment with this title already exists",
          );
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateAssessmentDto): Promise<{ count: number }> {
    const { assessments } = dto;

    if (!Array.isArray(assessments) || assessments.length === 0) {
      throw new BadRequestException(
        "Assessments array is required and cannot be empty",
      );
    }

    try {
      const result = await this.prisma.assessment.createMany({
        data: assessments.map((a) => ({
          title: a.title.trim(),
          description: a.description ?? null,
          status: a.status ?? AssessmentStatus.DRAFT,
          deadline: a.deadline ? new Date(a.deadline) : null,
          scheduledAt: a.scheduledAt ? new Date(a.scheduledAt) : null,
          timeLimit: a.timeLimit ?? null,
          startDate: a.startDate ? new Date(a.startDate) : null,
          endDate: a.endDate ? new Date(a.endDate) : null,
          published: a.published ?? false,
          topicId: a.topicId ?? null,
          passingScore: a.passingScore ?? 50,
          maxAttempts: a.maxAttempts ?? 1,
          maxViolations: a.maxViolations ?? 3,
          proctoredMode: a.proctoredMode ?? false,
          shuffleQuestions: a.shuffleQuestions ?? false,
          shuffleOptions: a.shuffleOptions ?? false,
          allowReview: a.allowReview ?? true,
          allowRetry: a.allowRetry ?? true,
          showResultImmediately: a.showResultImmediately ?? true,
          creatorId: a.creatorId,
        })),
        skipDuplicates: true,
      });

      return { count: result.count };
    } catch (error: unknown) {
      throw new BadRequestException(
        `${(error as { message: string }).message} An error occurred while creating assessments`,
      );
    }
  }

  async update(
    id: string,
    dto: UpdateAssessmentDto,
  ): Promise<AssessmentResponse> {
    try {
      const updatedAssessment = await this.prisma.assessment.update({
        where: { id },
        data: {
          ...(dto.title && { title: dto.title.trim() }),
          description: dto.description ?? undefined,
          status: dto.status ?? undefined,
          deadline:
            dto.deadline !== undefined
              ? dto.deadline
                ? new Date(dto.deadline)
                : null
              : undefined,
          scheduledAt:
            dto.scheduledAt !== undefined
              ? dto.scheduledAt
                ? new Date(dto.scheduledAt)
                : null
              : undefined,
          timeLimit: dto.timeLimit ?? undefined,
          startDate:
            dto.startDate !== undefined
              ? dto.startDate
                ? new Date(dto.startDate)
                : null
              : undefined,
          endDate:
            dto.endDate !== undefined
              ? dto.endDate
                ? new Date(dto.endDate)
                : null
              : undefined,
          published: dto.published ?? undefined,
          topicId: dto.topicId ?? undefined,
          passingScore: dto.passingScore ?? undefined,
          maxAttempts: dto.maxAttempts ?? undefined,
          maxViolations: dto.maxViolations ?? undefined,
          proctoredMode: dto.proctoredMode ?? undefined,
          shuffleQuestions: dto.shuffleQuestions ?? undefined,
          shuffleOptions: dto.shuffleOptions ?? undefined,
          allowReview: dto.allowReview ?? undefined,
          allowRetry: dto.allowRetry ?? undefined,
          showResultImmediately: dto.showResultImmediately ?? undefined,
        },
        include: {
          creator: true,
          topic: true,
        },
      });

      return updatedAssessment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Assessment not found");
        }
      }
      throw error;
    }
  }

  async publish(
    id: string,
    dto: PublishAssessmentDto,
  ): Promise<AssessmentResponse> {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException("Assessment not found");
    }

    try {
      const updated = await this.prisma.assessment.update({
        where: { id },
        data: {
          published: dto.published ?? true,
          status: AssessmentStatus.ACTIVE,
        },
        include: {
          creator: true,
          topic: true,
        },
      });

      return updated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Assessment not found");
        }
      }
      throw error;
    }
  }

  async assignUsers(id: string, dto: AssignUsersDto): Promise<any[]> {
    if (!id) {
      throw new BadRequestException("Assessment ID is required");
    }

    // Validate assessment exists
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException("Assessment not found");
    }

    // Get valid users (exclude ADMIN)
    const users = await this.prisma.userProfile.findMany({
      where: {
        id: { in: dto.userIds },
        role: { not: "ADMIN" },
      },
      select: { id: true },
    });

    const validUserIds = users.map((u) => u.id);

    if (validUserIds.length === 0) {
      throw new BadRequestException("No valid users found for assignment");
    }

    // Create assignments via upsert (bulk safe)
    const assignments = await this.prisma.$transaction(
      validUserIds.map((userId) =>
        this.prisma.assessmentAssignment.upsert({
          where: {
            assessmentId_userId: {
              assessmentId: id,
              userId,
            },
          },
          update: {
            status: AssignmentStatus.PENDING,
          },
          create: {
            assessmentId: id,
            userId,
            status: AssignmentStatus.PENDING,
          },
        }),
      ),
    );

    return assignments;
  }

  async getAssignments(id: string): Promise<Partial<AssessmentAssignment>[]> {
    if (!id) {
      throw new BadRequestException("Assessment ID is required");
    }

    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException("Assessment not found");
    }

    const assignments = await this.prisma.assessmentAssignment.findMany({
      where: { assessmentId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return assignments;
  }

  async getAttempts(id: string): Promise<any[]> {
    if (!id) {
      throw new BadRequestException("Assessment ID is required");
    }

    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException("Assessment not found");
    }

    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: { assessmentId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return attempts;
  }

  async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException("Assessment ID is required");
    }

    try {
      await this.prisma.assessment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Assessment not found");
        }
      }
      throw error;
    }
  }
}
