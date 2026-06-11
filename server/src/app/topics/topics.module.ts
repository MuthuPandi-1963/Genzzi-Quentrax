import { Module } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { TopicsController } from "./topics.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}
