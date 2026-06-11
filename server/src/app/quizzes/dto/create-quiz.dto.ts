import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  IsArray,
  Min,
  MaxLength,
  IsUrl,
} from "class-validator";
import { Type } from "class-transformer";
import { QuizStatus } from "@prisma/client";

export class CreateQuizDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string | null;

  @IsUUID()
  creatorId!: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  totalPoints?: number;

  @IsEnum(QuizStatus)
  @IsOptional()
  status?: QuizStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  timeLimit?: number | null;

  @IsUUID()
  @IsOptional()
  topicId?: string | null;

  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string | null;
}
