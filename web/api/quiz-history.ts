import axiosInstance from "@/lib/axiosInstance";


const url = "quiz-history";

export const QuizHistoryAPI = {
  // Fetch all quiz history entries
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch quiz history by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create quiz history entry (usually auto-created on submit)
  create: (data: any) => axiosInstance.post(`/${url}`, data),

  // Create multiple quiz history entries
  createMany: (data: any) => axiosInstance.post(`/${url}/many`, data),

  // Update quiz history
  update: (id: string, data: any) => axiosInstance.put(`/${url}/${id}`, data),

  // Delete quiz history
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),

  // Fetch history by user ID
  getByUserId: (userId: string) => axiosInstance.get(`/${url}/user/${userId}`),

  // Fetch history by quiz ID
  getByQuizId: (quizId: string) => axiosInstance.get(`/${url}/quiz/${quizId}`),
};
