import { Module } from "@nestjs/common";
import { AssessmentsController } from "./assessments.controller";
import { AssessmentsService } from "./assessments.service";
import { AssessmentQuestionsController } from "./assessment-questions.controller";
import { AssessmentQuestionsService } from "./assessment-questions.service";
import { AssessmentAssignmentsController } from "./assessment-assignments.controller";
import { AssessmentAssignmentsService } from "./assessment-assignments.service";
import { AssessmentAttemptsController } from "./assessment-attempts.controller";
import { AssessmentAttemptsService } from "./assessment-attempts.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [
    AssessmentsController,
    AssessmentQuestionsController,
    AssessmentAssignmentsController,
    AssessmentAttemptsController,
  ],
  providers: [
    AssessmentsService,
    AssessmentQuestionsService,
    AssessmentAssignmentsService,
    AssessmentAttemptsService,
  ],
  exports: [
    AssessmentsService,
    AssessmentQuestionsService,
    AssessmentAssignmentsService,
    AssessmentAttemptsService,
  ],
})
export class AssessmentsModule {}
