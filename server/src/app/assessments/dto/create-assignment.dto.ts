import { IsUUID, IsEnum, IsOptional, IsDateString } from "class-validator";
import { AssignmentStatus } from "@prisma/client";

export class CreateAssignmentDto {
  @IsUUID()
  assessmentId!: string;

  @IsUUID()
  userId!: string;

  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus;

  @IsDateString()
  @IsOptional()
  dueDate?: string | null;
}
