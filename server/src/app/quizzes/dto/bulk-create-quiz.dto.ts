import { IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { CreateQuizDto } from "./create-quiz.dto";

export class BulkCreateQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuizDto)
  quizzes!: CreateQuizDto[];
}
