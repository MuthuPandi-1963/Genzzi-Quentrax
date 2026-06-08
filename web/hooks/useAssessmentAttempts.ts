import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssessmentAttemptAPI } from "../api/assessment-attempts";

export const useAssessmentAttempts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assessment-attempts"],
    queryFn: AssessmentAttemptAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["assessment-attempts", id],
      queryFn: () => AssessmentAttemptAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByAssessmentId = (assessmentId: string) =>
    useQuery({
      queryKey: ["assessment-attempts", "assessment", assessmentId],
      queryFn: () => AssessmentAttemptAPI.getByAssessmentId(assessmentId),
      select: (res) => res.data,
      enabled: !!assessmentId,
    });

  const getByUserId = (userId: string) =>
    useQuery({
      queryKey: ["assessment-attempts", "user", userId],
      queryFn: () => AssessmentAttemptAPI.getByUserId(userId),
      select: (res) => res.data,
      enabled: !!userId,
    });

  const create = useMutation({
    mutationFn: AssessmentAttemptAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-attempts"] });
    },
  });

  const createMany = useMutation({
    mutationFn: AssessmentAttemptAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-attempts"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AssessmentAttemptAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-attempts"] });
    },
  });

  const deleteAttempt = useMutation({
    mutationFn: (id: string) => AssessmentAttemptAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-attempts"] });
    },
  });

  return {
    attempts: data || [],
    isLoading,
    isError,
    getById,
    getByAssessmentId,
    getByUserId,
    create,
    createMany,
    update,
    deleteAttempt,
  };
};
