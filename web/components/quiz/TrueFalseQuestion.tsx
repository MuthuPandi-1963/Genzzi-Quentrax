"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { AnswerValue } from "@/@types/Quiz";

interface TrueFalseQuestionProps {
  selectedAnswer: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
}

export default function TrueFalseQuestion({ selectedAnswer, onAnswer }: TrueFalseQuestionProps) {
  return (
    <div className="flex gap-4">
      {[true, false].map((val) => {
        const isSelected = selectedAnswer === val;
        const label = val ? "True" : "False";
        const Icon = val ? CheckCircle2 : Circle;
        return (
          <motion.button
            key={String(val)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(val)}
            className={`flex-1 quiz-option justify-center gap-3 ${isSelected ? "quiz-option-selected" : ""}`}
          >
            <Icon className={`w-5 h-5 ${isSelected ? "text-[var(--color-primary)]" : "text-[var(--color-foreground-muted)]"}`} />
            <span className="font-semibold">{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}