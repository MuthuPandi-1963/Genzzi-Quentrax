import axiosInstance from "@/lib/axiosInstance";


const url = "assessment-attempts";

export const AssessmentAttemptAPI = {
  // Fetch all assessment attempts
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch attempt by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create attempt (usually auto-created on start)
  create: (data: any) => axiosInstance.post(`/${url}`, data),

  // Create multiple attempts
  createMany: (data: any) => axiosInstance.post(`/${url}/many`, data),

  // Update attempt
  update: (id: string, data: any) => axiosInstance.put(`/${url}/${id}`, data),

  // Delete attempt
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),

  // Fetch by assessment ID
  getByAssessmentId: (assessmentId: string) => axiosInstance.get(`/${url}/assessment/${assessmentId}`),

  // Fetch by user ID
  getByUserId: (userId: string) => axiosInstance.get(`/${url}/user/${userId}`),
};
