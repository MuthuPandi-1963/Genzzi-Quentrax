"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Plus,
  Trash2,
  Star,
  Tag,
  Lightbulb,
  CheckCircle2,
  X,
  ToggleLeft,
  CaseSensitive,
  AlignLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import { FormFooter, FormHeader, FormShell, SectionHeader } from "./FormParts";
import { useTopics } from "@/hooks";
import { Question, Topic } from "@/@types";
import {
  BooleanType,
  Coding,
  FillBlankOptions,
  LongAnswer,
  MCQOption,
  QuestionFormData,
} from ".";
import { QuestionType } from "@/@types/enums";

// ─────────────────────────────────────────────────────────────────────────────

interface QuestionFormProps {
  open: boolean;
  editingQuestion: Question | null;
  formData: QuestionFormData;
  setFormData: (data: QuestionFormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

const QUESTION_TYPES: { value: QuestionType; label: string; icon: React.ReactNode }[] = [
  { value: QuestionType.MCQ,        label: "Multiple Choice",   icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: QuestionType.TRUE_FALSE, label: "True / False",      icon: <ToggleLeft   className="h-4 w-4" /> },
  { value: QuestionType.FILL_BLANK, label: "Fill in the Blank", icon: <AlignLeft    className="h-4 w-4" /> },
  { value: QuestionType.LONG_ANSWER,label: "Long Answer",       icon: <Tag          className="h-4 w-4" /> },
  { value: QuestionType.CODING,     label: "Coding",            icon: <AlignLeft    className="h-4 w-4" /> },
];

const DIFFICULTIES = [
  { value: "EASY"   as const, label: "Easy"   },
  { value: "MEDIUM" as const, label: "Medium" },
  { value: "HARD"   as const, label: "Hard"   },
];

const STATUSES = [
  { value: "ACTIVE"   as const, label: "Active"   },
  { value: "INACTIVE" as const, label: "Inactive" },
  { value: "DRAFT"    as const, label: "Draft"    },
];

// ─── Type Guards ─────────────────────────────────────────────────────────────

function isMCQOptions(opts: QuestionFormData["options"]): opts is MCQOption[] {
  return Array.isArray(opts) && opts.length > 0 && "isCorrect" in opts[0];
}

function isFillBlankOptions(opts: QuestionFormData["options"]): opts is FillBlankOptions {
  return !Array.isArray(opts) && "acceptedAnswers" in opts;
}

function isBooleanOptions(opts: QuestionFormData["options"]): opts is BooleanType {
  return !Array.isArray(opts) && "answer" in opts && typeof (opts as BooleanType).answer === "boolean";
}

function isLongAnswerOptions(opts: QuestionFormData["options"]): opts is LongAnswer {
  return (
    !Array.isArray(opts) &&
    "text" in opts &&
    !("acceptedAnswers" in opts) &&
    !("answer" in opts)
  );
}

function isCodingOptions(opts: QuestionFormData["options"]): opts is Coding {
  return (
    !Array.isArray(opts) &&
    "text" in opts &&
    !("acceptedAnswers" in opts) &&
    !("answer" in opts)
  );
}

// ─── Default Options Factory ──────────────────────────────────────────────────

function getDefaultOptions(type: QuestionType): QuestionFormData["options"] {
  switch (type) {
    case QuestionType.MCQ:
      return [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ];
    case QuestionType.TRUE_FALSE:
      return { answer: true };
    case QuestionType.FILL_BLANK:
      return { acceptedAnswers: [""], caseSensitive: false };
    case QuestionType.CODING:
      return { text: "" };
    case QuestionType.LONG_ANSWER:
      return { text: "" };
    default:
      return { text: "" };
  }
}

// ─── Shared Select Classes ────────────────────────────────────────────────────

const selectItemClass = `
  rounded-xl
  py-3
  px-3
  cursor-pointer
  transition-all
  text-(--color-foreground)
  hover:bg-[hsl(263_70%_58%/0.1)]
  focus:bg-[hsl(263_70%_58%/0.1)]
  focus:text-(--color-foreground)
  data-[highlighted]:bg-[hsl(263_70%_58%/0.1)]
  data-[highlighted]:text-(--color-foreground)
  data-[state=checked]:bg-[hsl(263_70%_58%)]
  data-[state=checked]:text-white
`;

const selectContentClass = `
  rounded-2xl
  border-(--glass-border)
  bg-(--color-background-elevated)
  shadow-[0_16px_48px_-12px_hsl(263_70%_20%/0.4)]
  p-1.5
`;

// ─────────────────────────────────────────────────────────────────────────────

export default function QuestionForm({
  open,
  editingQuestion,
  formData,
  setFormData,
  handleSubmit,
  onClose,
}: QuestionFormProps) {
  console.log(formData);
  
  const { topics } = useTopics();
  const [tagInput,  setTagInput]  = React.useState("");
  const [hintInput, setHintInput] = React.useState("");

  const set = <K extends keyof QuestionFormData>(key: K, val: QuestionFormData[K]) =>
    setFormData({ ...formData, [key]: val });

  // ── Handle type change → reset options ──
  const handleTypeChange = (type: QuestionType) => {
    setFormData({ ...formData, questionType: type, options: getDefaultOptions(type) });
  };

  // ── Tag management ──
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      set("tags", [...formData.tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    set("tags", formData.tags.filter((t) => t !== tag));
  };

  // ── Hint management ──
  const addHint = () => {
    const trimmed = hintInput.trim();
    if (trimmed) {
      set("hints", [...formData.hints, trimmed]);
      setHintInput("");
    }
  };

  const removeHint = (idx: number) => {
    set("hints", formData.hints.filter((_, i) => i !== idx));
  };

  // ── MCQ Option management ──
  const addMCQOption = () => {
    if (!isMCQOptions(formData.options)) return;
    set("options", [...formData.options, { text: "", isCorrect: false }]);
  };

  const removeMCQOption = (idx: number) => {
    if (!isMCQOptions(formData.options)) return;
    set("options", formData.options.filter((_, i) => i !== idx));
  };

  const updateMCQOptionText = (idx: number, text: string) => {
    if (!isMCQOptions(formData.options)) return;
    const opts = [...formData.options];
    opts[idx] = { ...opts[idx], text };
    set("options", opts);
  };

  const toggleMCQOptionCorrect = (idx: number) => {
    if (!isMCQOptions(formData.options)) return;
    const opts = formData.options.map((o, i) => ({ ...o, isCorrect: i === idx }));
    set("options", opts);
  };

  // ── Fill in Blank management ──
  const addFillBlankAnswer = () => {
    if (!isFillBlankOptions(formData.options)) return;
    set("options", {
      ...formData.options,
      acceptedAnswers: [...formData.options.acceptedAnswers, ""],
    });
  };

  const removeFillBlankAnswer = (idx: number) => {
    if (!isFillBlankOptions(formData.options)) return;
    set("options", {
      ...formData.options,
      acceptedAnswers: formData.options.acceptedAnswers.filter((_, i) => i !== idx),
    });
  };

  const updateFillBlankAnswer = (idx: number, val: string) => {
    if (!isFillBlankOptions(formData.options)) return;
    const answers = [...formData.options.acceptedAnswers];
    answers[idx] = val;
    set("options", { ...formData.options, acceptedAnswers: answers });
  };

  const toggleFillBlankCase = () => {
    if (!isFillBlankOptions(formData.options)) return;
    set("options", { ...formData.options, caseSensitive: !formData.options.caseSensitive });
  };

  // ── Boolean (True/False) management ──
  const setBooleanAnswer = (val: boolean) => {
    if (!isBooleanOptions(formData.options)) return;
    set("options", { answer: val });
  };

  // ── Long Answer / Coding management ──
  const setTextOption = (text: string) => {
    if (isLongAnswerOptions(formData.options) || isCodingOptions(formData.options)) {
      set("options", { text });
    }
  };

  // ── Render Options Section ────────────────────────────────────────────────
  const renderOptionsSection = () => {
    const { questionType } = formData;

    // ── MCQ ──
    if (questionType === QuestionType.MCQ && isMCQOptions(formData.options)) {
      // Capture narrowed reference so TypeScript keeps the type inside JSX callbacks
      const mcqOpts = formData.options;

      return (
        <div className="space-y-4">
          <SectionHeader title="Answer Options" icon={<CheckCircle2 className="h-4 w-4" />} />
          <div className="space-y-2">
            {mcqOpts.map((opt, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-200 ${
                  opt.isCorrect
                    ? "bg-[hsl(142_76%_45%/0.08)] border-[hsl(142_76%_45%/0.3)]"
                    : "bg-background-sunken border-(--glass-border)"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleMCQOptionCorrect(idx)}
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    opt.isCorrect
                      ? "bg-[hsl(142_76%_45%)] text-white shadow-[0_0_12px_hsl(142_76%_45%/0.4)]"
                      : "bg-background-overlay border border-(--glass-border) text-foreground-subtle hover:border-[hsl(142_76%_45%/0.4)]"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </button>

                <Input
                  value={opt.text}
                  onChange={(e) => updateMCQOptionText(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  className="flex-1 bg-transparent border-0 focus-visible:ring-0 px-0 text-(--color-foreground)"
                />

                {/* Use mcqOpts (narrowed) not formData.options */}
                {mcqOpts.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMCQOption(idx)}
                    className="h-8 w-8 p-0 text-foreground-subtle hover:text-(--color-error) hover:bg-[hsl(0_84%_60%/0.1)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMCQOption}
            className="gap-1.5 border-(--glass-border) text-(--color-foreground-muted)
              hover:text-[hsl(263_70%_68%)] hover:border-[hsl(263_70%_58%/0.4)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Option
          </Button>
        </div>
      );
    }

    // ── TRUE_FALSE ──
    if (questionType === QuestionType.TRUE_FALSE && isBooleanOptions(formData.options)) {
      const boolOpts = formData.options; // narrowed

      return (
        <div className="space-y-4">
          <SectionHeader title="Correct Answer" icon={<ToggleLeft className="h-4 w-4" />} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setBooleanAnswer(true)}
              className={`flex-1 p-4 rounded-xl border transition-all duration-200 text-center ${
                boolOpts.answer === true
                  ? "bg-[hsl(142_76%_45%/0.12)] border-[hsl(142_76%_45%/0.4)] text-[hsl(142_76%_65%)] shadow-[0_0_20px_hsl(142_76%_45%/0.15)]"
                  : "bg-background-sunken border-(--glass-border) text-(--color-foreground-muted) hover:border-[hsl(263_70%_58%/0.3)]"
              }`}
            >
              <span className="text-lg font-bold">True</span>
              {boolOpts.answer === true && (
                <CheckCircle2 className="h-4 w-4 mx-auto mt-1 text-[hsl(142_76%_65%)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setBooleanAnswer(false)}
              className={`flex-1 p-4 rounded-xl border transition-all duration-200 text-center ${
                boolOpts.answer === false
                  ? "bg-[hsl(0_84%_60%/0.12)] border-[hsl(0_84%_60%/0.4)] text-[hsl(0_84%_70%)] shadow-[0_0_20px_hsl(0_84%_60%/0.15)]"
                  : "bg-background-sunken border-(--glass-border) text-(--color-foreground-muted) hover:border-[hsl(263_70%_58%/0.3)]"
              }`}
            >
              <span className="text-lg font-bold">False</span>
              {boolOpts.answer === false && (
                <CheckCircle2 className="h-4 w-4 mx-auto mt-1 text-[hsl(0_84%_70%)]" />
              )}
            </button>
          </div>
        </div>
      );
    }

    // ── FILL_BLANK ──
    if (questionType === QuestionType.FILL_BLANK && isFillBlankOptions(formData.options)) {
      const fillOpts = formData.options; // narrowed — fixes TS2339 on .acceptedAnswers

      return (
        <div className="space-y-4">
          <SectionHeader title="Accepted Answers" icon={<CaseSensitive className="h-4 w-4" />} />

          <div className="flex items-center gap-3 p-3 rounded-xl border border-(--glass-border) bg-background-sunken">
            <Switch
              id="case-sensitive"
              checked={fillOpts.caseSensitive}
              onCheckedChange={toggleFillBlankCase}
            />
            <Label
              htmlFor="case-sensitive"
              className="text-sm text-(--color-foreground-muted) cursor-pointer"
            >
              Case sensitive matching
            </Label>
          </div>

          <div className="space-y-2">
            {fillOpts.acceptedAnswers.map((answer, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-medium text-[hsl(263_70%_68%)] shrink-0 w-5">
                  {idx + 1}.
                </span>
                <Input
                  value={answer}
                  onChange={(e) => updateFillBlankAnswer(idx, e.target.value)}
                  placeholder={`Accepted answer ${idx + 1}`}
                  className="flex-1 text-(--color-foreground)"
                />
                {fillOpts.acceptedAnswers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFillBlankAnswer(idx)}
                    className="h-8 w-8 p-0 text-foreground-subtle hover:text-(--color-error)"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFillBlankAnswer}
            className="gap-1.5 border-(--glass-border) text-(--color-foreground-muted)
              hover:text-[hsl(263_70%_68%)] hover:border-[hsl(263_70%_58%/0.4)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Alternative Answer
          </Button>
        </div>
      );
    }

    // ── CODING ──
    if (questionType === QuestionType.CODING) {
      const codingText =
        isCodingOptions(formData.options) || isLongAnswerOptions(formData.options)
          ? formData.options.text
          : "";

      return (
        <div className="space-y-4">
          <SectionHeader title="Coding Answer / Reference" icon={<Tag className="h-4 w-4" />} />
          <Textarea
            placeholder="Enter reference solution or expected output…"
            value={codingText}
            onChange={(e) => setTextOption(e.target.value)}
            rows={4}
            className="text-(--color-foreground) min-h-0 h-auto py-3 resize-none font-mono text-sm"
          />
          <p className="text-xs text-foreground-subtle">
            Provide the reference / model solution for this coding question.
          </p>
        </div>
      );
    }

    // ── LONG_ANSWER ──
    if (questionType === QuestionType.LONG_ANSWER) {
      const longText =
        isLongAnswerOptions(formData.options) || isCodingOptions(formData.options)
          ? formData.options.text
          : "";

      return (
        <div className="space-y-4">
          <SectionHeader title="Model Answer" icon={<AlignLeft className="h-4 w-4" />} />
          <Textarea
            placeholder="Enter the model / reference answer for evaluation…"
            value={longText}
            onChange={(e) => setTextOption(e.target.value)}
            rows={4}
            className="text-(--color-foreground) min-h-0 h-auto py-3 resize-none"
          />
        </div>
      );
    }

    return null;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <FormShell onClose={onClose}>
          <form onSubmit={handleSubmit}>

            {/* ── Header ── */}
            <FormHeader
              title={editingQuestion ? "Edit Question" : "New Question"}
              description={
                editingQuestion ? "Update question details" : "Create a new quiz question"
              }
              icon={<HelpCircle className="h-4 w-4" />}
              onClose={onClose}
            />

            {/* ── Body ── */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* ── Question Details ── */}
              <div className="space-y-4">
                <SectionHeader title="Question Details" icon={<HelpCircle className="h-4 w-4" />} />

                {/* Question Text */}
                <div className="space-y-1.5">
                  <Label htmlFor="q-text" className="text-sm font-medium text-(--color-foreground-muted)">
                    Question Text <span className="text-(--color-error)">*</span>
                  </Label>
                  <Textarea
                    id="q-text"
                    placeholder="Enter your question here…"
                    value={formData.questionText}
                    onChange={(e) => set("questionText", e.target.value)}
                    required
                    rows={3}
                    className="text-(--color-foreground) min-h-0 h-auto py-3 resize-none"
                  />
                </div>

                {/* Question Type */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-(--color-foreground-muted)">
                    Question Type <span className="text-(--color-error)">*</span>
                  </Label>
                  <Select
                    value={formData.questionType}
                    onValueChange={(v) => handleTypeChange(v as QuestionType)}
                  >
                    <SelectTrigger className="glass-input text-(--color-foreground)">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      {QUESTION_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value} className={selectItemClass}>
                          <span className="flex items-center gap-2">
                            {t.icon}
                            {t.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-(--color-foreground-muted)">
                    Topic <span className="text-(--color-error)">*</span>
                  </Label>
                  <Select
                    value={formData.topicId}
                    onValueChange={(v) => set("topicId", v)}
                  >
                    <SelectTrigger className="glass-input text-(--color-foreground)">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      {topics?.map((topic: Topic) => (
                        <SelectItem key={topic.id} value={topic.id} className={selectItemClass}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty & Points */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-(--color-foreground-muted)">
                      Difficulty
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(v) =>
                        set("difficulty", v as QuestionFormData["difficulty"])
                      }
                    >
                      <SelectTrigger className="glass-input text-(--color-foreground)">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d.value} value={d.value} className={selectItemClass}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="q-points" className="text-sm font-medium text-(--color-foreground-muted)">
                      Points
                    </Label>
                    <div className="relative">
                      <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(38_92%_50%)]" />
                      <Input
                        id="q-points"
                        type="number"
                        min={1}
                        max={100}
                        value={formData.points}
                        onChange={(e) => set("points", parseInt(e.target.value) || 0)}
                        className="pl-9 text-(--color-foreground)"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-(--color-foreground-muted)">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      set("status", v as QuestionFormData["status"])
                    }
                  >
                    <SelectTrigger className="glass-input text-(--color-foreground)">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value} className={selectItemClass}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Dynamic Options Section ── */}
              {renderOptionsSection()}

              {/* ── Explanation ── */}
              <div className="space-y-4">
                <SectionHeader title="Explanation" icon={<Lightbulb className="h-4 w-4" />} />
                <Textarea
                  placeholder="Explain the correct answer (shown after submission)…"
                  value={formData.explanation}
                  onChange={(e) => set("explanation", e.target.value)}
                  rows={3}
                  className="text-(--color-foreground) min-h-0 h-auto py-3 resize-none"
                />
              </div>

              {/* ── Hints ── */}
              <div className="space-y-4">
                <SectionHeader title="Hints" icon={<Lightbulb className="h-4 w-4" />} />

                <div className="flex gap-2">
                  <Input
                    value={hintInput}
                    onChange={(e) => setHintInput(e.target.value)}
                    placeholder="Add a hint…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addHint(); }
                    }}
                    className="flex-1 text-(--color-foreground)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHint}
                    className="border-(--glass-border) hover:border-[hsl(263_70%_58%/0.4)]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.hints.length > 0 && (
                  <div className="space-y-1.5">
                    {formData.hints.map((hint, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-lg
                          bg-background-sunken border border-(--glass-border)"
                      >
                        <span className="text-xs font-medium text-[hsl(263_70%_68%)] shrink-0 w-5">
                          {idx + 1}.
                        </span>
                        <span className="text-sm text-(--color-foreground-muted) flex-1">{hint}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHint(idx)}
                          className="h-7 w-7 p-0 text-foreground-subtle hover:text-(--color-error)"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Tags ── */}
              <div className="space-y-4">
                <SectionHeader title="Tags" icon={<Tag className="h-4 w-4" />} />

                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag and press Enter…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addTag(); }
                    }}
                    className="flex-1 text-(--color-foreground)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    className="border-(--glass-border) hover:border-[hsl(263_70%_58%/0.4)]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="gap-1 pr-1.5 border-(--glass-border) text-(--color-foreground-muted)
                          hover:border-[hsl(263_70%_58%/0.4)] transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-0.5 rounded-full hover:bg-[hsl(0_84%_60%/0.15)] hover:text-(--color-error)
                            p-0.5 transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <FormFooter
              isEditing={!!editingQuestion}
              onCancel={onClose}
              submitLabel="Create Question"
              editLabel="Update Question"
            />
          </form>
        </FormShell>
      )}
    </AnimatePresence>
  );
}