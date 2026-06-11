import { IsArray, IsUUID, ArrayMinSize } from "class-validator";

export class AddQuestionsToQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  questions!: string[];
}
