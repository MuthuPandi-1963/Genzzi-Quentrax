"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, HelpCircle, Archive, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Question } from "@/@types";
import { useQuestions } from "@/hooks";
import { useConfirm } from "@/context/confirm.dialog.context";
import { toast } from "sonner";
import { LoadingDialog } from "@/components/custom/LoadingDailog";
import QuestionForm from "@/components/forms/QuestionForm";
import QuestionBulkImportForm from "@/components/forms/QuestionBulkImportForm";
import QuestionTable from "./_table";
import { Difficulty, QuestionStatus, QuestionType } from "@/@types/enums";

// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM: QuestionFormData = {
  questionText: "",
  questionType: QuestionType.MCQ,
  difficulty: Difficulty.MEDIUM,
  hints: [],
  points: 10,
  explanation: "",
  tags: [],
  status: QuestionStatus.ACTIVE,
  options: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  topicId: "",
};

// ─────────────────────────────────────────────────────────────────────────────

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

export default function QuestionPage() {
  const { questions, isLoading, createQuestion, updateQuestion, deleteQuestion } = useQuestions();
  const { confirm } = useConfirm();

  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>(EMPTY_FORM);

  // ── Sync from query ──
  useEffect(() => {
    (async () => {
      setLoading(isLoading);
      
      setQuestionList(questions ?? []);
    })();
  }, [isLoading]);

  // ── Helpers ──
  const resetForm = () => { setFormData(EMPTY_FORM); setEditing(null); };

  const openCreate = () => { resetForm(); setIsFormOpen(true); };

  const openEdit = (q: Question) => {
    setEditing(q);
    setFormData({
      questionText: q.questionText,
      questionType: q.questionType,
      difficulty: q.difficulty,
      hints: q.hints ?? [],
      points: q.points,
      explanation: q.explanation ?? "",
      tags: q.tags ?? [],
      status: q.status,
      options: q.options ?? [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      topicId: q?.topic?.id ?? "",
    });
    setIsFormOpen(true);
  };

  const handleClose = () => { setIsFormOpen(false); resetForm(); };

  // ── CRUD ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateQuestion.mutate(
        { id: editing.id, data: formData },
        {
          onSuccess: (res: unknown) => {
            toast.success((res as { data : {message: string }}).data?.message ?? "Question updated");
            handleClose();
          },
          onError: (err: unknown) =>
            toast.error((err as { response: { data: { message: string }}})?.response?.data?.message ?? "Failed to update"),
        }
      );
    } else {
      createQuestion.mutate(formData, {
        onSuccess: (res: unknown) => {
          toast.success((res as { data : {message: string }}).data?.message ?? "Question created");
          handleClose();
        },
        onError: (err: unknown) =>
          toast.error((err as { response: { data: { message: string }}})?.response?.data?.message ?? "Failed to create"),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (await confirm("Delete this question? This action cannot be undone.")) {
      deleteQuestion.mutate(id, {
        onSuccess: (res: unknown ) => toast.success((res as { data : {message: string }}).data?.message ?? "Question deleted"),
        onError: (err: unknown) =>
          toast.error((err as { response: { data: { message: string }}})?.response?.data?.message ?? "Failed to delete"),
      });
    }
  };

  // ── Derived stats ──
  const totalQuestions = questionList.length;
  const activeQuestions = questionList.filter((q) => q.status === "ACTIVE").length;
  const archivedQuestions = questionList.filter((q) => q.deletedAt).length;
  const totalPoints = questionList.reduce((sum, q) => sum + (q.points ?? 0), 0);
  const easyCount = questionList.filter((q) => q.difficulty === "EASY").length;
  const mediumCount = questionList.filter((q) => q.difficulty === "MEDIUM").length;
  const hardCount = questionList.filter((q) => q.difficulty === "HARD").length;

  // ── Filter ──
  const filtered = questionList.filter(
    (q) =>
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.explanation ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.topic?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Questions
          </h1>
          <p className="text-sm text-(--color-foreground-muted)">
            Create and manage quiz questions across all topics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setIsBulkImportOpen(true)}
            variant="outline"
            className="gap-2 w-full sm:w-auto justify-center font-semibold"
          >
            <Plus className="h-4 w-4" />
            Bulk Import
          </Button>
          <Button
            onClick={openCreate}
            className="gradient-primary gap-2 w-full sm:w-auto justify-center text-white font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Questions",
            value: totalQuestions,
            icon: <HelpCircle className="h-4 w-4" />,
            color: "hsl(263 70% 58%)",
            bg: "hsl(263 70% 58% / 0.1)",
          },
          {
            label: "Active",
            value: activeQuestions,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: "hsl(142 76% 45%)",
            bg: "hsl(142 76% 45% / 0.1)",
          },
          {
            label: "Total Points",
            value: totalPoints,
            icon: <Star className="h-4 w-4" />,
            color: "hsl(38 92% 50%)",
            bg: "hsl(38 92% 50% / 0.1)",
          },
          {
            label: "Archived",
            value: archivedQuestions,
            icon: <Archive className="h-4 w-4" />,
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
                <p
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Difficulty Breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card className="border-(--glass-border) bg-(--color-background-elevated)">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-(--color-foreground-muted)">
              Difficulty Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Easy", value: easyCount, color: "hsl(142 76% 45%)", bg: "hsl(142 76% 45% / 0.12)" },
                { label: "Medium", value: mediumCount, color: "hsl(38 92% 50%)", bg: "hsl(38 92% 50% / 0.12)" },
                { label: "Hard", value: hardCount, color: "hsl(0 84% 60%)", bg: "hsl(0 84% 60% / 0.12)" },
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
        <QuestionTable
          filteredQuestions={filtered}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleEdit={openEdit}
          handleDelete={handleDelete}
        />
      </motion.div>

      {/* ── Form Modal ── */}
      <QuestionForm
        open={isFormOpen}
        editingQuestion={editing}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        onClose={handleClose}
      />

      {/* ── Bulk Import Form ── */}
      <QuestionBulkImportForm
        bulkQuestions={isBulkImportOpen}
        setBulkQuestions={setIsBulkImportOpen}
      />
    </div>
  );
}