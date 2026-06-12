"use client";

import React, { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, CheckCircle2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FillBlankOptions, MCQOption } from ".";
import { Difficulty } from "@/@types/enums";

// ─────────────────────────────────────────────────────────────────────────────
// Tag Input
// ─────────────────────────────────────────────────────────────────────────────

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function TagInput({ tags, onChange, placeholder = "Add tag…", label }: TagInputProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim().toLowerCase();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };

  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !input && tags.length) remove(tags[tags.length - 1]);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium text-(--color-foreground-muted)">{label}</Label>}
      <div
        className="min-h-12 flex flex-wrap gap-1.5 items-center rounded-xl border border-(--glass-border)
          bg-background-sunken px-3 py-2 focus-within:border-[hsl(263_70%_58%/0.5)]
          focus-within:ring-2 focus-within:ring-[hsl(263_70%_58%/0.15)] transition-all duration-200"
      >
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              <Badge
                variant="secondary"
                className="gap-1 pl-2 pr-1 py-0.5 text-xs font-medium
                  bg-[hsl(263_70%_58%/0.15)] text-[hsl(263_70%_78%)] border border-[hsl(263_70%_58%/0.3)]
                  hover:bg-[hsl(263_70%_58%/0.25)] cursor-default"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => remove(tag)}
                  className="ml-0.5 rounded-full hover:text-white transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-32 bg-transparent text-sm outline-none
            text-(--color-foreground) placeholder:text-foreground-subtle"
        />
      </div>
      <p className="text-xs text-foreground-subtle">Press Enter or comma to add</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hints Input  (same UX as TagInput but for hints array)
// ─────────────────────────────────────────────────────────────────────────────

interface HintsInputProps {
  hints: string[];
  onChange: (hints: string[]) => void;
}

export function HintsInput({ hints, onChange }: HintsInputProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val) onChange([...hints, val]);
    setInput("");
  };

  const remove = (i: number) => onChange(hints.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-(--color-foreground-muted)">Hints</Label>
      <div className="space-y-2">
        <AnimatePresence>
          {hints.map((hint, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-2 p-2.5 rounded-lg
                bg-[hsl(38_92%_55%/0.08)] border border-[hsl(38_92%_55%/0.2)]"
            >
              <span className="mt-0.5 text-xs font-bold text-[hsl(38_92%_55%)] shrink-0">#{i + 1}</span>
              <p className="flex-1 text-sm text-(--color-foreground)">{hint}</p>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-foreground-subtle hover:text-(--color-error) transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder="Type a hint and press Enter…"
            className="glass-input h-10 text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={add} className="shrink-0 h-10 px-3 border-(--glass-border)">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MCQ / TRUE_FALSE Option Builder
// ─────────────────────────────────────────────────────────────────────────────

interface OptionBuilderProps {
  options: MCQOption[];
  onChange: (options: MCQOption[]) => void;
  isTrueFalse?: boolean;
}

export function OptionBuilder({ options, onChange, isTrueFalse = false }: OptionBuilderProps) {
  const setCorrect = (idx: number) =>
    onChange(options.map((o, i) => ({ ...o, isCorrect: i === idx })));

  const setText = (idx: number, text: string) =>
    onChange(options.map((o, i) => (i === idx ? { ...o, text } : o)));

  const addOption = () => onChange([...options, { text: "", isCorrect: false }]);
  const removeOption = (idx: number) => onChange(options.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-(--color-foreground-muted)">
        Answer Options
        <span className="ml-2 text-xs text-foreground-subtle">(click circle to mark correct)</span>
      </Label>
      <div className="space-y-2">
        <AnimatePresence>
          {options.map((opt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                ${opt.isCorrect
                  ? "bg-[hsl(142_76%_45%/0.1)] border-[hsl(142_76%_45%/0.4)]"
                  : "bg-(--glass-surface) border-(--glass-border) hover:border-[hsl(263_70%_58%/0.3)]"
                }`}
            >
              <button
                type="button"
                onClick={() => setCorrect(idx)}
                className="shrink-0 transition-transform hover:scale-110"
              >
                {opt.isCorrect
                  ? <CheckCircle2 className="h-5 w-5 text-(--color-success)" />
                  : <Circle className="h-5 w-5 text-foreground-subtle" />
                }
              </button>
              {isTrueFalse ? (
                <span className="flex-1 text-sm font-medium text-(--color-foreground)">{opt.text}</span>
              ) : (
                <input
                  value={opt.text}
                  onChange={(e) => setText(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 bg-transparent text-sm outline-none text-(--color-foreground)
                    placeholder:text-foreground-subtle"
                />
              )}
              {!isTrueFalse && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="shrink-0 text-foreground-subtle hover:text-(--color-error) transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {!isTrueFalse && (
          <button
            type="button"
            onClick={addOption}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm
              border border-dashed border-[hsl(263_70%_58%/0.3)] text-[hsl(263_70%_68%)]
              hover:bg-[hsl(263_70%_58%/0.06)] hover:border-[hsl(263_70%_58%/0.5)] transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> Add option
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fill Blank Options
// ─────────────────────────────────────────────────────────────────────────────

interface FillBlankBuilderProps {
  options: FillBlankOptions;
  onChange: (options: FillBlankOptions) => void;
}

export function FillBlankBuilder({ options, onChange }: FillBlankBuilderProps) {
  const [input, setInput] = useState("");

  const addAnswer = () => {
    const val = input.trim();
    if (val && !options.acceptedAnswers.includes(val))
      onChange({ ...options, acceptedAnswers: [...options.acceptedAnswers, val] });
    setInput("");
  };

  const removeAnswer = (i: number) =>
    onChange({ ...options, acceptedAnswers: options.acceptedAnswers.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-(--color-foreground-muted)">Accepted Answers</Label>
        <div className="flex flex-wrap gap-1.5 min-h-10 items-center p-2.5 rounded-xl
          border border-(--glass-border) bg-background-sunken">
          <AnimatePresence>
            {options.acceptedAnswers.map((ans, i) => (
              <motion.span key={i} initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
                <Badge className="gap-1 bg-[hsl(142_76%_45%/0.15)] text-[hsl(142_76%_65%)] border-[hsl(142_76%_45%/0.3)]">
                  {ans}
                  <button type="button" onClick={() => removeAnswer(i)}>
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAnswer(); } }}
            placeholder="Type answer and press Enter…"
            className="flex-1 min-w-40 bg-transparent text-sm outline-none
              text-(--color-foreground) placeholder:text-foreground-subtle"
          />
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl
        bg-(--glass-surface) border border-(--glass-border)">
        <div>
          <p className="text-sm font-medium text-(--color-foreground)">Case Sensitive</p>
          <p className="text-xs text-foreground-subtle">Require exact capitalisation</p>
        </div>
        <Switch
          checked={options.caseSensitive}
          onCheckedChange={(v) => onChange({ ...options, caseSensitive: v })}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty Selector
// ─────────────────────────────────────────────────────────────────────────────

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (v: Difficulty) => void;
}

const DIFFICULTIES: { value: Difficulty; label: string; color: string; glow: string }[] = [
  { value: Difficulty.EASY,   label: "Easy",   color: "hsl(142 76% 45%)", glow: "hsl(142 76% 45% / 0.3)" },
  { value: Difficulty.MEDIUM, label: "Medium", color: "hsl(38 92% 55%)",  glow: "hsl(38 92% 55% / 0.3)"  },
  { value: Difficulty.HARD,   label: "Hard",   color: "hsl(0 84% 60%)",   glow: "hsl(0 84% 60% / 0.3)"   },
];

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-(--color-foreground-muted)">Difficulty</Label>
      <div className="grid grid-cols-3 gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => onChange(d.value)}
            className={`py-2 rounded-xl text-sm font-semibold border transition-all duration-200
              ${value === d.value
                ? "text-white border-transparent"
                : "text-(--color-foreground-muted) border-(--glass-border) bg-(--glass-surface) hover:border-(--glass-border-strong)"
              }`}
            style={value === d.value
              ? { background: d.color, boxShadow: `0 4px 16px -4px ${d.glow}` }
              : {}
            }
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle Row  (reusable for boolean fields)
// ─────────────────────────────────────────────────────────────────────────────

interface ToggleRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

export function ToggleRow({ id, label, description, checked, onCheckedChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl
      bg-(--glass-surface) border border-(--glass-border)
      hover:bg-(--glass-surface-hover) transition-colors duration-200">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium text-(--color-foreground) cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-foreground-subtle">{description}</p>
        )}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Header  (inside forms)
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-(--glass-border)">
      {icon && (
        <div className="p-2 rounded-lg bg-[hsl(263_70%_58%/0.15)] text-[hsl(263_70%_78%)]">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold text-(--color-foreground)">{title}</h3>
        {description && (
          <p className="text-xs text-foreground-subtle mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Selector  — generic pill toggle for any enum
// ─────────────────────────────────────────────────────────────────────────────

interface StatusOption<T extends string> {
  value: T;
  label: string;
  color?: string;
}

interface StatusSelectorProps<T extends string> {
  label: string;
  value: T;
  options: StatusOption<T>[];
  onChange: (v: T) => void;
}

export function StatusSelector<T extends string>({ label, value, options, onChange }: StatusSelectorProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-(--color-foreground-muted)">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
              ${value === opt.value
                ? "text-white border-transparent bg-(--color-primary) shadow-[0_4px_16px_-4px_hsl(263_70%_58%/0.4)]"
                : "text-(--color-foreground-muted) border-(--glass-border) bg-(--glass-surface) hover:border-(--color-primary)"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Shell  (shared overlay + scroll container)
// ─────────────────────────────────────────────────────────────────────────────

interface FormShellProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function FormShell({ children, onClose }: FormShellProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Scrollable panel */}
      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto
          rounded-2xl border border-(--glass-border-strong)
          bg-(--color-background-elevated)
          shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.7)]"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Header  (sticky top bar)
// ─────────────────────────────────────────────────────────────────────────────

interface FormHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export function FormHeader({ title, description, icon, onClose }: FormHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4
      px-6 py-4 border-b border-(--glass-border)
      bg-(--color-background-elevated)/95 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-[hsl(263_70%_58%/0.15)] text-[hsl(263_70%_78%)]">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-(--color-foreground)">{title}</h2>
          <p className="text-xs text-foreground-subtle">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-lg text-foreground-subtle
          hover:text-(--color-foreground) hover:bg-(--glass-surface-hover) transition-all"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Footer  (sticky bottom action bar)
// ─────────────────────────────────────────────────────────────────────────────

interface FormFooterProps {
  isEditing: boolean;
  onCancel: () => void;
  submitLabel?: string;
  editLabel?: string;
}

export function FormFooter({ isEditing, onCancel, submitLabel = "Create", editLabel = "Update" }: FormFooterProps) {
  return (
    <div className="sticky bottom-0 z-20 flex justify-end gap-3
      px-6 py-4 border-t border-(--glass-border)
      bg-(--color-background-elevated)/95 backdrop-blur-md">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-(--glass-border) text-(--color-foreground-muted)
          hover:text-(--color-foreground) hover:bg-(--glass-surface-hover)"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="gradient-primary px-6 text-white font-semibold"
      >
        {isEditing ? editLabel : submitLabel}
      </Button>
    </div>
  );
}