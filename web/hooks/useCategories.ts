import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryAPI } from "../api/categories";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["categories", id],
      queryFn: () => CategoryAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const createCategory = useMutation({
    mutationFn: CategoryAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => CategoryAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => CategoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories: data || [],
    isLoading,
    isError,
    getById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
