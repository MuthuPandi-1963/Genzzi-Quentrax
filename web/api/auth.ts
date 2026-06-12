import { ApiResponse, AuthUser } from "@/@types/auth";
import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "auth";

export const AuthAPI = {
  login: () =>
    axiosInstance.post<ApiResponse<null>>(`/${BASE_URL}/genzzi/login`),

  logout: () =>
    axiosInstance.post<ApiResponse<null>>(`/${BASE_URL}/logout`),

  refresh: () =>
    axiosInstance.post<ApiResponse<null>>(`/${BASE_URL}/refresh`),

  me: () =>
    axiosInstance.get<ApiResponse<AuthUser>>(`/${BASE_URL}/me`),
};