
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import SecureQuizWrapper from "@/components/quiz/SecureQuizWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
  Timer,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const QuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const quizId = params.id as string;
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || "demo-user";
    }
    return "demo-user";
  });
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const startQuiz = async () => {
      try {
        const response = await fetch("/api/attempts/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, userId }),
        });

        const data = await response.json();
        if (data.success) {
          setQuizData(data.data);
          setTimeRemaining(data.data.duration * 60);
          toast.success("Quiz started!", {
            description: "Good luck! Your time has started.",
          });
        } else {
          toast.error(data.message || "Failed to start quiz");
          router.push("/assessments");
        }
      } catch (error) {
        console.error("Error starting quiz:", error);
        toast.error("Failed to start quiz", {
          description: "Please check your connection and try again.",
        });
        router.push("/assessments");
      }
    };

    if (quizId && userId) {
      startQuiz();
    }
  }, [quizId, userId, router]);

  // Timer
  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitted || !quizData) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        if (prev === 300) {
          // 5 minutes warning
          toast.warning("5 minutes remaining!", {
            description: "Hurry up! Time is running out.",
            icon: <AlertTriangle className="w-4 h-4" />,
            duration: 5000,
          });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted, quizData]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, selectedOption: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));

    // Auto-save answer
    const answerObj = quizData.questions.find((q: any) => q.id === questionId);
    if (answerObj) {
      saveAnswer(answerObj.answerId, selectedOption);
    }
  };

  const saveAnswer = async (answerId: string, selectedOption: any) => {
    try {
      await fetch("/api/attempts/save-answer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: quizData.attemptId,
          userId,
          answerId,
          selectedOption,
        }),
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    const unansweredCount =
      quizData.questions.length - Object.keys(answers).length;

    setIsSubmitted(true);

    // Show loading toast
    const loadingToastId = toast.loading("Submitting your quiz...");

    try {
      const formattedAnswers = quizData.questions.map((q: any) => ({
        questionId: q.id,
        answerId: q.answerId,
        selectedOption: answers[q.id] || null,
      }));

      const response = await fetch("/api/attempts/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: quizData.attemptId,
          userId,
          answers: formattedAnswers,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToastId);

      if (data.success) {
        if (unansweredCount > 0) {
          toast.warning(`${unansweredCount} question(s) left unanswered`, {
            description: "You can review your results now.",
          });
        } else {
          toast.success("Quiz submitted successfully!", {
            description: "Great job completing all questions!",
          });
        }

        if (data.data.resultVisible) {
          setTimeout(() => {
            router.push(`/quiz-results/${quizData.attemptId}`);
          }, 1500);
        } else {
          setTimeout(() => {
            router.push("/assessments");
          }, 1500);
        }
      } else {
        setIsSubmitted(false);
        toast.error(data.message || "Failed to submit quiz");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      setIsSubmitted(false);
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz", {
        description: "Please try again.",
      });
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
        toast("Question unflagged", {
          icon: <Bookmark className="w-4 h-4" />,
        });
      } else {
        newSet.add(questionId);
        toast("Question flagged for review", {
          icon: <BookmarkCheck className="w-4 h-4" />,
        });
      }
      return newSet;
    });
  };

  if (!quizData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Timer className="w-12 h-12 text-[hsl(263,70%,58%)]" />
        </motion.div>
        <p className="text-lg font-medium animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeRemaining < 300;

  return (
    <SecureQuizWrapper
      quizId={quizId}
      userId={userId}
      attemptId={quizData?.attemptId}
    >
      <div
        className={`min-h-screen transition-colors ${
          isDark ? "bg-[hsl(260,50%,4%)]" : "bg-gray-50"
        }`}
      >
        {/* Timer & Progress Bar */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`sticky top-14 z-40 border-b backdrop-blur-xl ${
            isDark
              ? "bg-[hsl(260,50%,4%)]/90 border-white/10"
              : "bg-white/90 border-gray-200 shadow-sm"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/assessments")}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-bold hidden sm:block">
                  {quizData.title || "Quiz"}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  className="flex items-center gap-2"
                  animate={
                    isTimeCritical
                      ? { scale: [1, 1.05, 1] }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 1,
                    repeat: isTimeCritical ? Infinity : 0,
                  }}
                >
                  <Clock
                    className={`w-5 h-5 ${
                      isTimeCritical
                        ? "text-red-500"
                        : isDark
                        ? "text-white/60"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-mono text-lg font-bold ${
                      isTimeCritical
                        ? "text-red-500"
                        : isDark
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </motion.div>

                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {answeredCount}/{quizData.questions.length}
                  </Badge>
                  {flaggedQuestions.size > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 border-orange-200"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      {flaggedQuestions.size}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div
                className={`w-full h-2 rounded-full ${
                  isDark ? "bg-white/10" : "bg-gray-200"
                }`}
              >
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-[hsl(263,70%,58%)] to-[hsl(330,80%,55%)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Q {currentQuestionIndex + 1} of {quizData.questions.length}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(progress)}% complete
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={
                  isDark
                    ? "bg-white/5 backdrop-blur-xl border-white/10"
                    : "bg-white shadow-lg"
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-start gap-3">
                        <span className="text-[hsl(263,70%,58%)] font-bold">
                          Q{currentQuestionIndex + 1}.
                        </span>
                        <span>{currentQuestion.questionText}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge
                          variant="outline"
                          className={
                            isDark ? "border-white/20 text-white/70" : ""
                          }
                        >
                          {currentQuestion.questionType}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={
                            isDark ? "bg-white/10 text-white/70" : ""
                          }
                        >
                          {currentQuestion.marks} marks
                        </Badge>
                        {flaggedQuestions.has(currentQuestion.id) && (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Flag className="w-3 h-3" /> Flagged
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFlag(currentQuestion.id)}
                      className={`ml-4 ${
                        flaggedQuestions.has(currentQuestion.id)
                          ? "bg-orange-50 text-orange-600 border-orange-300 hover:bg-orange-100"
                          : ""
                      }`}
                    >
                      <Flag className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">
                        {flaggedQuestions.has(currentQuestion.id)
                          ? "Flagged"
                          : "Flag"}
                      </span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Options for MCQ */}
                  {currentQuestion.questionType === "MCQ" &&
                    currentQuestion.options && (
                      <div className="space-y-3">
                        {currentQuestion.options.map(
                          (option: string, idx: number) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() =>
                                handleAnswerSelect(
                                  currentQuestion.id,
                                  option
                                )
                              }
                              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                                answers[currentQuestion.id] === option
                                  ? "border-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/10 ring-2 ring-[hsl(263,70%,58%)]/20"
                                  : isDark
                                  ? "border-white/10 hover:border-white/20 hover:bg-white/5"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <motion.div
                                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                    answers[currentQuestion.id] === option
                                      ? "border-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)] text-white"
                                      : isDark
                                      ? "border-white/20 text-white/60"
                                      : "border-gray-300 text-gray-400"
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {answers[currentQuestion.id] === option ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    String.fromCharCode(65 + idx)
                                  )}
                                </motion.div>
                                <span className="font-medium">{option}</span>
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    )}

                  {/* True/False */}
                  {currentQuestion.questionType === "TRUE_FALSE" && (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: true, label: "True", color: "green" },
                        { value: false, label: "False", color: "red" },
                      ].map((item) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() =>
                            handleAnswerSelect(
                              currentQuestion.id,
                              item.value
                            )
                          }
                          className={`p-6 border-2 rounded-xl cursor-pointer text-center transition-all ${
                            answers[currentQuestion.id] === item.value
                              ? item.color === "green"
                                ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                                : "border-red-500 bg-red-50 dark:bg-red-500/10"
                              : isDark
                              ? "border-white/10 hover:border-white/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xl font-bold">{item.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Fill in the Blank */}
                  {currentQuestion.questionType === "FILL_BLANK" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <input
                        type="text"
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) =>
                          handleAnswerSelect(
                            currentQuestion.id,
                            e.target.value
                          )
                        }
                        placeholder="Type your answer here..."
                        className={`w-full p-4 border rounded-xl text-lg transition-all focus:ring-2 focus:ring-[hsl(263,70%,58%)] focus:border-[hsl(263,70%,58%)] ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                            : "border-gray-300 bg-white"
                        }`}
                        autoFocus
                      />
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.max(0, prev - 1)
                        )
                      }
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => {
                        const unansweredCount =
                          quizData.questions.length -
                          Object.keys(answers).length;
                        if (unansweredCount > 0) {
                          toast.warning(
                            `${unansweredCount} question(s) unanswered`,
                            {
                              description:
                                "Are you sure you want to submit?",
                              action: {
                                label: "Submit anyway",
                                onClick: () => handleSubmit(),
                              },
                            }
                          );
                        } else {
                          handleSubmit();
                        }
                      }}
                      disabled={isSubmitted}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Quiz
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(
                            quizData.questions.length - 1,
                            prev + 1
                          )
                        )
                      }
                      disabled={
                        currentQuestionIndex ===
                        quizData.questions.length - 1
                      }
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Question Navigator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className={`mt-6 ${
                isDark
                  ? "bg-white/5 backdrop-blur-xl border-white/10"
                  : "bg-white shadow-lg"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {quizData.questions.map((q: any, idx: number) => (
                    <motion.button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 text-sm rounded-lg border transition-all ${
                        idx === currentQuestionIndex
                          ? "border-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/10 ring-2 ring-[hsl(263,70%,58%)]/20 text-[hsl(263,70%,58%)] font-bold"
                          : answers[q.id]
                          ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                          : isDark
                          ? "border-white/10 hover:border-white/20 text-white/60"
                          : "border-gray-200 hover:border-gray-300"
                      } ${
                        flaggedQuestions.has(q.id)
                          ? "ring-2 ring-orange-300"
                          : ""
                      }`}
                    >
                      {idx + 1}
                    </motion.button>
                  ))}
                </div>
                <div
                  className={`flex flex-wrap items-center gap-4 mt-4 text-xs ${
                    isDark ? "text-white/50" : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-[hsl(263,70%,58%)]/10 border border-[hsl(263,70%,58%)] rounded" />
                    Current
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-50 dark:bg-green-500/10 border border-green-500 rounded" />
                    Answered
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-3 h-3 border rounded ${
                        isDark ? "border-white/10" : "border-gray-200"
                      }`}
                    />
                    Unanswered
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-orange-300 ring-2 ring-orange-200 rounded" />
                    Flagged
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </SecureQuizWrapper>
  );
};

export default QuizPage;