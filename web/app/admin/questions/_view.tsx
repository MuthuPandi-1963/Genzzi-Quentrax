"use client";

import React from "react";
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
import { Eye, Clipboard, HelpCircle, Layers, Calendar, Tag, Star, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";
import type { Question } from "@/@types";
import { toast } from "sonner";
import { MCQOption } from "@/components/forms";

// ─────────────────────────────────────────────────────────────────────────────

interface QuestionViewProps {
  question: Question;
}

// ─────────────────────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg
       border border-(--glass-border)">
      <span className="mt-0.5 text-[hsl(263_70%_68%)] shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-(--color-foreground-muted) mb-0.5">{label}</p>
        <div className="text-sm text-(--color-foreground) wrap-break-word">{children}</div>
      </div>
    </div>
  );
}

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

function QuestionTypeBadge({ type }: { type: string }) {
  return (
    <Badge
      className="font-semibold text-xs
        bg-[hsl(217_90%_60%/0.12)] text-[hsl(217_90%_70%)]
        border border-[hsl(217_90%_60%/0.3)]"
    >
      {type.replace(/_/g, " ")}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function QuestionView({ question }: QuestionViewProps) {
  const hintsCount = question.hints?.length ?? 0;
  const tagsCount = question.tags?.length ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-(--glass-border) hover:bg-(--glass-surface-hover)
            hover:border-[hsl(263_70%_58%/0.4)] transition-all duration-200"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-3xl min-w-[50%] p-0 gap-0 overflow-hidden rounded-2xl
          border border-(--glass-border-strong) bg-background
          shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.6)]"
      >
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <QuestionTypeBadge type={question.questionType} />
            <DifficultyBadge difficulty={question.difficulty} />
            <Badge
              className="font-semibold text-xs
                bg-[hsl(263_70%_58%/0.12)] text-[hsl(263_70%_78%)]
                border border-[hsl(263_70%_58%/0.3)]"
            >
              {question.points} pts
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-(--color-foreground) leading-relaxed">
            {question.questionText}
          </DialogTitle>
          <DialogDescription className="text-sm text-(--color-foreground-muted)">
            Question details &amp; metadata
          </DialogDescription>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="px-6 py-4 space-y-3">

          {/* Question Type & Difficulty row */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<HelpCircle className="h-4 w-4" />} label="Question Type">
              <QuestionTypeBadge type={question.questionType} />
            </DetailRow>
            <DetailRow icon={<Star className="h-4 w-4" />} label="Difficulty">
              <DifficultyBadge difficulty={question.difficulty} />
            </DetailRow>
          </div>

          {/* Points & Status */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<Star className="h-4 w-4" />} label="Points">
              <span className="font-semibold">{question.points}</span>
            </DetailRow>
            <DetailRow icon={<AlertCircle className="h-4 w-4" />} label="Status">
              <Badge
                className={question.status === "ACTIVE"
                  ? "bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)] border border-[hsl(142_76%_45%/0.3)] text-xs"
                  : "bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_84%_70%)] border border-[hsl(0_84%_60%/0.3)] text-xs"
                }
              >
                {question.status}
              </Badge>
            </DetailRow>
          </div>

          {/* Topic */}
          {question.topic && (
            <DetailRow icon={<Layers className="h-4 w-4" />} label="Topic">
              <span className="font-medium">{question.topic.name}</span>
              {question.topic.category && (
                <span className="text-(--color-foreground-muted) ml-1">
                  in {question.topic.category.name}
                </span>
              )}
            </DetailRow>
          )}

          {/* Explanation */}
          {question.explanation && (
            <DetailRow icon={<Lightbulb className="h-4 w-4" />} label="Explanation">
              <p className="text-sm leading-relaxed">{question.explanation}</p>
            </DetailRow>
          )}

          {/* Tags */}
          {tagsCount > 0 && (
            <DetailRow icon={<Tag className="h-4 w-4" />} label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-(--glass-border) text-(--color-foreground-muted)"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </DetailRow>
          )}

          {/* Hints */}
          {hintsCount > 0 && (
            <DetailRow icon={<Lightbulb className="h-4 w-4" />} label={`Hints (${hintsCount})`}>
              <div className="space-y-1.5">
                {question.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-md
                      bg-background-sunken border border-(--glass-border)"
                  >
                    <span className="text-xs font-medium text-[hsl(263_70%_68%)] shrink-0 mt-0.5">
                      {idx + 1}.
                    </span>
                    <span className="text-sm text-(--color-foreground-muted)">{hint}</span>
                  </div>
                ))}
              </div>
            </DetailRow>
          )}

          {/* Options (for MCQ) */}
          {question.questionType == "MCQ" && question.options && (question.options as unknown as MCQOption[])?.length > 0 && (
            <DetailRow icon={<CheckCircle2 className="h-4 w-4" />} label="Options">
              <div className="space-y-1.5">
                {(question.options as unknown as MCQOption[]).map((opt:MCQOption, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      opt.isCorrect
                        ? "bg-[hsl(142_76%_45%/0.08)] border-[hsl(142_76%_45%/0.3)]"
                        : "bg-background-sunken border-(--glass-border)"
                    }`}
                  >
                    <span className={`text-xs font-medium shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      opt.isCorrect
                        ? "bg-[hsl(142_76%_45%/0.2)] text-[hsl(142_76%_65%)]"
                        : "bg-background-overlay text-foreground-subtle"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-sm ${opt.isCorrect ? "font-medium text-(--color-foreground)" : "text-(--color-foreground-muted)"}`}>
                      {opt.text}
                    </span>
                    {opt.isCorrect && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(142_76%_65%)] ml-auto shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </DetailRow>
          )}

          {/* Dates row */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Created">
              {new Date(question.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </DetailRow>
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Updated">
              {new Date(question?.updatedAt || "" ).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </DetailRow>
          </div>

          {/* ID + copy */}
          <div className="flex items-center justify-between p-3 rounded-lg
            bg-background-sunken border border-(--glass-border)">
            <div className="min-w-0">
              <p className="text-xs font-medium text-(--color-foreground-muted) mb-0.5">
                Question ID
              </p>
              <p className="text-xs font-mono text-foreground-subtle truncate max-w-[18rem]">
                {question.id}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 ml-3 h-8 w-8 border-(--glass-border)
                hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
                transition-all duration-200"
              onClick={() => {
                navigator.clipboard.writeText(question.id);
                toast.success("Question ID copied!");
              }}
            >
              <Clipboard className="h-3.5 w-3.5 text-(--color-foreground)" />
            </Button>
          </div>

          {/* Soft-deleted badge */}
          {question.deletedAt && (
            <div className="flex items-center gap-2 p-3 rounded-lg
              bg-[hsl(0_84%_60%/0.08)] border border-[hsl(0_84%_60%/0.25)]">
              <span className="h-2 w-2 rounded-full bg-(--color-error)" />
              <p className="text-xs text-(--color-error)">
                Archived on {new Date(question.deletedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 pt-1 flex justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-(--glass-border) text-(--color-foreground-muted)
                hover:text-(--color-foreground) hover:bg-(--glass-surface-hover)"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}