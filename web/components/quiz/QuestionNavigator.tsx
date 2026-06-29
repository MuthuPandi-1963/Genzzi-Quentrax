"use client";

import { motion } from "framer-motion";
import { Flag, CheckCircle2, Circle } from "lucide-react";
import { Question, AnswerState } from "@/@types/Quiz";

interface QuestionNavigatorProps {
  questions: Question[];
  answers: AnswerState;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({ questions, answers, currentIndex, onNavigate }: QuestionNavigatorProps) {
  const getStatusColor = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return "bg-[var(--color-background-sunken)] text-[var(--color-foreground-subtle)] border-[var(--color-border)]";
    if (answer.status === "flagged") return "bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/40";
    if (answer.status === "answered") return "bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/40";
    return "bg-[var(--color-background-sunken)] text-[var(--color-foreground-subtle)] border-[var(--color-border)]";
  };

  const getStatusIcon = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer || answer.status === "unanswered") return <Circle className="w-3 h-3" />;
    if (answer.status === "flagged") return <Flag className="w-3 h-3" />;
    return <CheckCircle2 className="w-3 h-3" />;
  };

  const answeredCount = Object.values(answers).filter((a) => a.status === "answered").length;
  const flaggedCount = Object.values(answers).filter((a) => a.status === "flagged").length;
  const total = questions.length;

  return (
    <div className="glass-card p-4 h-fit sticky top-4">
      <h3 className="text-sm font-bold text-[var(--color-foreground)] mb-3 uppercase tracking-wider">Questions</h3>
      <div className="flex items-center gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)]" />
          <span className="text-[var(--color-foreground-muted)]">{answeredCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-warning)]" />
          <span className="text-[var(--color-foreground-muted)]">{flaggedCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-background-sunken)] border border-[var(--color-border)]" />
          <span className="text-[var(--color-foreground-muted)]">{total - answeredCount - flaggedCount}</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, i) => (
          <motion.button
            key={q.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(i)}
            className={`w-8 h-8 rounded-lg text-xs font-bold border flex items-center justify-center transition-all duration-200 ${currentIndex === i ? "ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-background)]" : ""} ${getStatusColor(q.id)}`}
          >
            {getStatusIcon(q.id)}
          </motion.button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
          <Flag className="w-3.5 h-3.5 text-[var(--color-warning)]" />
          <span>Flagged for review</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
          <Circle className="w-3.5 h-3.5 text-[var(--color-foreground-subtle)]" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}