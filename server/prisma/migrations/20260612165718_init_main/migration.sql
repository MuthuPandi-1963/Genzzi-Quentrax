-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF', 'STUDENT');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'LONG_ANSWERS', 'CODING');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXEMPTED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_BLOCKED', 'USER_UNBLOCKED', 'USER_ROLE_CHANGED', 'USER_DELETED', 'ASSESSMENT_CREATED', 'ASSESSMENT_UPDATED', 'ASSESSMENT_ASSIGNED', 'ASSESSMENT_DELETED', 'QUESTION_CREATED', 'QUESTION_DELETED', 'QUIZ_CREATED', 'QUIZ_DELETED', 'COINS_ADJUSTED');

-- CreateTable
CREATE TABLE "auth" (
    "id" UUID NOT NULL,
    "sub" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "picture" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_info" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_name" TEXT NOT NULL,
    "device_fingerprint" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "location" TEXT,
    "trusted" BOOLEAN NOT NULL DEFAULT false,
    "last_seen" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "countryCode" CHAR(2),
    "avatar" VARCHAR(500),
    "bio" VARCHAR(500),
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "deletedAt" TIMESTAMP(3),
    "authId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "targetType" VARCHAR(50),
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "imageUrl" VARCHAR(500),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500),
    "categoryId" UUID NOT NULL,
    "imageUrl" VARCHAR(500),
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL,
    "questionText" VARCHAR(2000) NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "hints" TEXT[],
    "points" INTEGER NOT NULL DEFAULT 1,
    "explanation" VARCHAR(2000),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "QuestionStatus" NOT NULL DEFAULT 'ACTIVE',
    "options" JSONB NOT NULL,
    "topicId" UUID NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000),
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "status" "QuizStatus" NOT NULL DEFAULT 'ACTIVE',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "timeLimit" INTEGER,
    "imageUrl" VARCHAR(500),
    "creatorId" UUID NOT NULL,
    "topicId" UUID,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizHistory" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,

    CONSTRAINT "QuizHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coins" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinsHistory" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "coinsId" UUID NOT NULL,
    "coins" INTEGER NOT NULL,
    "reason" VARCHAR(200),
    "quizId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(2000),
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "deadline" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "timeLimit" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "topicId" UUID,
    "passingScore" INTEGER NOT NULL DEFAULT 50,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "maxViolations" INTEGER NOT NULL DEFAULT 3,
    "proctoredMode" BOOLEAN NOT NULL DEFAULT false,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT false,
    "allowReview" BOOLEAN NOT NULL DEFAULT true,
    "allowRetry" BOOLEAN NOT NULL DEFAULT true,
    "showResultImmediately" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "creatorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAssignment" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AssessmentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAttempt" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "violations" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AssessmentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pointsOverride" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionToQuiz" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_QuestionToQuiz_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserQuizHistory" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserQuizHistory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CoinsHistoryToUserProfile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CoinsHistoryToUserProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AssessmentToQuiz" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AssessmentToQuiz_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AssessmentCreator" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AssessmentCreator_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_sub_key" ON "auth"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_username_key" ON "auth"("username");

-- CreateIndex
CREATE UNIQUE INDEX "device_info_device_fingerprint_key" ON "device_info"("device_fingerprint");

-- CreateIndex
CREATE INDEX "device_info_user_id_idx" ON "device_info"("user_id");

-- CreateIndex
CREATE INDEX "device_info_device_fingerprint_idx" ON "device_info"("device_fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_authId_key" ON "UserProfile"("authId");

-- CreateIndex
CREATE INDEX "UserProfile_role_name_idx" ON "UserProfile"("role", "name");

-- CreateIndex
CREATE INDEX "UserProfile_deletedAt_idx" ON "UserProfile"("deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_deletedAt_idx" ON "Category"("name", "deletedAt");

-- CreateIndex
CREATE INDEX "Topic_categoryId_deletedAt_idx" ON "Topic"("categoryId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_categoryId_name_key" ON "Topic"("categoryId", "name");

-- CreateIndex
CREATE INDEX "Question_topicId_status_deletedAt_idx" ON "Question"("topicId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "Question_difficulty_questionType_idx" ON "Question"("difficulty", "questionType");

-- CreateIndex
CREATE INDEX "Quiz_creatorId_status_deletedAt_idx" ON "Quiz"("creatorId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "Quiz_topicId_status_idx" ON "Quiz"("topicId", "status");

-- CreateIndex
CREATE INDEX "QuizHistory_userId_quizId_idx" ON "QuizHistory"("userId", "quizId");

-- CreateIndex
CREATE INDEX "QuizHistory_quizId_score_idx" ON "QuizHistory"("quizId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "Coins_userId_key" ON "Coins"("userId");

-- CreateIndex
CREATE INDEX "CoinsHistory_userId_createdAt_idx" ON "CoinsHistory"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinsHistory_coinsId_idx" ON "CoinsHistory"("coinsId");

-- CreateIndex
CREATE INDEX "Assessment_status_deletedAt_idx" ON "Assessment"("status", "deletedAt");

-- CreateIndex
CREATE INDEX "Assessment_published_status_idx" ON "Assessment"("published", "status");

-- CreateIndex
CREATE INDEX "Assessment_topicId_idx" ON "Assessment"("topicId");

-- CreateIndex
CREATE INDEX "Assessment_deadline_status_idx" ON "Assessment"("deadline", "status");

-- CreateIndex
CREATE INDEX "AssessmentAssignment_assessmentId_status_idx" ON "AssessmentAssignment"("assessmentId", "status");

-- CreateIndex
CREATE INDEX "AssessmentAssignment_userId_status_idx" ON "AssessmentAssignment"("userId", "status");

-- CreateIndex
CREATE INDEX "AssessmentAssignment_userId_assessmentId_idx" ON "AssessmentAssignment"("userId", "assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentAssignment_assessmentId_userId_key" ON "AssessmentAssignment"("assessmentId", "userId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_userId_assessmentId_idx" ON "AssessmentAttempt"("userId", "assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_assessmentId_score_idx" ON "AssessmentAttempt"("assessmentId", "score");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_status_idx" ON "AssessmentAttempt"("status");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_assessmentId_idx" ON "AssessmentQuestion"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_questionId_idx" ON "AssessmentQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuestion_assessmentId_questionId_key" ON "AssessmentQuestion"("assessmentId", "questionId");

-- CreateIndex
CREATE INDEX "_QuestionToQuiz_B_index" ON "_QuestionToQuiz"("B");

-- CreateIndex
CREATE INDEX "_UserQuizHistory_B_index" ON "_UserQuizHistory"("B");

-- CreateIndex
CREATE INDEX "_CoinsHistoryToUserProfile_B_index" ON "_CoinsHistoryToUserProfile"("B");

-- CreateIndex
CREATE INDEX "_AssessmentToQuiz_B_index" ON "_AssessmentToQuiz"("B");

-- CreateIndex
CREATE INDEX "_AssessmentCreator_B_index" ON "_AssessmentCreator"("B");

-- AddForeignKey
ALTER TABLE "device_info" ADD CONSTRAINT "device_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizHistory" ADD CONSTRAINT "QuizHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizHistory" ADD CONSTRAINT "QuizHistory_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coins" ADD CONSTRAINT "Coins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinsHistory" ADD CONSTRAINT "CoinsHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinsHistory" ADD CONSTRAINT "CoinsHistory_coinsId_fkey" FOREIGN KEY ("coinsId") REFERENCES "Coins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinsHistory" ADD CONSTRAINT "CoinsHistory_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAssignment" ADD CONSTRAINT "AssessmentAssignment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAssignment" ADD CONSTRAINT "AssessmentAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuiz" ADD CONSTRAINT "_QuestionToQuiz_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuiz" ADD CONSTRAINT "_QuestionToQuiz_B_fkey" FOREIGN KEY ("B") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserQuizHistory" ADD CONSTRAINT "_UserQuizHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "QuizHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserQuizHistory" ADD CONSTRAINT "_UserQuizHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoinsHistoryToUserProfile" ADD CONSTRAINT "_CoinsHistoryToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "CoinsHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoinsHistoryToUserProfile" ADD CONSTRAINT "_CoinsHistoryToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToQuiz" ADD CONSTRAINT "_AssessmentToQuiz_A_fkey" FOREIGN KEY ("A") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToQuiz" ADD CONSTRAINT "_AssessmentToQuiz_B_fkey" FOREIGN KEY ("B") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentCreator" ADD CONSTRAINT "_AssessmentCreator_A_fkey" FOREIGN KEY ("A") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentCreator" ADD CONSTRAINT "_AssessmentCreator_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
