import React, { memo } from 'react';
import OptionSelector from "@/components/quiz/OptionSelector";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  points: number;
  options: Option[];
}

interface QuestionRendererProps {
  question: Question;
  selectedAnswerId: string | null;
  onAnswerSelect: (optionId: string) => void;
}

export const QuestionRenderer = memo(({ question, selectedAnswerId, onAnswerSelect }: QuestionRendererProps) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
        {question.text}
      </h2>

      <OptionSelector 
        options={question.options} 
        selectedId={selectedAnswerId} 
        onChange={onAnswerSelect} 
      />
    </div>
  );
});

QuestionRenderer.displayName = 'QuestionRenderer';
