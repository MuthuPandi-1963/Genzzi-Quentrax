// src/app/student/student.module.ts

import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { PrismaService } from "../../database/prisma.service";

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaService],
  exports: [StudentService],
})
export class StudentModule {}
