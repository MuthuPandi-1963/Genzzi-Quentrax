import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/@types/auth";
import { Quiz, QuizListResponse } from "@/@types";

const url = "quizzes";

export const QuizAPI = {
  // Fetch all quizzes with optional filters
  getAll: (params?: {
    status?: string;
    creatorId?: string;
    tag?: string;
    topicId?: string;
  }) => axiosInstance.get<ApiResponse<QuizListResponse>>(`/${url}`, { params }),

  // Fetch quiz by ID
  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Quiz>>(`/${url}/${id}`),

  // Create a new quiz
  create: (data: QuizFormData) =>
    axiosInstance.post<ApiResponse<Quiz>>(`/${url}`, data),

  // Create multiple quizzes
  createMany: (data: QuizFormData[]) =>
    axiosInstance.post<ApiResponse<{ count: number }>>(`/${url}/many`, { quizzes: data }),

  // Update a quiz by ID
  update: (id: string, data: Partial<QuizFormData>) =>
    axiosInstance.put<ApiResponse<Quiz>>(`/${url}/${id}`, data),

  // Delete a quiz by ID
  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(`/${url}/${id}`),

  // Fetch quizzes by topic ID
  getByTopicId: (id: string) =>
    axiosInstance.get<ApiResponse<Quiz[]>>(`/${url}/topic/${id}`),

  // Add questions to quiz
  addQuestions: (quizId: string, questionIds: string[]) =>
    axiosInstance.put<ApiResponse<Quiz>>(`/${url}/${quizId}/questions`, { questions: questionIds }),
  // Remove questions from quiz
  removeQuestions: (quizId: string, questionIds: string[]) =>
    axiosInstance.put<ApiResponse<Quiz>>(`/${url}/${quizId}/questions/remove`, {
      questions: questionIds,
    }),

  // Start quiz attempt
  start: (id: string) =>
    axiosInstance.post<ApiResponse<unknown>>(`/${url}/${id}/start`),

  // Submit quiz answers
  submit: (id: string, data: unknown) =>
    axiosInstance.post<ApiResponse<unknown>>(`/${url}/${id}/submit`, data),

  // Get quiz history
  getHistory: (id: string) =>
    axiosInstance.get<ApiResponse<unknown>>(`/${url}/${id}/history`),

  // Get quiz leaderboard
  getLeaderboard: (id: string, params?: Record<string, unknown>) =>
    axiosInstance.get<ApiResponse<unknown>>(`/${url}/${id}/leaderboard`, { params }),
};

export interface QuizFormData {
  title: string;
  description: string | null;
  status: string;
  tags: string[];
  timeLimit: number | "" | null;
  imageUrl?: string | null;
  topicId?: string | null;
  creatorId?: string;
  totalPoints?: number;
}