import axiosInstance from "@/lib/axiosInstance";


const url = "coins-history";

export const CoinsHistoryAPI = {
  // Fetch all coins history entries
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch coins history by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Create coins history entry (usually auto-created on coin change)
  create: (data: any) => axiosInstance.post(`/${url}`, data),

  // Create multiple coins history entries
  createMany: (data: any) => axiosInstance.post(`/${url}/many`, data),

  // Update coins history
  update: (id: string, data: any) => axiosInstance.put(`/${url}/${id}`, data),

  // Delete coins history
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),

  // Fetch by user ID
  getByUserId: (userId: string) => axiosInstance.get(`/${url}/user/${userId}`),
};
