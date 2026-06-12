import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopicAPI } from "../api/topics";
import { Difficulty } from "@/@types/enums";

export interface TopicFormData {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  difficulty: Difficulty;
  tags: string[];
}

export const useTopics = () => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["topics"],
    queryFn: TopicAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  return {
    topics: data?.data || [],
    isLoading,
    isError,
  };
};

export const useTopicById = (id: string) => {
  return useQuery({
    queryKey: ["topics", id],
    queryFn: () => TopicAPI.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useTopicsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["topics", "category", categoryId],
    queryFn: () => TopicAPI.getByCategoryId(categoryId),
    select: (res) => res.data,
    enabled: !!categoryId,
  });
};

export const useTopicMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["topics"],
    });

  return {
    createTopic: useMutation({
      mutationFn: TopicAPI.create,
      onSuccess: invalidate,
    }),

    updateTopic: useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: Partial<TopicFormData>;
      }) => TopicAPI.update(id, data),
      onSuccess: invalidate,
    }),

    deleteTopic: useMutation({
      mutationFn: (id: string) => TopicAPI.delete(id),
      onSuccess: invalidate,
    }),
  };
};