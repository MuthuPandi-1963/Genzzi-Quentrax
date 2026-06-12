import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CoreModule } from "src/core/core.module";
import { DatabaseModule } from "src/database/database.module";
// import { JwtModule } from "@nestjs/jwt";
import { CategoriesModule } from "./categories/categories.module";
import { TopicsModule } from "./topics/topics.module";
import { AssessmentsModule } from "./assessments/assessments.module";
import { QuestionsModule } from "./questions/questions.module";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { QuizHistoryModule } from "./quiz-history/quiz-history.module";
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    AuthModule,
    CoreModule,
    DatabaseModule,
    // JwtModule,
    CategoriesModule,
    TopicsModule,
    AssessmentsModule,
    QuestionsModule,
    QuizzesModule,
    QuizHistoryModule,
    StudentModule,
  ],
})
export class AppModule {}
