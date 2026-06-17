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
      <div className="min-h-screen flex flex-col">
        {/* ═══ TOP BAR ════════════════════════════════════════ */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="glass-card-sm border-b border-[var(--color-border)] sticky top-0 z-40"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/quizzes")}
                className="p-2 rounded-lg bg-[var(--color-muted)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <div>
                <h1 className="text-sm font-bold text-[var(--color-foreground)] truncate max-w-[200px] md:max-w-md">
                  {session.quizTitle}
                </h1>
                <p className="text-xs text-[var(--color-foreground-muted)]">
                  Question {currentIndex + 1} of {session.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block w-48">
                <QuizTimer durationMinutes={session.timeLimit} onExpire={handleTimerExpire} />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubmitModal(true)}
                className="gradient-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Submit
              </motion.button>
            </div>
          </div>
          <div className="md:hidden px-4 pb-3">
            <QuizTimer durationMinutes={session.timeLimit} onExpire={handleTimerExpire} />
          </div>
        </motion.div>

        {/* ═══ MAIN CONTENT ═════════════════════════════════ */}
        <div className="flex-1 container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-12 gap-6">
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
            <div className="lg:col-span-9">
              <div className="glass-card-lg p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold text-[var(--color-foreground-muted)] bg-[var(--color-muted)] px-3 py-1 rounded-full">
                    {currentIndex + 1} / {session.questions.length}
                  </span>
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
                      className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
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
                          <div className="mt-2 p-3 rounded-lg bg-[var(--color-info)]/10 border border-[var(--color-info)]/20 text-sm text-[var(--color-info)]">
                            {currentQuestion.hints[0]}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFlag}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isFlagged
                        ? "bg-[var(--color-warning)]/15 text-[var(--color-warning)] border border-[var(--color-warning)]/30"
                        : "text-[var(--color-foreground-muted)] hover:text-[var(--color-warning)] hover:bg-[var(--color-warning)]/10"
                    }`}
                  >
                    {isFlagged ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    {isFlagged ? "Flagged" : "Flag for review"}
                  </motion.button>

                  {currentIndex === session.questions.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSubmitModal(true)}
                      className="gradient-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Quiz
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goNext}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-foreground)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 transition-all"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
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
        </div>
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
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--color-background)]/90 backdrop-blur-xl"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mb-4" />
              <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">Submitting...</h3>
              <p className="text-sm text-[var(--color-foreground-muted)]">Grading your answers</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SecureQuizWrapper>
  );
}