import { QuestionFormData } from "@/components/forms";
import axiosInstance from "@/lib/axiosInstance";


const url = "questions";

export const QuestionAPI = {
  // Fetch all questions
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch questions by topic
  getByTopicId: (topicId: string) => axiosInstance.get(`/${url}`, { params: { topicId } }),

  // Fetch question by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create new question
  create: (data: QuestionFormData) => axiosInstance.post(`/${url}`, data),

  // Create multiple questions
  createMany: (data: QuestionFormData[]) => axiosInstance.post(`/${url}/many`, data),

  // Update question
  update: (id: string, data: Partial<QuestionFormData>) => axiosInstance.put(`/${url}/${id}`, data),

  // Soft delete question
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),
};
