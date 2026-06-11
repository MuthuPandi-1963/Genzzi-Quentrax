import { IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { CreateAssessmentQuestionDto } from "./create-assessment-question.dto";

export class BulkCreateAssessmentQuestionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentQuestionDto)
  assessmentQuestions!: CreateAssessmentQuestionDto[];
}
