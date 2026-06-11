import { IsBoolean, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class PublishAssessmentDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  published?: boolean;
}
