import AxiosInstance from "@/lib/axiosInstance";

const url = "assessment-attempts";

export const AssessmentAttemptAPI = {
  // Fetch all assessment attempts
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch attempt by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create attempt (usually auto-created on start)
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple attempts
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update attempt
  update: (id: string, data: any) => AxiosInstance.put(`/${url}/${id}`, data),

  // Delete attempt
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Fetch by assessment ID
  getByAssessmentId: (assessmentId: string) => AxiosInstance.get(`/${url}/assessment/${assessmentId}`),

  // Fetch by user ID
  getByUserId: (userId: string) => AxiosInstance.get(`/${url}/user/${userId}`),
};
