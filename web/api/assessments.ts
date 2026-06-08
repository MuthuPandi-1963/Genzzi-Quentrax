import AxiosInstance from "@/lib/axiosInstance";

const url = "assessments";

export const AssessmentAPI = {
  // Fetch all assessments
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch assessment by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create new assessment
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple assessments
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update assessment
  update: (id: string, data: any) => AxiosInstance.patch(`/${url}/${id}`, data),

  // Soft delete assessment
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Publish assessment
  publish: (id: string) => AxiosInstance.post(`/${url}/${id}/publish`),

  // Assign users to assessment
  assign: (id: string, data: any) => AxiosInstance.post(`/${url}/${id}/assign`, data),

  // Get assignments for assessment
  getAssignments: (id: string) => AxiosInstance.get(`/${url}/${id}/assignments`),

  // Get attempts for assessment
  getAttempts: (id: string, params?: any) => AxiosInstance.get(`/${url}/${id}/attempts`, { params }),

  // Start assessment attempt
  start: (id: string) => AxiosInstance.post(`/${url}/${id}/start`),

  // Submit assessment attempt
  submit: (id: string, data: any) => AxiosInstance.post(`/${url}/${id}/submit`, data),

  // Get assessment results
  getResults: (id: string) => AxiosInstance.get(`/${url}/${id}/results`),
};
