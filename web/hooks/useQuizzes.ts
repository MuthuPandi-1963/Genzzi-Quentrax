import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizAPI, QuizFormData } from "@/api/quizzes";

// ─── Queries ──────────────────────────────────────────────────────────────

export const useQuizzes = (params?: {
  status?: string;
  creatorId?: string;
  tag?: string;
  topicId?: string;
}) => {
  return useQuery({
    queryKey: ["quizzes", params],
    queryFn: async () => {
      const res = await QuizAPI.getAll(params);
      return res.data.data; // unwrap ResponseSender wrapper
    },
    select: (data) => data,
    staleTime: 1000 * 60 * 5,
  });
};

export const useQuizById = (id: string) => {
  return useQuery({
    queryKey: ["quizzes", id],
    queryFn: async () => {
      const res = await QuizAPI.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useQuizzesByTopic = (topicId: string) => {
  return useQuery({
    queryKey: ["quizzes", "topic", topicId],
    queryFn: async () => {
      const res = await QuizAPI.getByTopicId(topicId);
      return res.data.data;
    },
    enabled: !!topicId,
  });
};

export const useQuizHistory = (id: string) => {
  return useQuery({
    queryKey: ["quizzes", id, "history"],
    queryFn: async () => {
      const res = await QuizAPI.getHistory(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useQuizLeaderboard = (
  id: string,
  params?: Record<string, unknown>,
) => {
  return useQuery({
    queryKey: ["quizzes", id, "leaderboard", params],
    queryFn: async () => {
      const res = await QuizAPI.getLeaderboard(id, params);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// ─── Mutations ──────────────────────────────────────────────────────────

export const useQuizMutations = () => {
  const queryClient = useQueryClient();

  const createQuiz = useMutation({
    mutationFn: async (data: QuizFormData) => {
      const res = await QuizAPI.create(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const createMany = useMutation({
    mutationFn: async (data: QuizFormData[]) => {
      const res = await QuizAPI.createMany(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const updateQuiz = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<QuizFormData>;
    }) => {
      const res = await QuizAPI.update(id, data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes", vars.id] });
    },
  });

  const deleteQuiz = useMutation({
    mutationFn: async (id: string) => {
      const res = await QuizAPI.delete(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const addQuestions = useMutation({
    mutationFn: async ({
      quizId,
      questionIds,
    }: {
      quizId: string;
      questionIds: string[];
    }) => {
      const res = await QuizAPI.addQuestions(quizId, questionIds);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", vars.quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const removeQuestions = useMutation({
    mutationFn: async ({
      quizId,
      questionIds,
    }: {
      quizId: string;
      questionIds: string[];
    }) => {
      const res = await QuizAPI.removeQuestions(quizId, questionIds);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", vars.quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const start = useMutation({
    mutationFn: async (id: string) => {
      const res = await QuizAPI.start(id);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", id] });
    },
  });

  const submit = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const res = await QuizAPI.submit(id, data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", vars.id, "history"],
      });
      queryClient.invalidateQueries({ queryKey: ["coins"] });
    },
  });

  return {
    createQuiz,
    createMany,
    updateQuiz,
    deleteQuiz,
    addQuestions,
    removeQuestions,
    start,
    submit,
  };
};
