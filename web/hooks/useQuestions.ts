import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestionAPI } from "../api/questions";

export const useQuestions = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["questions"],
    queryFn: QuestionAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["questions", id],
      queryFn: () => QuestionAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByTopicId = (topicId: string) =>
    useQuery({
      queryKey: ["questions", "topic", topicId],
      queryFn: () => QuestionAPI.getByTopicId(topicId),
      select: (res) => res.data,
      enabled: !!topicId,
    });

  const createQuestion = useMutation({
    mutationFn: QuestionAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });

  const createMany = useMutation({
    mutationFn: QuestionAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });

  const updateQuestion = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => QuestionAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: (id: string) => QuestionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });

  return {
    questions: data || [],
    isLoading,
    isError,
    getById,
    getByTopicId,
    createQuestion,
    createMany,
    updateQuestion,
    deleteQuestion,
  };
};
