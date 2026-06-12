import { Topic } from "@/@types";
import { TopicFormData } from "@/components/forms";
import axiosInstance from "@/lib/axiosInstance";

const url = "topics";

export const TopicAPI = {
  // Fetch all topics
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch topics by category
  getByCategoryId: (categoryId: string) => axiosInstance.get(`/${url}`, { params: { categoryId } }),

  // Fetch topic by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create new topic
  create: (data: TopicFormData) => axiosInstance.post(`/${url}`, data),

  // Update topic
  update: (id: string, data: Partial<TopicFormData>) => axiosInstance.put(`/${url}/${id}`, data),

  // Soft delete topic
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),
};
