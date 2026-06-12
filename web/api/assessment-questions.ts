import axiosInstance from "@/lib/axiosInstance";


const url = "assessment-questions";

export const AssessmentQuestionAPI = {
  // Fetch all assessment questions
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch assessment question by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create assessment question link
  create: (data: any) => axiosInstance.post(`/${url}`, data),

  // Create multiple assessment question links
  createMany: (data: any) => axiosInstance.post(`/${url}/many`, data),

  // Update assessment question (sort order, points override)
  update: (id: string, data: any) => axiosInstance.put(`/${url}/${id}`, data),

  // Delete assessment question link
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),

  // Fetch by assessment ID
  getByAssessmentId: (assessmentId: string) => axiosInstance.get(`/${url}/assessment/${assessmentId}`),

  // Fetch by question ID
  getByQuestionId: (questionId: string) => axiosInstance.get(`/${url}/question/${questionId}`),
};
