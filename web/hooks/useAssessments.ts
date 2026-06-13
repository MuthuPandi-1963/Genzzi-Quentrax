import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssessmentAPI } from "@/api/assessments";
import { AssessmentFormData } from "@/api/assessment.types";

// ─── Queries ──────────────────────────────────────────────────────────────

export const useAssessments = (params?: {
  status?: string;
  published?: string;
  topicId?: string;
}) => {
  return useQuery({
    queryKey: ["assessments", params],
    queryFn: async () => {
      const res = await AssessmentAPI.getAll(params);
      return res.data.data; // unwrap ResponseSender wrapper
    },
    select: (data) => data,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAssessmentById = (id: string) => {
  return useQuery({
    queryKey: ["assessments", id],
    queryFn: async () => {
      const res = await AssessmentAPI.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useAssessmentAssignments = (id: string) => {
  return useQuery({
    queryKey: ["assessments", id, "assignments"],
    queryFn: async () => {
      const res = await AssessmentAPI.getAssignments(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useAssessmentAttempts = (id: string) => {
  return useQuery({
    queryKey: ["assessments", id, "attempts"],
    queryFn: async () => {
      const res = await AssessmentAPI.getAttempts(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// ─── Mutations ──────────────────────────────────────────────────────────

export const useAssessmentMutations = () => {
  const queryClient = useQueryClient();

  const createAssessment = useMutation({
    mutationFn: async (data: AssessmentFormData) => {
      const res = await AssessmentAPI.create(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const createMany = useMutation({
    mutationFn: async (data: AssessmentFormData[]) => {
      const res = await AssessmentAPI.createMany(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const updateAssessment = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AssessmentFormData>;
    }) => {
      const res = await AssessmentAPI.update(id, data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessments", vars.id] });
    },
  });

  const publishAssessment = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const res = await AssessmentAPI.publish(id, published);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessments", vars.id] });
    },
  });

  const assignUsers = useMutation({
    mutationFn: async ({ id, userIds }: { id: string; userIds: string[] }) => {
      const res = await AssessmentAPI.assignUsers(id, userIds);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["assessments", vars.id, "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const deleteAssessment = useMutation({
    mutationFn: async (id: string) => {
      const res = await AssessmentAPI.delete(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  return {
    createAssessment,
    createMany,
    updateAssessment,
    publishAssessment,
    assignUsers,
    deleteAssessment,
  };
};
