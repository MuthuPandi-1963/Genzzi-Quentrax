import AxiosInstance from "@/lib/axiosInstance";

const url = "quizzes";

export const QuizAPI = {
  // Fetch all quizzes
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch quiz by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create a new quiz
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple quizzes
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update a quiz by ID
  update: (id: string, data: any) => AxiosInstance.put(`/${url}/${id}`, data),

  // Delete a quiz by ID
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Fetch quizzes by topic ID
  getByTopicId: (id: string) => AxiosInstance.get(`/${url}/topic/${id}`),

  // Add questions to quiz
  addQuestions: (quizId: string, addedQuestionIds: string[]) => AxiosInstance.put(`/${url}/${quizId}/questions`, { questions: addedQuestionIds }),

  // Start quiz attempt
  start: (id: string) => AxiosInstance.post(`/${url}/${id}/start`),

  // Submit quiz answers
  submit: (id: string, data: any) => AxiosInstance.post(`/${url}/${id}/submit`, data),

  // Get quiz history
  getHistory: (id: string) => AxiosInstance.get(`/${url}/${id}/history`),

  // Get quiz leaderboard
  getLeaderboard: (id: string, params?: any) => AxiosInstance.get(`/${url}/${id}/leaderboard`, { params }),
};
