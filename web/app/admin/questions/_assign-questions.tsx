"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ListChecks,
  Search,
  CheckCircle2,
  HelpCircle,
  Star,
  Layers,
  X,
  Plus,
  Loader2,
  MinusCircle,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

import type { Question, Quiz } from "@/@types";
import { useQuestions } from "@/hooks";
import { useQuizMutations } from "@/hooks/useQuizzes";

// ─────────────────────────────────────────────────────────────────────────────

interface AssignQuestionsProps {
  quiz: Quiz;
}

type Tab = "available" | "assigned";

// ─────────────────────────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    EASY: {
      bg: "hsl(142 76% 45% / 0.12)",
      text: "hsl(142 76% 65%)",
      border: "hsl(142 76% 45% / 0.3)",
    },
    MEDIUM: {
      bg: "hsl(38 92% 50% / 0.12)",
      text: "hsl(38 92% 65%)",
      border: "hsl(38 92% 50% / 0.3)",
    },
    HARD: {
      bg: "hsl(0 84% 60% / 0.12)",
      text: "hsl(0 84% 70%)",
      border: "hsl(0 84% 60% / 0.3)",
    },
  };
  const c = colors[difficulty] || colors.MEDIUM;
  return (
    <Badge
      className="font-semibold text-xs"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {difficulty}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface QuestionCardProps {
  q: Question;
  isSelected: boolean;
  onToggle: () => void;
  mode: "add" | "remove";
}

function QuestionCard({ q, isSelected, onToggle, mode }: QuestionCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onToggle}
      className={`group flex items-start gap-3 p-3 rounded-xl border cursor-pointer
        transition-all duration-200
        ${isSelected
          ? mode === "add"
            ? "bg-[hsl(142_76%_45%/0.08)] border-[hsl(142_76%_45%/0.3)] shadow-[0_0_20px_hsl(142_76%_45%/0.08)]"
            : "bg-[hsl(0_84%_60%/0.08)] border-[hsl(0_84%_60%/0.3)] shadow-[0_0_20px_hsl(0_84%_60%/0.08)]"
          : "bg-background-sunken border-(--glass-border) hover:border-[hsl(263_70%_58%/0.2)]"
        }`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className={`mt-0.5 shrink-0 ${mode === "remove" && isSelected ? "border-(--color-error) data-[state=checked]:bg-(--color-error)" : ""}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className={`h-3.5 w-3.5 shrink-0 ${isSelected ? (mode === "add" ? "text-[hsl(142_76%_65%)]" : "text-(--color-error)") : "text-foreground-subtle"}`} />
          <span className={`text-sm font-semibold truncate ${isSelected ? "text-(--color-foreground)" : "text-(--color-foreground-muted)"}`}>
            {q.questionText}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <DifficultyBadge difficulty={q.difficulty} />
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-(--glass-border) text-foreground-subtle"
          >
            {q.questionType.replace(/_/g, " ")}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] text-foreground-subtle">
            <Star className="h-3 w-3 text-[hsl(38_92%_50%)]" />
            {q.points} pts
          </div>
          {q.topic && (
            <div className="flex items-center gap-1 text-[10px] text-foreground-subtle">
              <Layers className="h-3 w-3" />
              {q.topic.name}
            </div>
          )}
          {q.tags?.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] px-1 py-0 border-(--glass-border) text-foreground-subtle"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AssignQuestions({ quiz }: AssignQuestionsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const { questions } = useQuestions();
  const { addQuestions, removeQuestions } = useQuizMutations();

  // Assigned question IDs from the quiz
  const assignedIds = useMemo(
    () => new Set(quiz.questions?.map((q) => q.id) ?? []),
    [quiz.questions]
  );

  // All questions data
  const allQuestions = useMemo(() => (questions as Question[] ?? []), [questions]);

  // Available questions (not assigned)
  const availableQuestions = useMemo(() => {
    const list = allQuestions.filter((q) => !assignedIds.has(q.id));
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (item) =>
        item.questionText.toLowerCase().includes(q) ||
        item.topic?.name?.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [allQuestions, assignedIds, searchTerm]);

  // Assigned questions (already in quiz)
  const assignedQuestions = useMemo(() => {
    const list = allQuestions.filter((q) => assignedIds.has(q.id));
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (item) =>
        item.questionText.toLowerCase().includes(q) ||
        item.topic?.name?.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [allQuestions, assignedIds, searchTerm]);

  const currentList = activeTab === "available" ? availableQuestions : assignedQuestions;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === currentList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentList.map((q) => q.id)));
    }
  };

  const handleAdd = () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one question");
      return;
    }

    addQuestions.mutate(
      { quizId: quiz.id, questionIds: Array.from(selectedIds) },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "Questions added to quiz");
          setSelectedIds(new Set());
          setActiveTab("assigned");
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? "Failed to add questions");
        },
      }
    );
  };

  const handleRemove = () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one question to remove");
      return;
    }

    removeQuestions.mutate(
      { quizId: quiz.id, questionIds: Array.from(selectedIds) },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "Questions removed from quiz");
          setSelectedIds(new Set());
          setActiveTab("available");
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? "Failed to remove questions");
        },
      }
    );
  };

  const isPending = addQuestions.isPending || removeQuestions.isPending;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedIds(new Set());
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-(--glass-border)
            hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
            transition-all duration-200"
          title="Manage Questions"
        >
          <ListChecks className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-[90%] min-w-[60%] p-0 gap-0 overflow-hidden rounded-2xl
          border border-(--glass-border-strong) bg-background
          shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.6)]"
      >
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className="font-semibold text-xs
                bg-[hsl(263_70%_58%/0.12)] text-[hsl(263_70%_78%)]
                border border-[hsl(263_70%_58%/0.3)]"
            >
              {quiz.questions?.length ?? 0} questions
            </Badge>
            {selectedIds.size > 0 && (
              <Badge
                className={`font-semibold text-xs
                  ${activeTab === "available"
                    ? "bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)] border border-[hsl(142_76%_45%/0.3)]"
                    : "bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_84%_70%)] border border-[hsl(0_84%_60%/0.3)]"
                  }`}
              >
                {selectedIds.size} selected
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-(--color-foreground)">
            Manage Questions
          </DialogTitle>
          <DialogDescription className="text-sm text-(--color-foreground-muted)">
            Add or remove questions from <span className="font-semibold text-(--color-foreground)">{quiz.title}</span>
          </DialogDescription>
        </DialogHeader>

        {/* ── Tabs ── */}
        <div className="px-6 pt-4">
          <div className="flex p-1 rounded-xl bg-background-sunken border border-(--glass-border)">
            <button
              onClick={() => handleTabChange("available")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === "available"
                  ? "bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)] shadow-sm"
                  : "text-(--color-foreground-muted) hover:text-(--color-foreground)"
                }`}
            >
              <Plus className="h-3.5 w-3.5" />
              Available
              <Badge variant="outline" className="ml-1 text-[10px] border-(--glass-border)">
                {availableQuestions.length}
              </Badge>
            </button>
            <button
              onClick={() => handleTabChange("assigned")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === "assigned"
                  ? "bg-[hsl(263_70%_58%/0.12)] text-[hsl(263_70%_68%)] shadow-sm"
                  : "text-(--color-foreground-muted) hover:text-(--color-foreground)"
                }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Assigned
              <Badge variant="outline" className="ml-1 text-[10px] border-(--glass-border)">
                {assignedQuestions.length}
              </Badge>
            </button>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input
              placeholder="Search questions…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input h-10 pl-9 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-(--color-foreground)"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={currentList.length === 0}
            className="border-(--glass-border) text-(--color-foreground-muted)
              hover:text-(--color-foreground) hover:bg-(--glass-surface-hover)"
          >
            {selectedIds.size === currentList.length && currentList.length > 0 ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Deselect All
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Select All
              </>
            )}
          </Button>
        </div>

        {/* ── Question List ── */}
        <ScrollArea className="px-6 max-h-[45vh]">
          <div className="space-y-2 pb-4">
            <AnimatePresence mode="popLayout">
              {currentList.map((q) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  isSelected={selectedIds.has(q.id)}
                  onToggle={() => toggleSelection(q.id)}
                  mode={activeTab === "available" ? "add" : "remove"}
                />
              ))}
            </AnimatePresence>

            {currentList.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-3 py-12 text-foreground-subtle"
              >
                <div className="p-4 rounded-2xl bg-[hsl(263_70%_58%/0.08)] border border-[hsl(263_70%_58%/0.15)]">
                  <HelpCircle className="h-8 w-8 text-[hsl(263_70%_58%/0.5)]" />
                </div>
                <p className="text-sm font-medium">
                  {searchTerm
                    ? "No questions match your search"
                    : activeTab === "available"
                      ? "All questions are already assigned"
                      : "No questions assigned yet"
                  }
                </p>
                {searchTerm && <p className="text-xs">Try a different keyword</p>}
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-(--glass-border) flex items-center justify-between">
          <span className="text-xs text-(--color-foreground-muted)">
            {availableQuestions.length} available • {assignedQuestions.length} assigned
          </span>
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-(--glass-border) text-(--color-foreground-muted)
                  hover:text-(--color-foreground) hover:bg-(--glass-surface-hover)"
              >
                Close
              </Button>
            </DialogClose>

            {activeTab === "available" ? (
              <Button
                onClick={handleAdd}
                disabled={selectedIds.size === 0 || isPending}
                className="gradient-primary gap-2 text-white font-semibold"
              >
                {addQuestions.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add {selectedIds.size > 0 && `(${selectedIds.size})`}
              </Button>
            ) : (
              <Button
                onClick={handleRemove}
                disabled={selectedIds.size === 0 || isPending}
                className="gap-2 bg-[hsl(0_84%_60%/0.9)] hover:bg-[hsl(0_84%_60%)] text-white font-semibold"
              >
                {removeQuestions.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MinusCircle className="h-4 w-4" />
                )}
                Remove {selectedIds.size > 0 && `(${selectedIds.size})`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}