import { IsArray, IsUUID, ArrayMinSize } from "class-validator";

export class AssignUsersDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  userIds!: string[];
}
