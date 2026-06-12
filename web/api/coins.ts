import axiosInstance from "@/lib/axiosInstance";


const url = "coins";

export const CoinsAPI = {
  // Get current user's coin balance
  getBalance: () => axiosInstance.get(`/${url}`),

  // Get coin transaction history
  getHistory: () => axiosInstance.get(`/${url}/history`),

  // Adjust coins (admin only)
  adjust: (data: any) => axiosInstance.post(`/${url}/adjust`, data),
};
