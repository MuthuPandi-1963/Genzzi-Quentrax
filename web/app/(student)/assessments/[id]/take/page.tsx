"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SecureQuizWrapper from "@/components/quiz/SecureQuizWrapper";
import Timer from "@/components/quiz/Timer";
import OptionSelector from "@/components/quiz/OptionSelector";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

// Mock Data
const mockQuestions = [
  { id: "q1", text: "What is the capital of France?", points: 10, options: [{ id: "o1", text: "Paris" }, { id: "o2", text: "London" }, { id: "o3", text: "Berlin" }] },
  { id: "q2", text: "Which element has the chemical symbol 'O'?", points: 5, options: [{ id: "o1", text: "Gold" }, { id: "o2", text: "Oxygen" }, { id: "o3", text: "Osmium" }] },
  { id: "q3", text: "React is a framework.", points: 5, options: [{ id: "o1", text: "True" }, { id: "o2", text: "False" }] },
];

export default function AssessmentTakePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  const currentQ = mockQuestions[currentIndex];

  const handleSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit?")) {
      router.push(`/assessments/123/result`);
    }
  };

  const handleAutoSubmit = () => {
    router.push(`/assessments/123/result`);
  };

  return (
    <SecureQuizWrapper maxViolations={3} onAutoSubmit={handleAutoSubmit}>
      <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0B0A10]">
        
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 shrink-0">
          <div className="font-bold text-lg hidden sm:block">Mid-Term Evaluation</div>
          
          <Timer minutes={30} onExpire={handleAutoSubmit} />
          
          <button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">
            Submit Exam
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
          <div className="w-full max-w-4xl pt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-purple-600 dark:text-purple-400 font-bold tracking-wider text-sm">
                    QUESTION {currentIndex + 1} OF {mockQuestions.length}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                      {currentQ.points} PTS
                    </span>
                    <button 
                      onClick={toggleFlag}
                      className={`p-2 rounded-full transition-colors ${flagged.has(currentQ.id) ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-gray-600'}`}
                    >
                      <Bookmark className="w-5 h-5" fill={flagged.has(currentQ.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
                  {currentQ.text}
                </h2>

                <OptionSelector 
                  options={currentQ.options} 
                  selectedId={answers[currentQ.id] || null} 
                  onChange={handleSelect} 
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button 
                onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              
              <button 
                onClick={() => setCurrentIndex(p => Math.min(mockQuestions.length - 1, p + 1))}
                disabled={currentIndex === mockQuestions.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 disabled:opacity-50"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>

        {/* Bottom Navigator Bar */}
        <footer className="bg-white dark:bg-gray-900 border-t border-black/10 dark:border-white/10 p-4 shrink-0 flex justify-center">
          <div className="flex gap-2 overflow-x-auto max-w-full">
            {mockQuestions.map((q, i) => {
              const isAnswered = !!answers[q.id];
              const isFlagged = flagged.has(q.id);
              const isCurrent = i === currentIndex;
              
              let color = "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500";
              if (isCurrent) color = "bg-purple-100 dark:bg-purple-900/50 border-purple-500 text-purple-700 dark:text-purple-300";
              else if (isFlagged) color = "bg-amber-100 dark:bg-amber-900/50 border-amber-500 text-amber-700 dark:text-amber-300";
              else if (isAnswered) color = "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-700 dark:text-emerald-300";

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-10 h-10 flex-shrink-0 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all hover:scale-105 ${color}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </footer>
      </div>
    </SecureQuizWrapper>
  );
}
