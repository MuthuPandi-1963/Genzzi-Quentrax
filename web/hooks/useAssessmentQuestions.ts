import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssessmentQuestionAPI } from "../api/assessment-questions";

export const useAssessmentQuestions = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assessment-questions"],
    queryFn: AssessmentQuestionAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["assessment-questions", id],
      queryFn: () => AssessmentQuestionAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByAssessmentId = (assessmentId: string) =>
    useQuery({
      queryKey: ["assessment-questions", "assessment", assessmentId],
      queryFn: () => AssessmentQuestionAPI.getByAssessmentId(assessmentId),
      select: (res) => res.data,
      enabled: !!assessmentId,
    });

  const getByQuestionId = (questionId: string) =>
    useQuery({
      queryKey: ["assessment-questions", "question", questionId],
      queryFn: () => AssessmentQuestionAPI.getByQuestionId(questionId),
      select: (res) => res.data,
      enabled: !!questionId,
    });

  const create = useMutation({
    mutationFn: AssessmentQuestionAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-questions"] });
    },
  });

  const createMany = useMutation({
    mutationFn: AssessmentQuestionAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-questions"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AssessmentQuestionAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-questions"] });
    },
  });

  const deleteLink = useMutation({
    mutationFn: (id: string) => AssessmentQuestionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-questions"] });
    },
  });

  return {
    links: data || [],
    isLoading,
    isError,
    getById,
    getByAssessmentId,
    getByQuestionId,
    create,
    createMany,
    update,
    deleteLink,
  };
};
