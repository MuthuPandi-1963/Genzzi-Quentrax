import AxiosInstance from "./axiosInstance.js";

const url = "audit-logs";

export const AuditLogAPI = {
  // Fetch all audit logs (admin/staff)
  getAll: () => AxiosInstance.get(`/${url}`),

  // Fetch audit logs with filters
  getByFilter: (params: any) => AxiosInstance.get(`/${url}`, { params }),
};
