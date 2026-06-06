import { useQuery } from "@tanstack/react-query";
import { AuditLogAPI } from "../api/audit-logs";

export const useAuditLogs = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: AuditLogAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 2,
  });

  const getByFilter = (params: any) =>
    useQuery({
      queryKey: ["audit-logs", params],
      queryFn: () => AuditLogAPI.getByFilter(params),
      select: (res) => res.data,
      enabled: !!params,
    });

  return {
    auditLogs: data || [],
    isLoading,
    isError,
    getByFilter,
  };
};
