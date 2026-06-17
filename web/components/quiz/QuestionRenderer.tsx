"use client";

import { motion } from "framer-motion";
import { Type, Code2, ToggleLeft, ListChecks } from "lucide-react";
import { Question, QuestionType, AnswerState } from "@/@types/Quiz";
import McqQuestion from "./McqQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import FillBlankQuestion from "./FillBlankQuestion";
import CodeQuestion from "./CodeQuestion";

interface QuestionRendererProps {
  question: Question;
  answer: AnswerState[string];
  onAnswer: (value: string | string[] | boolean | null) => void;
}

const typeIcons: Record<QuestionType, typeof ListChecks> = {
  MCQ: ListChecks,
  TRUE_FALSE: ToggleLeft,
  FILL_BLANK: Type,
  CODE: Code2,
};

const typeLabels: Record<QuestionType, string> = {
  MCQ: "Multiple Choice",
  TRUE_FALSE: "True / False",
  FILL_BLANK: "Fill in the Blank",
  CODE: "Coding",
};

export default function QuestionRenderer({ question, answer, onAnswer }: QuestionRendererProps) {
  const TypeIcon = typeIcons[question.questionType];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--color-secondary)] text-[var(--color-foreground-muted)] border border-[var(--color-border)]">
            <TypeIcon className="w-3.5 h-3.5" />
            {typeLabels[question.questionType]}
          </span>
          <span className="text-xs text-[var(--color-foreground-muted)]">{question.points} pts</span>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-[var(--color-foreground)] leading-relaxed">
          {question.questionText}
        </h2>
      </div>

      <div>
        {question.questionType === "MCQ" && (
          <McqQuestion question={question} selectedAnswer={answer?.value || null} onAnswer={onAnswer} />
        )}
        {question.questionType === "TRUE_FALSE" && (
          <TrueFalseQuestion selectedAnswer={answer?.value || null} onAnswer={onAnswer} />
        )}
        {question.questionType === "FILL_BLANK" && (
          <FillBlankQuestion selectedAnswer={answer?.value || null} onAnswer={onAnswer} />
        )}
        {question.questionType === "CODE" && (
          <CodeQuestion selectedAnswer={answer?.value || null} onAnswer={onAnswer} />
        )}
      </div>
    </motion.div>
  );
}