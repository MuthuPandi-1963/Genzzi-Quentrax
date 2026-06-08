import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizHistoryAPI } from "../api/quiz-history";

export const useQuizHistory = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz-history"],
    queryFn: QuizHistoryAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["quiz-history", id],
      queryFn: () => QuizHistoryAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByUserId = (userId: string) =>
    useQuery({
      queryKey: ["quiz-history", "user", userId],
      queryFn: () => QuizHistoryAPI.getByUserId(userId),
      select: (res) => res.data,
      enabled: !!userId,
    });

  const getByQuizId = (quizId: string) =>
    useQuery({
      queryKey: ["quiz-history", "quiz", quizId],
      queryFn: () => QuizHistoryAPI.getByQuizId(quizId),
      select: (res) => res.data,
      enabled: !!quizId,
    });

  const create = useMutation({
    mutationFn: QuizHistoryAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-history"] });
    },
  });

  const createMany = useMutation({
    mutationFn: QuizHistoryAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-history"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => QuizHistoryAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-history"] });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: (id: string) => QuizHistoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-history"] });
    },
  });

  return {
    history: data || [],
    isLoading,
    isError,
    getById,
    getByUserId,
    getByQuizId,
    create,
    createMany,
    update,
    deleteEntry,
  };
};
