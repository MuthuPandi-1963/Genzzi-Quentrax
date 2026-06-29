"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import SecureQuizWrapper from "@/components/quiz/SecureQuizWrapper";
import Timer from "@/components/quiz/Timer";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { QuestionRenderer } from "@/components/assessment/QuestionRenderer";
import { useAssessmentQuestions } from "@/hooks/useAssessmentQuestions";

export default function AssessmentTakePage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.id as string || "123";

  const { getByAssessmentId } = useAssessmentQuestions();
  const { data: rawQuestions, isLoading: questionsLoading, isError: questionsError } = getByAssessmentId(assessmentId);

  const questions = React.useMemo(() => {
    if (!rawQuestions) return [];
    return rawQuestions.map((aq: any) => {
      const q = aq.question;
      let mappedOptions: any[] = [];
      if (q && Array.isArray(q.options)) {
        mappedOptions = q.options.map((opt: any, idx: number) => ({
          id: opt.id || `opt_${idx}`,
          text: opt.text || opt.value || (typeof opt === 'string' ? opt : JSON.stringify(opt))
        }));
      }
      return {
        id: q?.id || aq.id,
        text: q?.questionText || "Unknown Question",
        points: aq.pointsOverride ?? q?.points ?? 0,
        options: mappedOptions
      };
    });
  }, [rawQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Initialize from localStorage
  useEffect(() => {
    if (questionsLoading) return;
    try {
      const saved = localStorage.getItem(`assessment_${assessmentId}`);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to restore answers", e);
    }
    setIsLoaded(true);
  }, [assessmentId, questionsLoading]);

  // Debounced auto-save
  const debouncedAnswers = useDebounce(answers, 2000);
  useEffect(() => {
    if (isLoaded && Object.keys(debouncedAnswers).length > 0) {
      localStorage.setItem(`assessment_${assessmentId}`, JSON.stringify(debouncedAnswers));
    }
  }, [debouncedAnswers, assessmentId, isLoaded]);

  const currentQ = questions[currentIndex];

  const handleSelect = useCallback((optionId: string) => {
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
    setErrorMsg("");
  }, [currentQ]);

  const toggleFlag = () => {
    if (!currentQ) return;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const handleAutoSubmit = useCallback(() => {
    router.push(`/student/results/${assessmentId}`);
  }, [router, assessmentId]);

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      setErrorMsg(`You have ${unansweredCount} unanswered question(s). Please complete them before submitting.`);
      return;
    }
    
    if (confirm("Are you sure you want to submit?")) {
      handleAutoSubmit();
    }
  };

  if (!isLoaded || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0A10]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (questionsError || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0A10]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Failed to load assessment questions</h2>
          <p className="text-gray-500 mt-2">No questions found or an error occurred.</p>
          <button onClick={() => router.push('/student/my-assessments')} className="mt-6 text-purple-600 font-bold hover:underline">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-6 py-3 border-b border-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
          <div className="w-full max-w-4xl pt-8">
            <AnimatePresence mode="wait">
              {currentQ && (
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-purple-600 dark:text-purple-400 font-bold tracking-wider text-sm">
                      QUESTION {currentIndex + 1} OF {questions.length}
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

                  <QuestionRenderer 
                    question={currentQ} 
                    selectedAnswerId={answers[currentQ.id] || null} 
                    onAnswerSelect={handleSelect} 
                  />
                </motion.div>
              )}
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
                onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
                disabled={currentIndex === questions.length - 1}
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
            {questions.map((q, i) => {
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
