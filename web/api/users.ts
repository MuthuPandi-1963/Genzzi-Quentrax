import AxiosInstance from "@/lib/axiosInstance";

const url = "users";

export const UserAPI = {
  // Fetch all users (admin/staff)
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch current user profile
  getMe: () => AxiosInstance.get(`/${url}/me`),

  // Update current user profile
  updateMe: (data: any) => AxiosInstance.patch(`/${url}/me`, data),

  // Fetch user by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Update user by ID (admin)
  update: (id: string, data: any) => AxiosInstance.patch(`/${url}/${id}`, data),

  // Soft delete user (admin)
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),

  // Block/unblock user (admin)
  block: (id: string, data: any) => AxiosInstance.post(`/${url}/${id}/block`, data),
};
