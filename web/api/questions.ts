import AxiosInstance from "./axiosInstance.js";

const url = "questions";

export const QuestionAPI = {
  // Fetch all questions
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch questions by topic
  getByTopicId: (topicId: string) => AxiosInstance.get(`/${url}`, { params: { topicId } }),

  // Fetch question by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create new question
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple questions
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update question
  update: (id: string, data: any) => AxiosInstance.patch(`/${url}/${id}`, data),

  // Soft delete question
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),
};
