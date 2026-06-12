// app/student/page.tsx
// ── Student dashboard page with real data ──────────────────────────────────

"use client";

import { useAuthContext } from "@/context/auth.context";
import { useStudentStats } from "@/hooks/useStudent";
import { HeroSection } from "@/components/student/HeroSection";
import { AssignmentsList } from "@/components/student/AssignmentsList";
import { CoinsWidget } from "@/components/student/CoinsWidget";
import { StreakCard } from "@/components/student/StreakCard";
import { QuizHistoryGrid } from "@/components/student/QuizHistoryGrid";
import { AvailableQuizzes } from "@/components/student/AvailableQuizzes";
import { StudentLayout } from "@/components/student/StudentLayout";

export default function StudentDashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const {
    stats,
    quizHistory,
    assignments,
    coinsHistory,
    availableQuizzes,
    isLoading: dataLoading,
  } = useStudentStats();

  const loading = authLoading || dataLoading;

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading your dashboard...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((a, q) => a + q.score, 0) / quizHistory.length)
    : 0;

  const pendingAssignments = assignments.filter((a) => a.status === "PENDING").length;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <HeroSection
          avgScore={avgScore}
          quizCount={quizHistory.length}
          pendingAssignments={pendingAssignments}
        />

        <div className="grid lg:grid-cols-3 gap-5">
          <AssignmentsList assignments={assignments} />

          <div className="flex flex-col gap-5">
            <CoinsWidget balance={stats?.coins ?? 0} history={coinsHistory} />
            <StreakCard streak={stats?.streak ?? 0} />
          </div>
        </div>

        <QuizHistoryGrid quizzes={quizHistory} />
        <AvailableQuizzes quizzes={availableQuizzes} />
      </div>
    </StudentLayout>
  );
}