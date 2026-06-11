import { IsUUID, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateAttemptDto {
  @IsUUID()
  assessmentId!: string;

  @IsUUID()
  userId!: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  score?: number;

  @IsOptional()
  answers?: any;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  violations?: number;
}
