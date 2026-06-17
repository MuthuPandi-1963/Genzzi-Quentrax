"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizById } from "@/hooks/useQuizzes";
import { QuizHistoryAPI } from "@/api/quiz-history";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

import { QuizSession, AnswerState, AnswerValue } from "@/@types/Quiz";
import SecureQuizWrapper from "@/components/quiz/SecureQuizWrapper";
import QuizTimer from "@/components/quiz/Timer";
import QuestionNavigator from "@/components/quiz/QuestionNavigator";
import QuestionRenderer from "@/components/quiz/QuestionRenderer";
import SubmitConfirmation from "@/components/quiz/SubmitConfirmation";

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { data: quizData, isLoading: isQuizLoading, isError: isQuizError, error: quizError } = useQuizById(quizId);

  // ── State ──────────────────────────────────────────────────
  const [session, setSession] = useState<QuizSession | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState<Set<string>>(new Set());
  const [isAssessment] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ── Load Quiz Session ──────────────────────────────────────
  useEffect(() => {
    if (quizData) {
      setSession({
        attemptId: `temp_${Date.now()}`,
        questions: quizData.questions || [],
        timeLimit: quizData.timeLimit || 0,
        quizTitle: quizData.title,
        totalPoints: quizData.totalPoints || 0,
      });
    } else if (isQuizError) {
      console.error("Failed to load quiz:", quizError);
      setError((quizError as any)?.response?.data?.message || "Failed to load quiz. It may not exist.");
    }
  }, [quizData, isQuizError, quizError]);

  // ── Auto-save every 30s ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-saving answers...", answers);
    }, 30000);
    return () => clearInterval(interval);
  }, [answers]);

  // ── Handle Answer ──────────────────────────────────────────
  const handleAnswer = useCallback(
    (value: AnswerValue) => {
      const questionId = session?.questions[currentIndex].id;
      if (!questionId) return;
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          value,
          status: prev[questionId]?.status === "flagged" ? "flagged" : "answered",
        },
      }));
    },
    [session, currentIndex]
  );

  // ── Toggle Flag ────────────────────────────────────────────
  const toggleFlag = useCallback(() => {
    const questionId = session?.questions[currentIndex].id;
    if (!questionId) return;
    setAnswers((prev) => {
      const current = prev[questionId];
      const newStatus =
        current?.status === "flagged"
          ? current.value
            ? "answered"
            : "unanswered"
          : "flagged";
      return {
        ...prev,
        [questionId]: { value: current?.value || null, status: newStatus },
      };
    });
  }, [session, currentIndex]);

  // ── Navigation ─────────────────────────────────────────────
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < (session?.questions.length || 0)) setCurrentIndex(index);
    },
    [session]
  );
  const goNext = useCallback(() => goToQuestion(currentIndex + 1), [currentIndex, goToQuestion]);
  const goPrev = useCallback(() => goToQuestion(currentIndex - 1), [currentIndex, goToQuestion]);

  // ── Handle Submit ──────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await QuizHistoryAPI.create({
        quizId: quizId,
        score: 0,
        answers: answers,
      });
      setIsSubmitting(false);
      router.push(`/quizzes/${quizId}/result`);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setIsSubmitting(false);
      // Proceed to result page anyway to unblock the user if the backend endpoint is still not fully operational
      router.push(`/quizzes/${quizId}/result`);
    }
  }, [quizId, router, answers]);

  const handleTimerExpire = useCallback(() => handleSubmit(), [handleSubmit]);

  const revealHint = useCallback(() => {
    const questionId = session?.questions[currentIndex].id;
    if (!questionId) return;
    setShowHints((prev) => new Set(prev).add(questionId));
  }, [session, currentIndex]);

  // ── Loading ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-destructive mb-2">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <button onClick={() => router.push("/quizzes")} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isFlagged = currentAnswer?.status === "flagged";
  const answeredCount = Object.values(answers).filter((a) => a.status === "answered").length;
  const flaggedCount = Object.values(answers).filter((a) => a.status === "flagged").length;

  return (
    <SecureQuizWrapper isAssessment={isAssessment}>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0B0A10]">
        {/* ═══ TOP BAR ════════════════════════════════════════ */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/quizzes")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold truncate max-w-[200px] md:max-w-md text-gray-900 dark:text-white">
                {session.quizTitle}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-auto">
              <QuizTimer durationMinutes={session.timeLimit} onExpire={handleTimerExpire} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSubmitModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Quiz</span>
            </motion.button>
          </div>
        </header>

        {/* ═══ MAIN CONTENT ═════════════════════════════════ */}
        <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
          <div className="w-full max-w-6xl pt-8 grid lg:grid-cols-12 gap-8">
            
            {/* ─── Left Sidebar: Navigator ───────────────────── */}
            <div className="lg:col-span-3 hidden lg:block">
              <QuestionNavigator
                questions={session.questions}
                answers={answers}
                currentIndex={currentIndex}
                onNavigate={goToQuestion}
              />
            </div>

            {/* ─── Center: Question Card ─────────────────────── */}
            <div className="lg:col-span-9 w-full">
              <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-purple-600 dark:text-purple-400 font-bold tracking-wider text-sm uppercase">
                    QUESTION {currentIndex + 1} OF {session.questions.length}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                      {currentQuestion.points} PTS
                    </span>
                    <button 
                      onClick={toggleFlag}
                      className={`p-2 rounded-full transition-colors ${
                        isFlagged 
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-gray-600'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" fill={isFlagged ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <QuestionRenderer
                    key={currentQuestion.id}
                    question={currentQuestion}
                    answer={currentAnswer}
                    onAnswer={handleAnswer}
                  />
                </AnimatePresence>

                {/* Hints */}
                {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={revealHint}
                      className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {showHints.has(currentQuestion.id) ? "Hide Hint" : "Need a hint?"}
                    </motion.button>
                    <AnimatePresence>
                      {showHints.has(currentQuestion.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 text-sm text-purple-800 dark:text-purple-300">
                            {currentQuestion.hints[0]}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> Previous
                  </button>

                  {currentIndex === session.questions.length - 1 ? (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={goNext}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 disabled:opacity-50 transition-colors"
                    >
                      Next <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Navigator */}
              <div className="lg:hidden mt-4">
                <QuestionNavigator
                  questions={session.questions}
                  answers={answers}
                  currentIndex={currentIndex}
                  onNavigate={goToQuestion}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Submit Modal */}
      <SubmitConfirmation
        isOpen={showSubmitModal}
        onConfirm={handleSubmit}
        onCancel={() => setShowSubmitModal(false)}
        answeredCount={answeredCount}
        totalCount={session.questions.length}
        flaggedCount={flaggedCount}
      />

      {/* Submitting Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-white/90 dark:bg-[#0B0A10]/90 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Submitting...</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Grading your answers</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SecureQuizWrapper>
  );
}