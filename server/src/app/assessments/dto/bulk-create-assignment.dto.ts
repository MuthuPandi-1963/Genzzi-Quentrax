import { IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { CreateAssignmentDto } from "./create-assignment.dto";

export class BulkCreateAssignmentDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAssignmentDto)
  assignments!: CreateAssignmentDto[];
}
