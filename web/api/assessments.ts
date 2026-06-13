import type { AssessmentFormData } from "@/@types/assessment.types";
import axiosInstance from "@/lib/axiosInstance";

export const AssessmentAPI = {
  // ── Read ──
  getAll: (params?: {
    status?: string;
    published?: string;
    topicId?: string;
  }) => axiosInstance.get("/assessments", { params }),

  getById: (id: string) => axiosInstance.get(`/assessments/${id}`),

  getAssignments: (id: string) => axiosInstance.get(`/assessments/${id}/assignments`),

  getAttempts: (id: string) => axiosInstance.get(`/assessments/${id}/attempts`),

  // ── Write ──
  create: (data: AssessmentFormData) => axiosInstance.post("/assessments", data),

  createMany: (data: AssessmentFormData[]) => axiosInstance.post("/assessments/many", { assessments: data }),

  update: (id: string, data: Partial<AssessmentFormData>) => axiosInstance.put(`/assessments/${id}`, data),

  publish: (id: string, published: boolean) =>
    axiosInstance.post(`/assessments/${id}/publish`, { published }),

  assignUsers: (id: string, userIds: string[]) =>
    axiosInstance.post(`/assessments/${id}/assign`, { userIds }),

  delete: (id: string) => axiosInstance.delete(`/assessments/${id}`),
};
