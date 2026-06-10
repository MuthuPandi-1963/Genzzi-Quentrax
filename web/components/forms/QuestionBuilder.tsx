// app/admin/questions/QuestionForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Plus,
  Minus,
  Loader2,
  Code2,
  ListChecks,
  PenLine,
  ToggleLeft,
  FileText,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface QuestionFormData {
  questionText: string;
  questionType: "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "CODE" | "DESCRIPTION";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  topicId: string;
  status: "active" | "inactive";
  options: Option[];
  correctAnswer: string;
  codeTemplate: string;
  testCases: TestCase[];
  tags: string[];
  hints: string[];
  explanation: string;
}

const questionTypes = [
  { value: "MCQ", label: "Multiple Choice", icon: ListChecks },
  { value: "TRUE_FALSE", label: "True/False", icon: ToggleLeft },
  { value: "FILL_BLANK", label: "Fill in Blank", icon: PenLine },
  { value: "CODE", label: "Code", icon: Code2 },
  { value: "DESCRIPTION", label: "Description", icon: FileText },
];

const difficulties = [
  { value: "easy", label: "Beginner" },
  { value: "medium", label: "Intermediate" },
  { value: "hard", label: "Advanced" },
];

const QuestionForm = ({ question, onClose, topics }: any) => {
  const isEditing = Boolean(question?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<QuestionFormData>({
    questionText: "",
    questionType: "MCQ",
    difficulty: "easy",
    points: 1,
    topicId: "",
    status: "active",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
    correctAnswer: "",
    codeTemplate: "",
    testCases: [{ input: "", expectedOutput: "" }],
    tags: [],
    hints: [],
    explanation: "",
  });

  useEffect(() => {
    if (question?.questionText) {
      setForm({
        questionText: question.questionText || "",
        questionType: question.questionType || "MCQ",
        difficulty: question.difficulty || "easy",
        points: question.points || 1,
        topicId: question.topicId || "",
        status: question.status || "active",
        options: question.options?.length
          ? question.options
          : [
              { text: "", isCorrect: true },
              { text: "", isCorrect: false },
            ],
        correctAnswer: question.correctAnswer || "",
        codeTemplate: question.codeTemplate || "",
        testCases: question.testCases?.length
          ? question.testCases
          : [{ input: "", expectedOutput: "" }],
        tags: question.tags || [],
        hints: question.hints || [],
        explanation: question.explanation || "",
      });
    }
  }, [question]);

  // ─── Options handlers ──────────────────────────────────
  const handleAddOption = () => {
    if (form.options.length < 6) {
      setForm({
        ...form,
        options: [...form.options, { text: "", isCorrect: false }],
      });
    }
  };

  const handleRemoveOption = (idx: number) => {
    if (form.options.length > 2) {
      const newOptions = form.options.filter((_, i) => i !== idx);
      // If removed option was correct, make first option correct
      if (form.options[idx].isCorrect && newOptions.length > 0) {
        newOptions[0].isCorrect = true;
      }
      setForm({ ...form, options: newOptions });
    }
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[idx].text = value;
    setForm({ ...form, options: newOptions });
  };

  const handleCorrectOption = (idx: number) => {
    const newOptions = form.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx,
    }));
    setForm({ ...form, options: newOptions });
  };

  // ─── Test cases handlers ───────────────────────────────
  const handleAddTestCase = () => {
    if (form.testCases.length < 10) {
      setForm({
        ...form,
        testCases: [
          ...form.testCases,
          { input: "", expectedOutput: "" },
        ],
      });
    }
  };

  const handleRemoveTestCase = (idx: number) => {
    if (form.testCases.length > 1) {
      const newTestCases = form.testCases.filter((_, i) => i !== idx);
      setForm({ ...form, testCases: newTestCases });
    }
  };

  const handleTestCaseChange = (
    idx: number,
    field: "input" | "expectedOutput",
    value: string
  ) => {
    const newTestCases = [...form.testCases];
    newTestCases[idx][field] = value;
    setForm({ ...form, testCases: newTestCases });
  };

  // ─── Submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.topicId) {
      toast.error("Please choose a Topic", {
        description: "Select a topic to categorize your question.",
      });
      return;
    }

    if (!form.questionText.trim()) {
      toast.error("Question text is required", {
        description: "Please enter the question content.",
      });
      return;
    }

    // Validate options for MCQ
    if (form.questionType === "MCQ") {
      const filledOptions = form.options.filter((opt) => opt.text.trim());
      if (filledOptions.length < 2) {
        toast.error("At least 2 options are required", {
          description: "MCQ questions need a minimum of 2 options.",
        });
        return;
      }
      if (!form.options.some((opt) => opt.isCorrect && opt.text.trim())) {
        toast.error("Mark a correct option", {
          description: "Please select which option is the correct answer.",
        });
        return;
      }
    }

    // Validate code test cases
    if (form.questionType === "CODE") {
      const filledCases = form.testCases.filter(
        (tc) => tc.input.trim() && tc.expectedOutput.trim()
      );
      if (filledCases.length < 1) {
        toast.error("At least 1 test case required", {
          description: "Code questions need test cases for validation.",
        });
        return;
      }
    }

    const payload = {
      ...form,
      options:
        form.questionType === "MCQ" || form.questionType === "TRUE_FALSE"
          ? form.options
          : undefined,
      correctAnswer:
        form.questionType === "FILL_BLANK"
          ? form.correctAnswer
          : undefined,
      codeTemplate:
        form.questionType === "CODE" ? form.codeTemplate : undefined,
      testCases:
        form.questionType === "CODE" ? form.testCases : undefined,
    };

    setIsSubmitting(true);

    // Show loading toast
    const loadingToastId = toast.loading(
      isEditing ? "Updating question..." : "Creating question..."
    );

    try {
      const url = isEditing
        ? `/api/questions/${question.id}`
        : "/api/questions";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(
        data.message || `Question ${isEditing ? "updated" : "created"} successfully`,
        {
          description: isEditing
            ? "Your changes have been saved."
            : "New question has been added to the database.",
          duration: 4000,
        }
      );
      onClose();
    } catch (error: any) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      toast.error(error.message || "Something went wrong", {
        description: "Please try again or contact support.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const QuestionTypeIcon =
    questionTypes.find((t) => t.value === form.questionType)?.icon || FileText;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[hsl(263,70%,58%)]" />
            {isEditing ? "Edit Question" : "Create New Question"}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="grid gap-4 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question Type Selector */}
          <div className="grid grid-cols-5 gap-2">
            {questionTypes.map((type) => (
              <motion.button
                key={type.value}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setForm({
                    ...form,
                    questionType: type.value as QuestionFormData["questionType"],
                  })
                }
                disabled={isSubmitting}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  form.questionType === type.value
                    ? "border-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)]"
                    : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                }`}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{type.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Question Text */}
          <Textarea
            placeholder="Enter your question..."
            value={form.questionText}
            onChange={(e) =>
              setForm({ ...form, questionText: e.target.value })
            }
            disabled={isSubmitting}
            className="min-h-[80px] text-base"
          />

          {/* Settings Row */}
          <div className="flex gap-3 flex-wrap">
            <Select
              value={form.difficulty}
              onValueChange={(value) =>
                setForm({ ...form, difficulty: value as any })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={form.topicId}
              onValueChange={(value) =>
                setForm({ ...form, topicId: value })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics?.map((t: any) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Points"
              value={form.points}
              onChange={(e) =>
                setForm({
                  ...form,
                  points: parseInt(e.target.value) || 0,
                })
              }
              disabled={isSubmitting}
              className="w-[100px]"
              min={1}
              max={100}
            />

            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({ ...form, status: value as any })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ─── MCQ / TRUE_FALSE Options ────────────────────── */}
          {(form.questionType === "MCQ" ||
            form.questionType === "TRUE_FALSE") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <label className="font-semibold text-sm flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[hsl(263,70%,58%)]" />
                Options
              </label>

              {form.questionType === "TRUE_FALSE" ? (
                // Pre-filled True/False options
                <div className="space-y-2">
                  {["True", "False"].map((text, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
                    >
                      <span className="flex-1 font-medium">{text}</span>
                      <input
                        type="radio"
                        name="correctOption"
                        checked={
                          (idx === 0 && form.options[0]?.isCorrect) ||
                          (idx === 1 && form.options[1]?.isCorrect)
                        }
                        onChange={() => {
                          const newOptions = [
                            { text: "True", isCorrect: idx === 0 },
                            { text: "False", isCorrect: idx === 1 },
                          ];
                          setForm({ ...form, options: newOptions });
                        }}
                        disabled={isSubmitting}
                        className="w-4 h-4 accent-[hsl(263,70%,58%)]"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // MCQ editable options
                <AnimatePresence>
                  {form.options.map((opt, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-2 items-center"
                    >
                      <span className="text-sm font-medium w-6 text-center text-gray-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <Input
                        placeholder={`Option ${idx + 1}`}
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        disabled={isSubmitting}
                        className="flex-1"
                      />
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() => handleCorrectOption(idx)}
                        disabled={isSubmitting}
                        className="w-4 h-4 accent-[hsl(263,70%,58%)]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(idx)}
                        disabled={
                          isSubmitting || form.options.length <= 2
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {form.questionType === "MCQ" && form.options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  disabled={isSubmitting}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              )}
            </motion.div>
          )}

          {/* ─── Fill in Blank ───────────────────────────────── */}
          {form.questionType === "FILL_BLANK" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label className="font-semibold text-sm flex items-center gap-2 mb-2">
                <PenLine className="w-4 h-4 text-[hsl(263,70%,58%)]" />
                Correct Answer
              </label>
              <Input
                placeholder="Enter the correct answer..."
                value={form.correctAnswer}
                onChange={(e) =>
                  setForm({ ...form, correctAnswer: e.target.value })
                }
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-400 mt-1">
                Use ___ in your question text to indicate the blank
              </p>
            </motion.div>
          )}

          {/* ─── Code Question ───────────────────────────────── */}
          {form.questionType === "CODE" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <div>
                <label className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-[hsl(263,70%,58%)]" />
                  Code Template (optional)
                </label>
                <Textarea
                  placeholder="function solution() { // your code here }"
                  value={form.codeTemplate}
                  onChange={(e) =>
                    setForm({ ...form, codeTemplate: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="font-mono text-sm min-h-[100px]"
                />
              </div>

              <div>
                <label className="font-semibold text-sm flex items-center gap-2 mb-2">
                  Test Cases
                </label>
                <AnimatePresence>
                  {form.testCases.map((tc, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-2 gap-2 mb-2 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div>
                        <span className="text-xs text-gray-400">Input</span>
                        <Input
                          placeholder="Input"
                          value={tc.input}
                          onChange={(e) =>
                            handleTestCaseChange(
                              idx,
                              "input",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">
                          Expected Output
                        </span>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Expected"
                            value={tc.expectedOutput}
                            onChange={(e) =>
                              handleTestCaseChange(
                                idx,
                                "expectedOutput",
                                e.target.value
                              )
                            }
                            disabled={isSubmitting}
                            className="font-mono text-sm flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTestCase(idx)}
                            disabled={
                              isSubmitting || form.testCases.length <= 1
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {form.testCases.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTestCase}
                    disabled={isSubmitting}
                    className="w-full border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Test Case
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── Description Question ────────────────────────── */}
          {form.questionType === "DESCRIPTION" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            >
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description questions require manual review. No auto-grading
                available.
              </p>
            </motion.div>
          )}

          {/* Explanation */}
          <div>
            <label className="font-semibold text-sm mb-2 block">
              Explanation (optional)
            </label>
            <Textarea
              placeholder="Explain the answer..."
              value={form.explanation}
              onChange={(e) =>
                setForm({ ...form, explanation: e.target.value })
              }
              disabled={isSubmitting}
              className="min-h-[80px]"
            />
          </div>

          {/* Tags & Hints */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-sm mb-2 block">
                Tags (comma separated)
              </label>
              <Input
                placeholder="react, javascript, hooks"
                value={form.tags.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="font-semibold text-sm mb-2 block">
                Hints (comma separated)
              </label>
              <Input
                placeholder="Think about..., Consider..."
                value={form.hints.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hints: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>
        </motion.div>

        <DialogFooter className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gradient-primary"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Question"
              : "Create Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionForm;