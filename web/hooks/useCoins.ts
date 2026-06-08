import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CoinsAPI } from "../api/coins";

export const useCoins = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["coins"],
    queryFn: CoinsAPI.getBalance,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 2,
  });

  const getHistory = useQuery({
    queryKey: ["coins", "history"],
    queryFn: CoinsAPI.getHistory,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 2,
  });

  const adjust = useMutation({
    mutationFn: CoinsAPI.adjust,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coins"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "history"] });
    },
  });

  return {
    coins: data || { balance: 0 },
    isLoading,
    isError,
    getHistory,
    adjust,
  };
};
