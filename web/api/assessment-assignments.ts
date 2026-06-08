import AxiosInstance from "@/lib/axiosInstance";

const url = "assessment-assignments";

export const AssessmentAssignmentAPI = {
  // Fetch all assessment assignments
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch assignment by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create assignment
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple assignments
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update assignment
  update: (id: string, data: any) => AxiosInstance.put(`/${url}/${id}`, data),

  // Delete assignment
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Fetch by assessment ID
  getByAssessmentId: (assessmentId: string) => AxiosInstance.get(`/${url}/assessment/${assessmentId}`),

  // Fetch by user ID
  getByUserId: (userId: string) => AxiosInstance.get(`/${url}/user/${userId}`),
};
