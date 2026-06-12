// src/app/student/student.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import {
  StudentDashboardResponse,
  StudentStats,
  QuizHistoryItem,
  AssignmentItem,
  CoinsHistoryItem,
  AvailableQuizItem,
  ProgressStats,
  LeaderboardEntry,
} from "./types/student.types";
import {
  Difficulty,
  AssignmentStatus,
  AttemptStatus,
  UserRole,
  Prisma,
} from "@prisma/client";
import { UpdateProfileDto } from "./dto/create-student.dto";

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════

  async getDashboard(userId: string): Promise<StudentDashboardResponse> {
    console.log("userId", userId);
    // Verify user exists and is a student
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: userId },
      include: {
        auth: true,
        coins: true,
        quizHistories: {
          take: 5,
          orderBy: { completedAt: "desc" },
          include: { quiz: { include: { topic: true } } },
        },
        assessmentAssignments: {
          where: {
            status: {
              in: [AssignmentStatus.PENDING, AssignmentStatus.IN_PROGRESS],
            },
          },
          take: 5,
          orderBy: { assignedAt: "desc" },
          include: {
            assessment: { include: { topic: true, assessmentQuestions: true } },
          },
        },
        coinsHistories: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { quiz: true },
        },
      },
    });

    if (!profile) throw new NotFoundException("Student profile not found");
    if (profile.role !== UserRole.STUDENT) {
      throw new ForbiddenException("This endpoint is only for students");
    }

    // Get available quizzes (not taken recently)
    const takenQuizIds = profile.quizHistories.map((h) => h.quizId);
    const availableQuizzes = await this.prisma.quiz.findMany({
      where: {
        status: "ACTIVE",
        deletedAt: null,
        id: { notIn: takenQuizIds.length > 0 ? takenQuizIds : undefined },
      },
      take: 3,
      include: { topic: true, questions: true },
    });

    // Calculate streak (simplified — replace with real streak logic)
    const streak = await this.calculateStreak(userId);

    // Build stats
    const allHistory = await this.prisma.quizHistory.findMany({
      where: { userId },
    });
    const avgScore = allHistory.length
      ? Math.round(
          allHistory.reduce((a, h) => a + h.score, 0) / allHistory.length,
        )
      : 0;

    const stats: StudentStats = {
      name: profile.name,
      username: profile.auth.username,
      email: profile.auth.email,
      avatar: profile.avatar,
      role: profile.role,
      coins: profile.coins?.reduce((prev, curr) => prev + curr.balance, 0) ?? 0,
      streak,
      totalQuizzesTaken: allHistory.length,
      averageScore: avgScore,
      totalAssessments: profile.assessmentAssignments.length,
      pendingAssessments: profile.assessmentAssignments.filter(
        (a) => a.status === AssignmentStatus.PENDING,
      ).length,
    };

    return {
      stats,
      quizHistory: profile.quizHistories.map(
        (h): QuizHistoryItem => ({
          id: h.id,
          quizTitle: h.quiz.title,
          topicName: h.quiz.topic?.name ?? "General",
          score: h.score,
          totalPoints: h.quiz.totalPoints,
          completedAt: h.completedAt,
          difficulty: h.quiz.topic?.difficulty ?? Difficulty.MEDIUM,
        }),
      ),
      assignments: profile.assessmentAssignments.map(
        (a): AssignmentItem => ({
          id: a.id,
          title: a.assessment.title,
          topicName: a.assessment.topic?.name ?? "General",
          status: a.status,
          dueDate: a.dueDate,
          timeLimit: a.assessment.timeLimit,
          totalQuestions: a.assessment.assessmentQuestions.length,
          passingScore: a.assessment.passingScore,
          score: undefined, // Only set when completed
          startedAt: a.startedAt,
        }),
      ),
      coinsHistory: profile.coinsHistories.map(
        (c): CoinsHistoryItem => ({
          id: c.id,
          coins: c.coins,
          reason: c.reason,
          createdAt: c.createdAt,
          quizTitle: c.quiz?.title ?? null,
        }),
      ),
      availableQuizzes: availableQuizzes.map(
        (q): AvailableQuizItem => ({
          id: q.id,
          title: q.title,
          topicName: q.topic?.name ?? null,
          totalPoints: q.totalPoints,
          timeLimit: q.timeLimit,
          questionCount: q.questions.length,
          difficulty: q.topic?.difficulty ?? Difficulty.MEDIUM,
          tags: q.tags,
        }),
      ),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIZ OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async startQuiz(userId: string, quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId, status: "ACTIVE", deletedAt: null },
      include: { questions: true, topic: true },
    });
    if (!quiz) throw new NotFoundException("Quiz not found or inactive");

    // Create quiz history entry (IN_PROGRESS)
    const history = await this.prisma.quizHistory.create({
      data: {
        userId,
        quizId,
        score: 0,
        answers: {},
        completedAt: new Date(),
      },
    });

    return {
      historyId: history.id,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        totalPoints: quiz.totalPoints,
        questionCount: quiz.questions.length,
      },
    };
  }

  async submitQuiz(
    userId: string,
    historyId: string,
    answers: Prisma.JsonObject,
  ) {
    const history = await this.prisma.quizHistory.findUnique({
      where: { id: historyId, userId },
      include: { quiz: { include: { questions: true } } },
    });
    if (!history) throw new NotFoundException("Quiz attempt not found");

    // Calculate score (simplified — replace with real grading logic)
    const score = this.calculateScore(answers, history.quiz.questions);

    // Update history
    const updated = await this.prisma.quizHistory.update({
      where: { id: historyId },
      data: {
        score,
        answers: answers as Prisma.InputJsonValue,
        completedAt: new Date(),
      },
    });

    // Award coins
    await this.awardCoins(
      userId,
      score,
      `Completed quiz: ${history.quiz.title}`,
    );

    return updated;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSESSMENT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async startAssessment(userId: string, assignmentId: string) {
    const assignment = await this.prisma.assessmentAssignment.findUnique({
      where: { id: assignmentId, userId },
      include: {
        assessment: {
          include: { assessmentQuestions: { include: { question: true } } },
        },
      },
    });
    if (!assignment) throw new NotFoundException("Assignment not found");
    if (assignment.status === AssignmentStatus.COMPLETED) {
      throw new BadRequestException("Assessment already completed");
    }

    // Update to IN_PROGRESS
    await this.prisma.assessmentAssignment.update({
      where: { id: assignmentId },
      data: { status: AssignmentStatus.IN_PROGRESS, startedAt: new Date() },
    });

    // Create attempt
    const attempt = await this.prisma.assessmentAttempt.create({
      data: {
        assessmentId: assignment.assessmentId,
        userId,
        score: 0,
        answers: {},
        status: AttemptStatus.IN_PROGRESS,
      },
    });

    return {
      attemptId: attempt.id,
      assessment: {
        id: assignment.assessment.id,
        title: assignment.assessment.title,
        timeLimit: assignment.assessment.timeLimit,
        questions: assignment.assessment.assessmentQuestions.map((aq) => ({
          id: aq.questionId,
          text: aq.question.questionText,
          type: aq.question.questionType,
          points: aq.pointsOverride ?? aq.question.points,
        })),
      },
    };
  }

  async submitAssessment(
    userId: string,
    attemptId: string,
    answers: Prisma.JsonObject,
  ) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId, userId },
      include: {
        assessment: {
          include: { assessmentQuestions: { include: { question: true } } },
        },
      },
    });
    if (!attempt) throw new NotFoundException("Attempt not found");

    const score = this.calculateScore(
      answers,
      attempt.assessment.assessmentQuestions.map((aq) => aq.question),
    );

    // Update attempt
    const updated = await this.prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        answers,
        status: AttemptStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Update assignment
    await this.prisma.assessmentAssignment.updateMany({
      where: { assessmentId: attempt.assessmentId, userId },
      data: { status: AssignmentStatus.COMPLETED, completedAt: new Date() },
    });

    // Award coins if passed
    if (score >= attempt.assessment.passingScore) {
      await this.awardCoins(
        userId,
        score,
        `Passed assessment: ${attempt.assessment.title}`,
      );
    }

    return updated;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS & ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════

  async getProgress(userId: string): Promise<ProgressStats> {
    const histories = await this.prisma.quizHistory.findMany({
      where: { userId },
      include: { quiz: { include: { topic: true } } },
      orderBy: { completedAt: "asc" },
    });

    if (histories.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalTimeSpent: 0,
        quizzesByTopic: [],
        scoreTrend: [],
      };
    }

    const scores = histories.map((h) => h.score);
    const topicMap = new Map<string, { count: number; totalScore: number }>();

    histories.forEach((h) => {
      const topic = h.quiz.topic?.name ?? "General";
      const existing = topicMap.get(topic) ?? { count: 0, totalScore: 0 };
      existing.count++;
      existing.totalScore += h.score;
      topicMap.set(topic, existing);
    });

    return {
      totalQuizzes: histories.length,
      averageScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length,
      ),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      totalTimeSpent: histories.reduce(
        (a, h) => a + (h.quiz.timeLimit ?? 0),
        0,
      ),
      quizzesByTopic: Array.from(topicMap.entries()).map(([name, data]) => ({
        topicName: name,
        count: data.count,
        averageScore: Math.round(data.totalScore / data.count),
      })),
      scoreTrend: histories.map((h) => ({
        date: h.completedAt.toISOString().split("T")[0],
        score: h.score,
      })),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEADERBOARD
  // ═══════════════════════════════════════════════════════════════════════════

  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    const topStudents = await this.prisma.userProfile.findMany({
      where: { role: UserRole.STUDENT, deletedAt: null },
      take: limit,
      include: {
        auth: true,
        coins: true,
        quizHistories: true,
        _count: { select: { quizHistories: true } },
      },
      orderBy: { quizHistories: { _count: "desc" } },
    });

    return topStudents.map(
      (s, i): LeaderboardEntry => ({
        rank: i + 1,
        userId: s.id,
        name: s.name,
        avatar: s.avatar,
        totalScore: s.quizHistories.reduce((a, h) => a + h.score, 0),
        quizzesTaken: s._count.quizHistories,
        coins: s.coins?.reduce((prev, curr) => prev + curr.balance, 0) ?? 0,
        streak: 0, // Replace with real streak
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════════════════════

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.userProfile.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
        ...(dto.countryCode !== undefined && { countryCode: dto.countryCode }),
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private calculateScore(
    answers: Record<string, unknown>,
    questions: { id: string; options: unknown; points: number }[],
  ): number {
    // Simplified scoring — replace with real grading logic
    let correct = 0;
    const totalPoints = questions.reduce((a, q) => a + q.points, 0);

    for (const question of questions) {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined) correct += question.points;
    }

    return Math.round((correct / totalPoints) * 100);
  }

  private async awardCoins(userId: string, score: number, reason: string) {
    const coinsEarned = Math.max(Math.round(score / 10), 10);

    await this.prisma.$transaction(async (tx) => {
      // Upsert coins record
      await tx.coins.upsert({
        where: { userId },
        update: { balance: { increment: coinsEarned } },
        create: { userId, balance: coinsEarned },
      });

      // Create history
      await tx.coinsHistory.create({
        data: {
          userId,
          coinsId: (await tx.coins.findUnique({ where: { userId } }))!.id,
          coins: coinsEarned,
          reason,
        },
      });
    });
  }

  private async calculateStreak(userId: string): Promise<number> {
    // Simplified streak calculation — replace with real logic
    const recentActivity = await this.prisma.quizHistory.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 7,
    });

    if (recentActivity.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const activity of recentActivity) {
      const activityDate = new Date(activity.completedAt);
      activityDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
