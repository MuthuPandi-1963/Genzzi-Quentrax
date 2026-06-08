import AxiosInstance from "@/lib/axiosInstance";

const url = "coins-history";

export const CoinsHistoryAPI = {
  // Fetch all coins history entries
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch coins history by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create coins history entry (usually auto-created on coin change)
  create: (data: any) => AxiosInstance.post(`/${url}`, data),

  // Create multiple coins history entries
  createMany: (data: any) => AxiosInstance.post(`/${url}/many`, data),

  // Update coins history
  update: (id: string, data: any) => AxiosInstance.put(`/${url}/${id}`, data),

  // Delete coins history
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Fetch by user ID
  getByUserId: (userId: string) => AxiosInstance.get(`/${url}/user/${userId}`),
};
