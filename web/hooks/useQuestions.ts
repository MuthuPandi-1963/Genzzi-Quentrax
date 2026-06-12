import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestionAPI } from "../api/questions";
import { QuestionFormData } from "@/components/forms";

export const useQuestions = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["questions"],
    queryFn: QuestionAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const createQuestion = useMutation({
    mutationFn: QuestionAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });

  const createMany = useMutation({
    mutationFn: QuestionAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });

  const updateQuestion = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuestionFormData> }) =>
      QuestionAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: (id: string) => QuestionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });

  return {
    questions: data?.data || [],
    isLoading,
    isError,
    createQuestion,
    createMany,
    updateQuestion,
    deleteQuestion,
  };
};
