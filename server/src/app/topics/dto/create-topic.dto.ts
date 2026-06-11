import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
  MaxLength,
  IsUrl,
} from "class-validator";
import { Difficulty } from "@prisma/client";

export class CreateTopicDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string | null;

  @IsUUID()
  categoryId!: string;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string | null;
}
