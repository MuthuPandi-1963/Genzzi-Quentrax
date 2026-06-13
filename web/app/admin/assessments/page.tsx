"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, BookOpen, CheckCircle2, Shield, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAssessments, useAssessmentMutations } from "@/hooks/useAssessments";
import { useConfirm } from "@/context/confirm.dialog.context";
import { toast } from "sonner";
import { LoadingDialog } from "@/components/custom/LoadingDailog";
import { useAuthContext } from "@/context/auth.context";
import { Assessment, AssessmentFormData } from "@/@types/assessment.types";
import { AssessmentStatus } from "@/@types/enums";
import AssessmentTable from "./_table";
import AssessmentForm from "./_form";

// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM: AssessmentFormData = {
  title: "",
  description: "",
  status: AssessmentStatus.DRAFT,
  deadline: null,
  scheduledAt: null,
  timeLimit: null,
  startDate: null,
  endDate: null,
  published: false,
  topicId: null,
  passingScore: 50,
  maxAttempts: 1,
  maxViolations: 3,
  proctoredMode: false,
  shuffleQuestions: false,
  shuffleOptions: false,
  allowReview: true,
  allowRetry: true,
  showResultImmediately: true,
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
} satisfies Variants;

// ─────────────────────────────────────────────────────────────────────────────

export default function AssessmentPage() {
  const { data: assessments, isLoading } = useAssessments();
  const { user } = useAuthContext();
  const { createAssessment, updateAssessment, deleteAssessment, publishAssessment } = useAssessmentMutations();
  const { confirm } = useConfirm();

  const [assessmentList, setAssessmentList] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState<AssessmentFormData>(EMPTY_FORM);

  // ── Sync from query ──
  useEffect(() => {
    (async () => {
      setLoading(isLoading);
      if (assessments) {
        setAssessmentList(assessments as unknown as Assessment[]);
      }
    })();
  }, [isLoading, assessments]);

  // ── Helpers ──
  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (a: Assessment) => {
    setEditing(a);
    setFormData({
      title: a.title,
      description: a.description ?? "",
      status: a.status,
      deadline: a.deadline ? new Date(a.deadline).toISOString().slice(0, 16) : null,
      scheduledAt: a.scheduledAt ? new Date(a.scheduledAt).toISOString().slice(0, 16) : null,
      timeLimit: a.timeLimit,
      startDate: a.startDate ? new Date(a.startDate).toISOString().slice(0, 10) : null,
      endDate: a.endDate ? new Date(a.endDate).toISOString().slice(0, 10) : null,
      published: a.published,
      topicId: a.topicId,
      passingScore: a.passingScore,
      maxAttempts: a.maxAttempts,
      maxViolations: a.maxViolations,
      proctoredMode: a.proctoredMode,
      shuffleQuestions: a.shuffleQuestions,
      shuffleOptions: a.shuffleOptions,
      allowReview: a.allowReview,
      allowRetry: a.allowRetry,
      showResultImmediately: a.showResultImmediately,
    });
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // ── CRUD ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      creatorId: user?.userProfile.id ?? "",
    };

    if (editing) {
      updateAssessment.mutate(
        { id: editing.id, data: payload },
        {
          onSuccess: (res: any) => {
            toast.success(res?.message ?? "Assessment updated successfully");
            handleClose();
          },
          onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg ?? "Failed to update assessment");
          },
        }
      );
    } else {
      createAssessment.mutate(payload, {
        onSuccess: (res: any) => {
          toast.success(res?.message ?? "Assessment created successfully");
          handleClose();
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? "Failed to create assessment");
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (await confirm("Delete this assessment? This action cannot be undone.")) {
      deleteAssessment.mutate(id, {
        onSuccess: (res: any) => {
          toast.success(res?.message ?? "Assessment deleted successfully");
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? "Failed to delete assessment");
        },
      });
    }
  };

  const handlePublish = async (id: string, published: boolean) => {
    publishAssessment.mutate(
      { id, published },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message ?? `Assessment ${published ? "published" : "unpublished"} successfully`);
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? "Failed to update publish status");
        },
      }
    );
  };

  // ── Derived stats ──
  const totalAssessments = assessmentList.length;
  const activeAssessments = assessmentList.filter((a) => a.status === AssessmentStatus.ACTIVE).length;
  const publishedAssessments = assessmentList.filter((a) => a.published).length;
  const proctoredAssessments = assessmentList.filter((a) => a.proctoredMode).length;
  const totalAssignments = assessmentList.reduce((sum, a) => sum + (a.assignments?.length ?? 0), 0);
  const totalAttempts = assessmentList.reduce((sum, a) => sum + (a.attempts?.length ?? 0), 0);

  // ── Filter ──
  const filtered = assessmentList.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.topic?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingDialog open={loading} />;

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--color-foreground)">
            Assessments
          </h1>
          <p className="text-sm text-(--color-foreground-muted)">
            Create and manage assessments across all topics
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gradient-primary gap-2 w-full sm:w-auto justify-center text-white font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Assessment
        </Button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total",
            value: totalAssessments,
            icon: <BookOpen className="h-4 w-4" />,
            color: "hsl(263 70% 58%)",
            bg: "hsl(263 70% 58% / 0.1)",
          },
          {
            label: "Active",
            value: activeAssessments,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: "hsl(142 76% 45%)",
            bg: "hsl(142 76% 45% / 0.1)",
          },
          {
            label: "Published",
            value: publishedAssessments,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: "hsl(217 90% 60%)",
            bg: "hsl(217 90% 60% / 0.1)",
          },
          {
            label: "Proctored",
            value: proctoredAssessments,
            icon: <Shield className="h-4 w-4" />,
            color: "hsl(38 92% 50%)",
            bg: "hsl(38 92% 50% / 0.1)",
          },
          {
            label: "Assignments",
            value: totalAssignments,
            icon: <Users className="h-4 w-4" />,
            color: "hsl(263 70% 68%)",
            bg: "hsl(263 70% 68% / 0.1)",
          },
          {
            label: "Attempts",
            value: totalAttempts,
            icon: <BarChart3 className="h-4 w-4" />,
            color: "hsl(0 84% 60%)",
            bg: "hsl(0 84% 60% / 0.1)",
          },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Card
              className="border-(--glass-border) bg-(--color-background-elevated)
                hover:shadow-[0_8px_32px_-8px_hsl(263_70%_58%/0.2)] transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-(--color-foreground-muted)">
                  {stat.label}
                </CardTitle>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: stat.bg, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Status Breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card className="border-(--glass-border) bg-(--color-background-elevated)">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-(--color-foreground-muted)">
              Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Active", value: activeAssessments, color: "hsl(142 76% 45%)", bg: "hsl(142 76% 45% / 0.12)" },
                { label: "Inactive", value: assessmentList.filter((a) => a.status === AssessmentStatus.INACTIVE).length, color: "hsl(0 84% 60%)", bg: "hsl(0 84% 60% / 0.12)" },
                { label: "Draft", value: assessmentList.filter((a) => a.status === AssessmentStatus.DRAFT).length, color: "hsl(38 92% 50%)", bg: "hsl(38 92% 50% / 0.12)" },
                { label: "Completed", value: assessmentList.filter((a) => a.status === AssessmentStatus.COMPLETED).length, color: "hsl(217 90% 60%)", bg: "hsl(217 90% 60% / 0.12)" },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-(--glass-border)"
                  style={{ background: d.bg }}
                >
                  <span className="text-2xl font-bold" style={{ color: d.color }}>
                    {d.value}
                  </span>
                  <span className="text-xs font-medium text-(--color-foreground-muted)">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <AssessmentTable
          filteredAssessments={filtered}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleEdit={openEdit}
          handleDelete={handleDelete}
          handlePublish={handlePublish}
        />
      </motion.div>

      {/* ── Form Modal ── */}
      <AssessmentForm
        open={isFormOpen}
        editingAssessment={editing}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        onClose={handleClose}
      />
    </div>
  );
}
