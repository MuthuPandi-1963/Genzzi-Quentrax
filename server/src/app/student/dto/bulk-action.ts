// src/app/student/dto/bulk-action.dto.ts

import { IsArray, ArrayMinSize, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class BulkQuizAttemptDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuizAttemptItemDto)
  attempts!: QuizAttemptItemDto[];
}

export class QuizAttemptItemDto {
  @IsUUID()
  quizId!: string;

  @IsUUID()
  userId!: string;

  score!: number;

  answers?: Record<string, unknown>;
}
