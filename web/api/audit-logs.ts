import axiosInstance from "@/lib/axiosInstance";

const url = "audit-logs";

export const AuditLogAPI = {
  // Fetch all audit logs (admin/staff)
  getAll: () => axiosInstance.get(`/${url}`),

  // Fetch audit logs with filters
  getByFilter: (params: any) => axiosInstance.get(`/${url}`, { params }),
};
