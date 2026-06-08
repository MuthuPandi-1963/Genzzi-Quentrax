import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "../api/users";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: UserAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["users", id],
      queryFn: () => UserAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getMe = useQuery({
    queryKey: ["me"],
    queryFn: UserAPI.getMe,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const updateMe = useMutation({
    mutationFn: UserAPI.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => UserAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => UserAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const block = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => UserAPI.block(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: data || [],
    isLoading,
    isError,
    getById,
    getMe,
    updateMe,
    update,
    deleteUser,
    block,
  };
};
