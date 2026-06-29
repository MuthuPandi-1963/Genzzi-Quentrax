"use client";

import { Code2 } from "lucide-react";
import { AnswerValue } from "@/@types/Quiz";

interface CodeQuestionProps {
  selectedAnswer: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
}

export default function CodeQuestion({ selectedAnswer, onAnswer }: CodeQuestionProps) {
  return (
    <div>
      <div className="relative">
        <Code2 className="absolute left-3 top-3 w-4 h-4 text-[var(--color-foreground-subtle)]" />
        <textarea
          value={(selectedAnswer as string) || ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="// Write your code here..."
          rows={8}
          className="glass-input w-full pl-10 pt-3 font-mono text-sm resize-none"
          spellCheck={false}
        />
      </div>
      <p className="text-xs text-[var(--color-foreground-subtle)] mt-2">
        Your code will be evaluated against test cases.
      </p>
    </div>
  );
}