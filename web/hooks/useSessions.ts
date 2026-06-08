import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionAPI } from "../api/sessions";

export const useSessions = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sessions"],
    queryFn: SessionAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 2,
  });

  const deleteSession = useMutation({
    mutationFn: (id: string) => SessionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return {
    sessions: data || [],
    isLoading,
    isError,
    deleteSession,
  };
};
