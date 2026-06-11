import { IsEmail, IsOptional, IsString } from "class-validator";

export class OAuthCallbackDto {
  @IsString() sub!: string;
  @IsEmail() email!: string;
  @IsString() username!: string;
  @IsString() @IsOptional() picture?: string;
  @IsString() @IsOptional() phone?: string;
}

export class RefreshTokenDto {
  @IsString() refreshToken!: string;
}

export class UpdateProfileDto {
  @IsString() @IsOptional() username?: string;
  @IsString() @IsOptional() picture?: string;
}
