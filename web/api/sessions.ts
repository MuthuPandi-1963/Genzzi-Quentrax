import AxiosInstance from "./axiosInstance.js";

const url = "sessions";

export const SessionAPI = {
  // Fetch all active sessions for current user
  getAll: () => AxiosInstance.get(`/${url}`),

  // Revoke a specific session
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),
};
