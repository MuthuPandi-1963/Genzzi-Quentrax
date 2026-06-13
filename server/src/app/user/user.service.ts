import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.userProfile.findMany({
      where: {
        role: "STUDENT",
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
