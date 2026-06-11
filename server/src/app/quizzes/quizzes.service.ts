import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { BulkCreateQuizDto } from "./dto/bulk-create-quiz.dto";
import { AddQuestionsToQuizDto } from "./dto/add-questions-to-quiz.dto";
import { QuizResponse, QuizListResponse } from "./types/quiz.types";
import { Prisma, QuizStatus } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Shared creator select — always fetches via User → UserProfile
// ─────────────────────────────────────────────────────────────────────────────

const creatorSelect = {
  select: {
    id: true,
    profile: {
      select: {
        name: true,
        avatar: true,
        role: true,
      },
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Mapper ────────────────────────────────────────────────────────────────

  // Replace the Prisma.QuizGetPayload type with this internal interface
  private mapQuiz(raw: {
    id: string;
    creator: {
      id: string;
      profile?: { name: string; avatar: string | null; role: string } | null;
    } | null;
    [key: string]: unknown;
  }): QuizResponse {
    return {
      ...(raw as unknown as QuizResponse),
      creator: raw.creator
        ? {
            id: raw.creator.id,
            name: raw.creator.profile?.name ?? null,
            avatar: raw.creator.profile?.avatar ?? null,
            role: raw.creator.profile?.role ?? null,
          }
        : undefined,
    };
  }

  // ── Read Operations ───────────────────────────────────────────────────────

  async findAll(filters: {
    status?: QuizStatus;
    creatorId?: string;
    tag?: string;
    topicId?: string;
  }): Promise<QuizListResponse> {
    const where: Prisma.QuizWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.creatorId) where.creatorId = filters.creatorId;
    if (filters.tag) where.tags = { has: filters.tag };
    if (filters.topicId) where.topicId = filters.topicId;

    const quizzes = await this.prisma.quiz.findMany({
      where,
      include: {
        creator: creatorSelect,
        topic: true,
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      quizzes: quizzes.map((q: unknown) =>
        this.mapQuiz(
          q as {
            [key: string]: unknown;
            id: string;
            creator: {
              id: string;
              profile?:
                | { name: string; avatar: string | null; role: string }
                | null
                | undefined;
            } | null;
          },
        ),
      ),
      count: quizzes.length,
    };
  }

  async findByTopicId(topicId: string): Promise<QuizResponse[]> {
    if (!topicId) {
      throw new BadRequestException("Topic ID is required");
    }

    const quizzes = await this.prisma.quiz.findMany({
      where: { topicId },
      include: {
        creator: creatorSelect,
        topic: true,
        questions: true,
        history: true,
      },
    });

    return quizzes.map((q) => this.mapQuiz(q));
  }

  async findOne(id: string): Promise<QuizResponse> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        creator: creatorSelect,
        topic: true,
        questions: true,
        history: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    return this.mapQuiz(quiz);
  }

  // ── Write Operations ──────────────────────────────────────────────────────

  async create(dto: CreateQuizDto): Promise<QuizResponse> {
    if (!dto.title || dto.title.trim() === "") {
      throw new BadRequestException("Quiz title is required");
    }

    if (!dto.creatorId) {
      throw new BadRequestException("Creator ID is required");
    }

    try {
      const quiz = await this.prisma.quiz.create({
        data: {
          title: dto.title.trim(),
          description: dto.description ?? null,
          creatorId: dto.creatorId,
          totalPoints: dto.totalPoints ?? 0,
          status: dto.status ?? QuizStatus.active,
          tags: dto.tags ?? [],
          timeLimit: dto.timeLimit ?? null,
          topicId: dto.topicId ?? null,
          imageUrl: dto.imageUrl ?? null,
        },
        include: {
          creator: creatorSelect,
          topic: true,
        },
      });

      return this.mapQuiz(quiz);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2002") {
          throw new BadRequestException("Quiz with this title already exists");
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateQuizDto): Promise<{ count: number }> {
    const { quizzes } = dto;

    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      throw new BadRequestException(
        "Quizzes array is required and cannot be empty",
      );
    }

    try {
      const result = await this.prisma.quiz.createMany({
        data: quizzes.map((q) => ({
          title: q.title.trim(),
          description: q.description ?? null,
          creatorId: q.creatorId,
          totalPoints: q.totalPoints ?? 0,
          status: q.status ?? QuizStatus.active,
          tags: q.tags ?? [],
          timeLimit: q.timeLimit ?? null,
          topicId: q.topicId ?? null,
          imageUrl: q.imageUrl ?? null,
        })),
        skipDuplicates: true,
      });

      return { count: result.count };
    } catch {
      throw new BadRequestException("An error occurred while creating quizzes");
    }
  }

  async update(id: string, dto: UpdateQuizDto): Promise<QuizResponse> {
    try {
      const updatedQuiz = await this.prisma.quiz.update({
        where: { id },
        data: {
          ...(dto.title && { title: dto.title.trim() }),
          description: dto.description ?? undefined,
          totalPoints: dto.totalPoints ?? undefined,
          status: dto.status ?? undefined,
          tags: dto.tags ?? undefined,
          timeLimit: dto.timeLimit ?? undefined,
          topicId: dto.topicId ?? undefined,
          imageUrl: dto.imageUrl ?? undefined,
        },
        include: {
          creator: creatorSelect,
          topic: true,
        },
      });

      return this.mapQuiz(updatedQuiz);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Quiz not found");
        }
      }
      throw error;
    }
  }

  async addQuestions(
    id: string,
    dto: AddQuestionsToQuizDto,
  ): Promise<QuizResponse> {
    if (!id) {
      throw new BadRequestException("Quiz ID is required");
    }

    const quiz = await this.prisma.quiz.findUnique({ where: { id } });

    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    const questions = await Promise.all(
      dto.questions.map((qId) =>
        this.prisma.question.findUnique({ where: { id: qId } }),
      ),
    );

    if (questions.some((q) => !q)) {
      throw new NotFoundException("One or more questions not found");
    }

    const totalPoints = questions.reduce(
      (prev, curr) => prev + (curr?.points ?? 0),
      0,
    );

    try {
      const updatedQuiz = await this.prisma.quiz.update({
        where: { id },
        data: {
          totalPoints,
          questions: {
            connect: dto.questions.map((qId) => ({ id: qId })),
          },
        },
        include: {
          creator: creatorSelect,
          topic: true,
          questions: true,
        },
      });

      return this.mapQuiz(updatedQuiz);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Quiz not found");
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException("Quiz ID is required");
    }

    try {
      await this.prisma.quiz.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Quiz not found");
        }
      }
      throw error;
    }
  }
}
