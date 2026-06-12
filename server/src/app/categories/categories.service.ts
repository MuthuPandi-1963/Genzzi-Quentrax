import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { BulkCreateCategoryDto } from "./dto/bulk-create-category.dto";
import { CategoryResponse, CategoryListResponse } from "./types/category.types";
import { Category, Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Read Operations ───────────────────────────────────────────────────────

  async findAll(): Promise<CategoryListResponse> {
    const categories = await this.prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            topics: true,
          },
        },
      },
    });

    return {
      categories,
      count: categories.length,
    };
  }

  async findOne(id: string): Promise<CategoryResponse> {
    const category: Category | null = await this.prisma.category.findUnique({
      where: { id },
      include: { topics: true },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  // ── Write Operations ──────────────────────────────────────────────────────

  async create(dto: CreateCategoryDto): Promise<CategoryResponse> {
    if (!dto.name || dto.name.trim() === "") {
      throw new BadRequestException("Category name is required");
    }

    try {
      const category = await this.prisma.category.create({
        data: {
          name: dto.name.trim(),
          description: dto.description ?? null,
          imageUrl: dto.imageUrl ?? null,
        },
      });

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2002") {
          throw new ConflictException("Category with this name already exists");
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateCategoryDto): Promise<{ count: number }> {
    const { categories } = dto;

    if (!Array.isArray(categories) || categories.length === 0) {
      throw new BadRequestException(
        "Categories array is required and cannot be empty",
      );
    }

    const invalidCategory = categories.find(
      (cat) => !cat.name || cat.name.trim() === "",
    );
    if (invalidCategory) {
      throw new BadRequestException("Each category must have a valid name");
    }

    try {
      const result = await this.prisma.category.createMany({
        data: categories.map((cat) => ({
          name: cat.name.trim(),
          description: cat.description ?? null,
          imageUrl: cat.imageUrl ?? null,
        })),
        skipDuplicates: true,
      });

      if (result.count === 0) {
        throw new ConflictException(
          "No new categories were created, they may already exist",
        );
      }

      return { count: result.count };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException(
        "An error occurred while creating categories",
      );
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name.trim() }),
          description: dto.description ?? undefined,
          imageUrl: dto.imageUrl ?? undefined,
        },
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Category not found");
        }
        if ((error as { code: string }).code === "P2002") {
          throw new ConflictException("Category with this name already exists");
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2025") {
          throw new NotFoundException("Category not found");
        }
      }
      throw error;
    }
  }
}
