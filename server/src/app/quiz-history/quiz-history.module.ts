import { Module } from "@nestjs/common";
import { QuizHistoryService } from "./quiz-history.service";
import { QuizHistoryController } from "./quiz-history.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [QuizHistoryController],
  providers: [QuizHistoryService],
  exports: [QuizHistoryService],
})
export class QuizHistoryModule {}
