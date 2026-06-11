import { CategoryCreateInput } from "@/@types";
import AxiosInstance from "../lib/axiosInstance";

const url = "categories";

export const CategoryAPI = {
  // Fetch all categories
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch category by ID
  getById: (id: string) => AxiosInstance.get(`/${url}/${id}`),

  // Create new category
  create: (data: CategoryCreateInput) => AxiosInstance.post(`/${url}`, data),

  // Update category
  update: (id: string, data: Partial<CategoryCreateInput>) => AxiosInstance.patch(`/${url}/${id}`, data),

  // Soft delete category
  delete: (id: string) => AxiosInstance.delete(`/${url}/${id}`),
};
