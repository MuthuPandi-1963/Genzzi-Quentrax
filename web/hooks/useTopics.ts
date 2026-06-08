import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopicAPI } from "../api/topics";

export const useTopics = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["topics"],
    queryFn: TopicAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["topics", id],
      queryFn: () => TopicAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByCategoryId = (categoryId: string) =>
    useQuery({
      queryKey: ["topics", "category", categoryId],
      queryFn: () => TopicAPI.getByCategoryId(categoryId),
      select: (res) => res.data,
      enabled: !!categoryId,
    });

  const createTopic = useMutation({
    mutationFn: TopicAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const updateTopic = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => TopicAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const deleteTopic = useMutation({
    mutationFn: (id: string) => TopicAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  return {
    topics: data || [],
    isLoading,
    isError,
    getById,
    getByCategoryId,
    createTopic,
    updateTopic,
    deleteTopic,
  };
};
