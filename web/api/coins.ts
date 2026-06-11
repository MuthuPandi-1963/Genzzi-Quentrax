import AxiosInstance from "./axiosInstance.js";

const url = "coins";

export const CoinsAPI = {
  // Get current user's coin balance
  getBalance: () => AxiosInstance.get(`/${url}`),

  // Get coin transaction history
  getHistory: () => AxiosInstance.get(`/${url}/history`),

  // Adjust coins (admin only)
  adjust: (data: any) => AxiosInstance.post(`/${url}/adjust`, data),
};
