import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizAPI } from "../api/quizzes";

export const useQuizzes = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quizzes"],
    queryFn: QuizAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["quizzes", id],
      queryFn: () => QuizAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByTopicId = (topicId: string) =>
    useQuery({
      queryKey: ["quizzes", "topic", topicId],
      queryFn: () => QuizAPI.getByTopicId(topicId),
      select: (res) => res.data,
      enabled: !!topicId,
    });

  const getHistory = (id: string) =>
    useQuery({
      queryKey: ["quizzes", id, "history"],
      queryFn: () => QuizAPI.getHistory(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getLeaderboard = (id: string, params?: any) =>
    useQuery({
      queryKey: ["quizzes", id, "leaderboard", params],
      queryFn: () => QuizAPI.getLeaderboard(id, params),
      select: (res) => res.data,
      enabled: !!id,
    });

  const createQuiz = useMutation({
    mutationFn: QuizAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes"]);
    },
  });

  const createMany = useMutation({
    mutationFn: QuizAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes"]);
    },
  });

  const updateQuiz = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => QuizAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes"]);
    },
  });

  const deleteQuiz = useMutation({
    mutationFn: (id: string) => QuizAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes"]);
    },
  });

  const addQuestions = useMutation({
    mutationFn: ({ quizId, addedQuestionIds }: { quizId: string; addedQuestionIds: string[] }) =>
      QuizAPI.addQuestions(quizId, addedQuestionIds),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries(["quizzes", vars.quizId]);
    },
  });

  const start = useMutation({
    mutationFn: (id: string) => QuizAPI.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes"]);
    },
  });

  const submit = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => QuizAPI.submit(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries(["quizzes", vars.id, "history"]);
      queryClient.invalidateQueries(["coins"]);
    },
  });

  return {
    quizzes: data || [],
    isLoading,
    isError,
    getById,
    getByTopicId,
    getHistory,
    getLeaderboard,
    createQuiz,
    createMany,
    updateQuiz,
    deleteQuiz,
    addQuestions,
    start,
    submit,
  };
};
