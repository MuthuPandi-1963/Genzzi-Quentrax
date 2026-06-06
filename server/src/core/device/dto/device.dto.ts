import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateDeviceDto {
  @IsString() @IsOptional() deviceName?: string;
  @IsBoolean() @IsOptional() trusted?: boolean;
}
