import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateQuizHistoryDto } from "./dto/create-quiz-history.dto";
import { UpdateQuizHistoryDto } from "./dto/update-quiz-history.dto";
import { BulkCreateQuizHistoryDto } from "./dto/bulk-create-quiz-history.dto";
import {
  QuizHistoryResponse,
  QuizHistoryListResponse,
} from "./types/quiz-history.types";
import { Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class QuizHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Read Operations ───────────────────────────────────────────────────────

  async findAll(): Promise<QuizHistoryListResponse> {
    const quizHistories = await this.prisma.quizHistory.findMany({
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            totalPoints: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    return {
      quizHistories,
      count: quizHistories.length,
    };
  }

  async findOne(id: string): Promise<QuizHistoryResponse> {
    const history = await this.prisma.quizHistory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            totalPoints: true,
          },
        },
      },
    });

    if (!history) {
      throw new NotFoundException("Quiz history not found");
    }

    return history;
  }

  async findByUserId(userId: string): Promise<QuizHistoryResponse[]> {
    const histories = await this.prisma.quizHistory.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            totalPoints: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    return histories;
  }

  async findByQuizId(quizId: string): Promise<QuizHistoryResponse[]> {
    const histories = await this.prisma.quizHistory.findMany({
      where: { quizId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    return histories;
  }

  // ── Write Operations ──────────────────────────────────────────────────────

  async create(
    dto: CreateQuizHistoryDto & { userId?: string },
  ): Promise<QuizHistoryResponse> {
    const userId = dto.userId;

    if (!userId) {
      throw new BadRequestException("User ID is required");
    }

    if (!dto.quizId) {
      throw new BadRequestException("Quiz ID is required");
    }

    if (dto.score === undefined || dto.score === null) {
      throw new BadRequestException("Score is required");
    }

    if (!dto.answers) {
      throw new BadRequestException("Answers are required");
    }

    try {
      const history = await this.prisma.quizHistory.create({
        data: {
          userId,
          quizId: dto.quizId,
          score: dto.score,
          answers: dto.answers as Prisma.InputJsonValue,
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              description: true,
              totalPoints: true,
            },
          },
        },
      });

      return history;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2003") {
          throw new BadRequestException(
            "Invalid userId or quizId — referenced record not found",
          );
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateQuizHistoryDto): Promise<{ count: number }> {
    const { quizHistories } = dto;

    if (!Array.isArray(quizHistories) || quizHistories.length === 0) {
      throw new BadRequestException(
        "Quiz histories array is required and cannot be empty",
      );
    }

    try {
      const result = await this.prisma.quizHistory.createMany({
        data: quizHistories.map((h) => ({
          userId: h.userId!,
          quizId: h.quizId,
          score: h.score,
          answers: h.answers as Prisma.InputJsonValue,
        })),
        skipDuplicates: true,
      });

      return { count: result.count };
    } catch {
      throw new BadRequestException(
        "An error occurred while creating quiz histories",
      );
    }
  }

  async update(
    id: string,
    dto: UpdateQuizHistoryDto,
  ): Promise<QuizHistoryResponse> {
    try {
      const updatedHistory = await this.prisma.quizHistory.update({
        where: { id },
        data: {
          score: dto.score ?? undefined,
          answers:
            dto.answers !== undefined
              ? (dto.answers as Prisma.InputJsonValue)
              : undefined,
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              description: true,
              totalPoints: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      return updatedHistory;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Quiz history not found");
        }
        if ((error as { code: string }).code === "P2003") {
          throw new BadRequestException(
            "Invalid userId or quizId — referenced record not found",
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.quizHistory.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Quiz history not found");
        }
      }
      throw error;
    }
  }
}
