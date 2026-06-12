import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  IsArray,
  Min,
  MaxLength,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { Difficulty, QuestionType, QuestionStatus } from "@prisma/client";

export class CreateQuestionDto {
  @IsString()
  @MaxLength(2000)
  questionText!: string;

  @IsEnum(QuestionType)
  questionType!: QuestionType;

  @IsEnum(Difficulty)
  difficulty!: Difficulty;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  points?: number;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  explanation?: string | null;

  @IsUUID()
  topicId!: string;

  // options schema per type:
  //   MCQ / TRUE_FALSE : [{"text":"...","isCorrect":true}, ...]
  //   FILL_BLANK        : {"acceptedAnswers":["..."], "caseSensitive": false}
  @IsNotEmpty()
  options: any;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsEnum(QuestionStatus)
  @IsOptional()
  status?: QuestionStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hints?: string[];
}
