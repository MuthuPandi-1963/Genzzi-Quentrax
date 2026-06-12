import axiosInstance from "@/lib/axiosInstance";


const url = "users";

export const UserAPI = {
  // Fetch all users (admin/staff)
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch current user profile
  getMe: () => axiosInstance.get(`/${url}/me`),

  // Update current user profile
  updateMe: (data: any) => axiosInstance.patch(`/${url}/me`, data),

  // Fetch user by ID
  getById: (id: string) => axiosInstance.get(`/${url}/${id}`),

  // Update user by ID (admin)
  update: (id: string, data: any) => axiosInstance.patch(`/${url}/${id}`, data),

  // Soft delete user (admin)
  delete: (id: string) => axiosInstance.delete(`/${url}/${id}`),

  // Block/unblock user (admin)
  block: (id: string, data: any) => axiosInstance.post(`/${url}/${id}/block`, data),
};
