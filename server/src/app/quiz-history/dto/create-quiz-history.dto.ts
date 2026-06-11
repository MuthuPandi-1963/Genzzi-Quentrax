import { IsUUID, IsInt, Min, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateQuizHistoryDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  quizId!: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  score!: number;

  @IsOptional()
  answers?: any;
}
