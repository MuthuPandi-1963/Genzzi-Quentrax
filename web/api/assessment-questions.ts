import AxiosInstance from "./axiosInstance.js";

const url = "assessment-questions";

export const AssessmentQuestionAPI = {
  // Fetch all assessment questions
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch assessment question by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create assessment question link
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple assessment question links
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update assessment question (sort order, points override)
  update: (id: string, data: any) => AxiosInstance.put(`/${url}/${id}`, data),

  // Delete assessment question link
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Fetch by assessment ID
  getByAssessmentId: (assessmentId: string) => AxiosInstance.get(`/${url}/assessment/${assessmentId}`),

  // Fetch by question ID
  getByQuestionId: (questionId: string) => AxiosInstance.get(`/${url}/question/${questionId}`),
};
