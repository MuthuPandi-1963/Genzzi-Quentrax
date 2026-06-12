import axiosInstance from "@/lib/axiosInstance";

const url = "assessment-assignments";

export const AssessmentAssignmentAPI = {
  // Fetch all assessment assignments
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch assignment by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create assignment
  create: (data: any) => axiosInstance.post(`/${url}`, data),

  // Create multiple assignments
  createMany: (data: any) => axiosInstance.post(`/${url}/many`, data),

  // Update assignment
  update: (id: string, data: any) => axiosInstance.put(`/${url}/${id}`, data),

  // Delete assignment
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),

  // Fetch by assessment ID
  getByAssessmentId: (assessmentId: string) => axiosInstance.get(`/${url}/assessment/${assessmentId}`),

  // Fetch by user ID
  getByUserId: (userId: string) => axiosInstance.get(`/${url}/user/${userId}`),
};
