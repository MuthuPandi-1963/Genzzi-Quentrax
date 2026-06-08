import AxiosInstance from "@/lib/axiosInstance";

const url = "quiz-history";

export const QuizHistoryAPI = {
  // Fetch all quiz history entries
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch quiz history by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create quiz history entry (usually auto-created on submit)
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple quiz history entries
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update quiz history
  update: (id: string, data: any) => AxiosInstance.put(`/${url}/${id}`, data),

  // Delete quiz history
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Fetch history by user ID
  getByUserId: (userId: string) => AxiosInstance.get(`/${url}/user/${userId}`),

  // Fetch history by quiz ID
  getByQuizId: (quizId: string) => AxiosInstance.get(`/${url}/quiz/${quizId}`),
};
