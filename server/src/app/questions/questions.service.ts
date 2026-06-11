import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { BulkCreateQuestionDto } from "./dto/bulk-create-question.dto";
import { QuestionResponse, QuestionListResponse } from "./types/question.types";
import {
  Prisma,
  Difficulty,
  QuestionType,
  QuestionStatus,
} from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Read Operations ───────────────────────────────────────────────────────

  async findAll(filters: {
    topicId?: string;
    difficulty?: Difficulty;
    status?: QuestionStatus;
    questionType?: QuestionType;
  }): Promise<QuestionListResponse> {
    const where: Prisma.QuestionWhereInput = {};

    if (filters.topicId) where.topicId = filters.topicId;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.status) where.status = filters.status;
    if (filters.questionType) where.questionType = filters.questionType;

    const questions = await this.prisma.question.findMany({
      where,
      include: {
        topic: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      questions,
      count: questions.length,
    };
  }

  async findByTopicId(topicId: string): Promise<QuestionResponse[]> {
    if (!topicId) {
      throw new BadRequestException("Topic ID is required");
    }

    const questions = await this.prisma.question.findMany({
      where: { topicId },
    });

    return questions;
  }

  async findOne(id: string): Promise<QuestionResponse> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        topic: {
          include: { category: true },
        },
      },
    });

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    return question;
  }

  // ── Write Operations ──────────────────────────────────────────────────────

  async create(dto: CreateQuestionDto): Promise<QuestionResponse> {
    if (!dto.questionText || dto.questionText.trim() === "") {
      throw new BadRequestException("Question text is required");
    }

    if (!dto.questionType) {
      throw new BadRequestException("Question type is required");
    }

    if (!dto.difficulty) {
      throw new BadRequestException("Difficulty is required");
    }

    if (!dto.topicId) {
      throw new BadRequestException("Topic ID is required");
    }

    if (!dto.options) {
      throw new BadRequestException("Options are required");
    }

    // Validate topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: dto.topicId },
    });

    if (!topic) {
      throw new NotFoundException("Topic ID not found");
    }

    try {
      const question = await this.prisma.question.create({
        data: {
          questionText: dto.questionText.trim(),
          questionType: dto.questionType,
          difficulty: dto.difficulty,
          points: dto.points ?? 1,
          explanation: dto.explanation ?? null,
          topicId: dto.topicId,
          options: dto.options as Prisma.InputJsonValue,
          tags: dto.tags ?? [],
          hints: dto.hints ?? [],
          status: dto.status ?? QuestionStatus.active,
        },
        include: { topic: true },
      });

      return question;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2002") {
          throw new BadRequestException(
            "Question with this text already exists",
          );
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateQuestionDto): Promise<{ count: number }> {
    const { questions } = dto;

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestException(
        "Questions array is required and cannot be empty",
      );
    }

    try {
      const result = await this.prisma.question.createMany({
        data: questions.map((q) => ({
          questionText: q.questionText.trim(),
          questionType: q.questionType,
          difficulty: q.difficulty,
          points: q.points ?? 1,
          explanation: q.explanation ?? null,
          topicId: q.topicId,
          options: q.options as Prisma.InputJsonValue,
          tags: q.tags ?? [],
          hints: q.hints ?? [],
          status: q.status ?? QuestionStatus.active,
        })),
        skipDuplicates: true,
      });

      return { count: result.count };
    } catch {
      throw new BadRequestException(
        "An error occurred while creating questions",
      );
    }
  }

  async update(id: string, dto: UpdateQuestionDto): Promise<QuestionResponse> {
    try {
      const updatedQuestion = await this.prisma.question.update({
        where: { id },
        data: {
          ...(dto.questionText && {
            questionText: dto.questionText.trim(),
          }),
          questionType: dto.questionType ?? undefined,
          difficulty: dto.difficulty ?? undefined,
          points: dto.points ?? undefined,
          explanation: dto.explanation ?? undefined,
          topicId: dto.topicId ?? undefined,
          options: dto.options
            ? (dto.options as Prisma.InputJsonValue)
            : undefined,
          tags: dto.tags ?? undefined,
          hints: dto.hints ?? undefined,
          status: dto.status ?? undefined,
        },
      });

      return updatedQuestion;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Question not found");
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.question.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Question not found");
        }
      }
      throw error;
    }
  }
}
