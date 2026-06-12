// hooks/useStudentData.ts
// ── React Query hook for fetching real student dashboard data ───────────────

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import type { StudentDashboardData } from "@/@types/student";

const STUDENT_DASHBOARD_KEY = ["student", "dashboard"] as const;

export const useStudentData = () =>
  useQuery<StudentDashboardData>({
    queryKey: STUDENT_DASHBOARD_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/student/dashboard");
      return data.data; // unwrap ApiResponse
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });

export const useStudentStats = () => {
  const query = useStudentData();
  return {
    stats: query.data?.stats ?? null,
    quizHistory: query.data?.quizHistory ?? [],
    assignments: query.data?.assignments ?? [],
    coinsHistory: query.data?.coinsHistory ?? [],
    availableQuizzes: query.data?.availableQuizzes ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};