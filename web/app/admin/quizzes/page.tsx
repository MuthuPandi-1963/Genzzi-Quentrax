"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Quiz } from "@/@types";
import { useQuizzes, useQuizMutations } from "@/hooks/useQuizzes";
import { useConfirm } from "@/context/confirm.dialog.context";
import { toast } from "sonner";
import { LoadingDialog } from "@/components/custom/LoadingDailog";
import { QuizFormData } from "@/api/quizzes";
import QuizTable from "./_table";
import QuizForm from "@/components/forms/QuizForm";
import { useAuthContext } from "@/context/auth.context";

// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM: QuizFormData = {
  title: "",
  description: "",
  status: "ACTIVE",
  tags: [],
  timeLimit: 10,
  imageUrl: "",
  topicId: "",
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

export default function QuizPage() {
  const { data: quizzes, isLoading } = useQuizzes();
  const {user} = useAuthContext();
  console.log(user);
  
  const { createQuiz, updateQuiz, deleteQuiz } = useQuizMutations();
  const { confirm } = useConfirm();

  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState<QuizFormData>(EMPTY_FORM);

  // ── Sync from query ──
  useEffect(() => {
    (async()=>{
        setLoading(isLoading);
    if (quizzes) {
        
      setQuizList(quizzes as unknown as Quiz[]);
    }
    })()
  }, [isLoading, quizzes]);

  // ── Helpers ──
  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (q: Quiz) => {
    setEditing(q);
    setFormData({
      title: q.title,
      description: q.description ?? "",
      status: q.status,
      tags: q.tags ?? [],
      timeLimit: q.timeLimit ?? "",
      imageUrl: q.imageUrl ?? "",
      topicId: q.topic?.id ?? q.topicId ?? "",
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
      creatorId: user?.userProfile.id ?? '',
      timeLimit: formData.timeLimit === "" ? null : Number(formData.timeLimit),
    };

    if (editing) {
      updateQuiz.mutate(
        { id: editing.id, data: payload },
        {
          onSuccess: (res) => {
            toast.success(res.message ?? "Quiz updated successfully");
            handleClose();
          },
          onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg ?? "Failed to update quiz");
          },
        }
      );
    } else {
      createQuiz.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message ?? "Quiz created successfully");
          handleClose();
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? "Failed to create quiz");
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (await confirm("Delete this quiz? This action cannot be undone.")) {
      deleteQuiz.mutate(id, {
        onSuccess: (res) => {
          toast.success(res.message ?? "Quiz deleted successfully");
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? "Failed to delete quiz");
        },
      });
    }
  };

  // ── Derived stats ──
  const totalQuizzes = quizList.length;
  const activeQuizzes = quizList.filter((q) => q.status === "ACTIVE").length;

  // ── Filter ──
  const filtered = quizList.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.topic?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.creator?.username?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Quizzes
          </h1>
          <p className="text-sm text-(--color-foreground-muted)">
            Create and manage quizzes across all topics
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gradient-primary gap-2 w-full sm:w-auto justify-center text-white font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Quiz
        </Button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Quizzes",
            value: totalQuizzes,
            icon: <BookOpen className="h-4 w-4" />,
            color: "hsl(263 70% 58%)",
            bg: "hsl(263 70% 58% / 0.1)",
          },
          {
            label: "Active",
            value: activeQuizzes,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: "hsl(142 76% 45%)",
            bg: "hsl(142 76% 45% / 0.1)",
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
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Active", value: activeQuizzes, color: "hsl(142 76% 45%)", bg: "hsl(142 76% 45% / 0.12)" },
                { label: "Inactive", value: quizList.filter((q) => q.status === "INACTIVE").length, color: "hsl(0 84% 60%)", bg: "hsl(0 84% 60% / 0.12)" },
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
        <QuizTable
          filteredQuizzes={filtered}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleEdit={openEdit}
          handleDelete={handleDelete}
        />
      </motion.div>

      {/* ── Form Modal ── */}
      <QuizForm
        open={isFormOpen}
        editingQuiz={editing}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        onClose={handleClose}
      />
    </div>
  );
}