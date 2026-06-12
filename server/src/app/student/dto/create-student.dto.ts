// src/app/student/dto/create-student.dto.ts

import { IsString, IsOptional, IsInt, Min, Max, IsUUID } from "class-validator";

export enum Difficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

export class CreateQuizAttemptDto {
  @IsUUID()
  quizId!: string;

  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsOptional()
  answers?: Record<string, unknown>;
}

export class CreateAssessmentAttemptDto {
  @IsUUID()
  assessmentId!: string;

  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsOptional()
  answers?: Record<string, unknown>;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;
}
