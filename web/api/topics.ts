import AxiosInstance from "./axiosInstance.js";

const url = "topics";

export const TopicAPI = {
  // Fetch all topics
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch topics by category
  getByCategoryId: (categoryId: string) => AxiosInstance.get(`/${url}`, { params: { categoryId } }),

  // Fetch topic by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create new topic
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Update topic
  update: (id: string, data: any) => AxiosInstance.patch(`/${url}/${id}`, data),

  // Soft delete topic
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),
};
