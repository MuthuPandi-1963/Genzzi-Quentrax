import { IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { CreateTopicDto } from "./create-topic.dto";

export class BulkCreateTopicDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTopicDto)
  topics!: CreateTopicDto[];
}
