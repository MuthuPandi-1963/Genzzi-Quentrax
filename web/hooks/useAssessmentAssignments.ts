import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssessmentAssignmentAPI } from "../api/assessment-assignments";

export const useAssessmentAssignments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assessment-assignments"],
    queryFn: AssessmentAssignmentAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["assessment-assignments", id],
      queryFn: () => AssessmentAssignmentAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getByAssessmentId = (assessmentId: string) =>
    useQuery({
      queryKey: ["assessment-assignments", "assessment", assessmentId],
      queryFn: () => AssessmentAssignmentAPI.getByAssessmentId(assessmentId),
      select: (res) => res.data,
      enabled: !!assessmentId,
    });

  const getByUserId = (userId: string) =>
    useQuery({
      queryKey: ["assessment-assignments", "user", userId],
      queryFn: () => AssessmentAssignmentAPI.getByUserId(userId),
      select: (res) => res.data,
      enabled: !!userId,
    });

  const create = useMutation({
    mutationFn: AssessmentAssignmentAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-assignments"] });
    },
  });

  const createMany = useMutation({
    mutationFn: AssessmentAssignmentAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-assignments"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AssessmentAssignmentAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-assignments"] });
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: (id: string) => AssessmentAssignmentAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-assignments"] });
    },
  });

  return {
    assignments: data || [],
    isLoading,
    isError,
    getById,
    getByAssessmentId,
    getByUserId,
    create,
    createMany,
    update,
    deleteAssignment,
  };
};
