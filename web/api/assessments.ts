import axiosInstance from "@/lib/axiosInstance";


const url = "assessments";

export const AssessmentAPI = {
  // Fetch all assessments
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch assessment by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create new assessment
  create: (data: any) => axiosInstance.post(`/${url}`, data),

  // Create multiple assessments
  createMany: (data: any) => axiosInstance.post(`/${url}/many`, data),

  // Update assessment
  update: (id: string, data: any) => axiosInstance.patch(`/${url}/${id}`, data),

  // Soft delete assessment
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),

  // Publish assessment
  publish: (id: string) => axiosInstance.post(`/${url}/${id}/publish`),

  // Assign users to assessment
  assign: (id: string, data: any) => axiosInstance.post(`/${url}/${id}/assign`, data),

  // Get assignments for assessment
  getAssignments: (id: string) => axiosInstance.get(`/${url}/${id}/assignments`),

  // Get attempts for assessment
  getAttempts: (id: string, params?: any) => axiosInstance.get(`/${url}/${id}/attempts`, { params }),

  // Start assessment attempt
  start: (id: string) => axiosInstance.post(`/${url}/${id}/start`),

  // Submit assessment attempt
  submit: (id: string, data: any) => axiosInstance.post(`/${url}/${id}/submit`, data),

  // Get assessment results
  getResults: (id: string) => axiosInstance.get(`/${url}/${id}/results`),
};
