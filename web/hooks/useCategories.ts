import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { CategoryAPI } from "../api/categories";
import type { Category } from "@/@types";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const createCategory = useMutation({
    mutationFn: CategoryAPI.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Category>;
    }) => CategoryAPI.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) =>
      CategoryAPI.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return {
    Categories: data?.data ?? [],
    isLoading,
    isError,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export const UseCategoryById = (id:string="")=>{
  const {data,isLoading,isError} = useQuery({
    queryKey : ["categories",id],
    queryFn: async ()=> await CategoryAPI.getById(id),
    select : (res)=>res.data,
    enabled: !!id
  })
  return {
    data: data?.data ?? null,
    isLoading,
    isError
  }
}