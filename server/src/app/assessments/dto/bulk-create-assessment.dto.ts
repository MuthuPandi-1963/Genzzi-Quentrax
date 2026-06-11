import { IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { CreateAssessmentDto } from "./create-assessment.dto";

export class BulkCreateAssessmentDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentDto)
  assessments!: CreateAssessmentDto[];
}
