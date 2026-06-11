import { IsString, IsOptional, IsUrl, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsUrl()
  @IsOptional()
  imageUrl?: string | null;
}
