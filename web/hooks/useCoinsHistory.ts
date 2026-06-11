import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CoinsHistoryAPI } from "../api/coins-history";

export const useCoinsHistory = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["coins-history"],
    queryFn: CoinsHistoryAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["coins-history", id],
      queryFn: () => CoinsHistoryAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByUserId = (userId: string) =>
    useQuery({
      queryKey: ["coins-history", "user", userId],
      queryFn: () => CoinsHistoryAPI.getByUserId(userId),
      select: (res) => res.data,
      enabled: !!userId,
    });

  const create = useMutation({
    mutationFn: CoinsHistoryAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["coins-history"]);
    },
  });

  const createMany = useMutation({
    mutationFn: CoinsHistoryAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries(["coins-history"]);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => CoinsHistoryAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["coins-history"]);
    },
  });

  const deleteEntry = useMutation({
    mutationFn: (id: string) => CoinsHistoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["coins-history"]);
    },
  });

  return {
    history: data || [],
    isLoading,
    isError,
    getById,
    getByUserId,
    create,
    createMany,
    update,
    deleteEntry,
  };
};
