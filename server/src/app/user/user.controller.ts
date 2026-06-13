import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { ResponseSender } from "src/common/responser/response.sender";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async getUsers() {
    const users = await this.userService.getUsers();
    return ResponseSender.success(users, "Category created successfully", 201);
  }
}
