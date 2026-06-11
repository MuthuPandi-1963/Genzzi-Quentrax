import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateAssignmentDto } from "./dto/create-assignment.dto";
import { UpdateAssignmentDto } from "./dto/update-assignment.dto";
import { BulkCreateAssignmentDto } from "./dto/bulk-create-assignment.dto";
import { Prisma, AssignmentStatus } from "@prisma/client";

@Injectable()
export class AssessmentAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.assessmentAssignment.findMany({
      include: { assessment: true, user: true },
      orderBy: { assignedAt: "desc" },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.assessmentAssignment.findUnique({
      where: { id },
      include: { assessment: true, user: true },
    });

    if (!item) throw new NotFoundException("Assignment not found");
    return item;
  }

  async findByAssessmentId(assessmentId: string) {
    return this.prisma.assessmentAssignment.findMany({
      where: { assessmentId },
      include: { user: true },
      orderBy: { assignedAt: "desc" },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.assessmentAssignment.findMany({
      where: { userId },
      include: { assessment: true },
      orderBy: { assignedAt: "desc" },
    });
  }

  async create(dto: CreateAssignmentDto) {
    try {
      return await this.prisma.assessmentAssignment.create({
        data: {
          assessmentId: dto.assessmentId,
          userId: dto.userId,
          status: dto.status ?? AssignmentStatus.PENDING,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        },
        include: { assessment: true, user: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error as { code: string }).code === "P2002") {
          throw new BadRequestException(
            "User is already assigned to this assessment",
          );
        }
      }
      throw error;
    }
  }

  async createMany(dto: BulkCreateAssignmentDto) {
    const result = await this.prisma.assessmentAssignment.createMany({
      data: dto.assignments.map((a) => ({
        assessmentId: a.assessmentId,
        userId: a.userId,
        status: a.status ?? AssignmentStatus.PENDING,
        dueDate: a.dueDate ? new Date(a.dueDate) : null,
      })),
      skipDuplicates: true,
    });
    return { count: result.count };
  }

  async update(id: string, dto: UpdateAssignmentDto) {
    try {
      return await this.prisma.assessmentAssignment.update({
        where: { id },
        data: {
          status: dto.status ?? undefined,
          dueDate:
            dto.dueDate !== undefined
              ? dto.dueDate
                ? new Date(dto.dueDate)
                : null
              : undefined,
          startedAt: dto.status === "IN_PROGRESS" ? new Date() : undefined,
          completedAt: dto.status === "COMPLETED" ? new Date() : undefined,
        },
        include: { assessment: true, user: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as { code: string }).code === "P2025"
      ) {
        throw new NotFoundException("Assignment not found");
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.assessmentAssignment.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as { code: string }).code === "P2025"
      ) {
        throw new NotFoundException("Assignment not found");
      }
      throw error;
    }
  }
}
