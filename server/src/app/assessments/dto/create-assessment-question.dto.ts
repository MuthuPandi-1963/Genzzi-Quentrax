import { IsOptional, IsUUID, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateAssessmentQuestionDto {
  @IsUUID()
  assessmentId!: string;

  @IsUUID()
  questionId!: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pointsOverride?: number | null;
}
