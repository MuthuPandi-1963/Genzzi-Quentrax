import { IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { CreateQuizHistoryDto } from "./create-quiz-history.dto";

export class BulkCreateQuizHistoryDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuizHistoryDto)
  quizHistories!: CreateQuizHistoryDto[];
}
