import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  IsBoolean,
  IsDateString,
  Min,
  Max,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { AssessmentStatus } from "@prisma/client";

export class CreateAssessmentDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string | null;

  @IsEnum(AssessmentStatus)
  @IsOptional()
  status?: AssessmentStatus;

  @IsDateString()
  @IsOptional()
  deadline?: string | null;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string | null;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  timeLimit?: number | null;

  @IsDateString()
  @IsOptional()
  startDate?: string | null;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  published?: boolean;

  @IsUUID()
  @IsOptional()
  topicId?: string | null;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  passingScore?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  maxAttempts?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxViolations?: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  proctoredMode?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  shuffleOptions?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  allowReview?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  allowRetry?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  showResultImmediately?: boolean;

  @IsUUID()
  creatorId!: string;
}
