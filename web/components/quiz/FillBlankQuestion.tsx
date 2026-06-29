"use client";

import { AnswerValue } from "@/@types/Quiz";

interface FillBlankQuestionProps {
  selectedAnswer: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
}

export default function FillBlankQuestion({ selectedAnswer, onAnswer }: FillBlankQuestionProps) {
  return (
    <div>
      <input
        type="text"
        value={(selectedAnswer as string) || ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Type your answer here..."
        autoComplete="off"
        className="glass-input w-full py-4 text-base"
      />
      <p className="text-xs text-[var(--color-foreground-subtle)] mt-2">
        Case sensitivity depends on the question settings.
      </p>
    </div>
  );
}