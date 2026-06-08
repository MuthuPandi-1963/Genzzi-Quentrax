import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssessmentAPI } from "../api/assessments";

export const useAssessments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assessments"],
    queryFn: AssessmentAPI.getAll,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ["assessments", id],
      queryFn: () => AssessmentAPI.getById(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getAssignments = (id: string) =>
    useQuery({
      queryKey: ["assessments", id, "assignments"],
      queryFn: () => AssessmentAPI.getAssignments(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getAttempts = (id: string, params?: any) =>
    useQuery({
      queryKey: ["assessments", id, "attempts", params],
      queryFn: () => AssessmentAPI.getAttempts(id, params),
      select: (res) => res.data,
      enabled: !!id,
    });

  const getResults = (id: string) =>
    useQuery({
      queryKey: ["assessments", id, "results"],
      queryFn: () => AssessmentAPI.getResults(id),
      select: (res) => res.data,
      enabled: !!id,
    });

  const createAssessment = useMutation({
    mutationFn: AssessmentAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const createMany = useMutation({
    mutationFn: AssessmentAPI.createMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const updateAssessment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AssessmentAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const deleteAssessment = useMutation({
    mutationFn: (id: string) => AssessmentAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const publish = useMutation({
    mutationFn: (id: string) => AssessmentAPI.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const assign = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AssessmentAPI.assign(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["assessments", vars.id, "assignments"] });
    },
  });

  const start = useMutation({
    mutationFn: (id: string) => AssessmentAPI.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const submit = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AssessmentAPI.submit(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["assessments", vars.id, "results"] });
      queryClient.invalidateQueries({ queryKey: ["assessments", vars.id, "attempts"] });
      queryClient.invalidateQueries({ queryKey: ["coins"] });
    },
  });

  return {
    assessments: data || [],
    isLoading,
    isError,
    getById,
    getAssignments,
    getAttempts,
    getResults,
    createAssessment,
    createMany,
    updateAssessment,
    deleteAssessment,
    publish,
    assign,
    start,
    submit,
  };
};
