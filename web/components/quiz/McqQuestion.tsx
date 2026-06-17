"use client";

import { motion } from "framer-motion";
import { Question, AnswerValue } from "@/@types/Quiz";

interface McqQuestionProps {
  question: Question;
  selectedAnswer: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
}

export default function McqQuestion({ question, selectedAnswer, onAnswer }: McqQuestionProps) {
  return (
    <div className="space-y-3">
      {question.options?.map((option) => {
        const isSelected = selectedAnswer === option.text;
        return (
          <motion.button
            key={String(option.text)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAnswer(option.text)}
            className={`quiz-option w-full text-left ${isSelected ? "quiz-option-selected" : ""}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)]"}`}>
              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-[var(--color-foreground)]">{option.text}</span>
          </motion.button>
        );
      })}
    </div>
  );
}