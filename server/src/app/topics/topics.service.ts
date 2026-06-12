import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { BulkCreateTopicDto } from "./dto/bulk-create-topic.dto";
import { TopicResponse, TopicListResponse } from "./types/topic.types";
import { Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Read Operations ───────────────────────────────────────────────────────

  async findAll(categoryId?: string): Promise<TopicListResponse> {
    const where = categoryId ? { categoryId } : {};

    const topics = await this.prisma.topic.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return {
      topics,
      count: topics.length,
    };
  }

  async findOne(id: string): Promise<TopicResponse> {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        quizzes: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            imageUrl: true,
            title: true,
            description: true,
            timeLimit: true,
            totalPoints: true,
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
            questions: {
              select: {
                questionText: true,
              },
              take: 3,
            },
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException("Topic not found");
    }

    return topic;
  }

  // ── Write Operations ──────────────────────────────────────────────────────

  async create(dto: CreateTopicDto): Promise<TopicResponse> {
    if (!dto.name || dto.name.trim() === "") {
      throw new BadRequestException("Topic name is required");
    }

    if (!dto.categoryId) {
      throw new BadRequestException("Category ID is required");
    }

    try {
      const topic = await this.prisma.topic.create({
        data: {
          name: dto.name.trim(),
          description: dto.description ?? null,
          categoryId: dto.categoryId,
          difficulty: dto.difficulty ?? undefined,
          tags: dto.tags ?? [],
          imageUrl: dto.imageUrl ?? null,
        },
        include: { category: true },
      });

      return topic;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2002") {
          throw new ConflictException(
            "Topic with this name already exists in this category",
          );
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateTopicDto): Promise<{ count: number }> {
    const { topics } = dto;

    if (!Array.isArray(topics) || topics.length === 0) {
      throw new BadRequestException(
        "Topics array is required and cannot be empty",
      );
    }

    const invalidTopic = topics.find(
      (t) => !t.name || t.name.trim() === "" || !t.categoryId,
    );
    if (invalidTopic) {
      throw new BadRequestException(
        "Each topic must have a valid name and categoryId",
      );
    }

    try {
      const result = await this.prisma.topic.createMany({
        data: topics.map((t) => ({
          name: t.name.trim(),
          description: t.description ?? null,
          categoryId: t.categoryId,
          difficulty: t.difficulty ?? undefined,
          tags: t.tags ?? [],
          imageUrl: t.imageUrl ?? null,
        })),
        skipDuplicates: true,
      });

      if (result.count === 0) {
        throw new ConflictException(
          "No new topics were created, they may already exist",
        );
      }

      return { count: result.count };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException("An error occurred while creating topics");
    }
  }

  async update(id: string, dto: UpdateTopicDto): Promise<TopicResponse> {
    try {
      const updatedTopic = await this.prisma.topic.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name.trim() }),
          description: dto.description ?? undefined,
          categoryId: dto.categoryId ?? undefined,
          difficulty: dto.difficulty ?? "MEDIUM",
          tags: dto.tags ?? undefined,
          imageUrl: dto.imageUrl ?? undefined,
        },
        include: { category: true },
      });

      return updatedTopic;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Topic not found");
        }
        if ((error as { code: string }).code === "P2002") {
          throw new ConflictException(
            "Topic with this name already exists in this category",
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.topic.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Topic not found");
        }
      }
      throw error;
    }
  }
}
