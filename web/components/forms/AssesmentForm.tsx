"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  CalendarClock,
  Settings2,
  ShieldCheck,
  LayoutList,
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
import type { Assessment, Topic } from "@/@types";
import {
  FormHeader,
  FormFooter,
  SectionHeader,
  ToggleRow,
} from "./FormParts";
import { AssessmentFormData } from ".";

// ─────────────────────────────────────────────────────────────────────────────

interface AssessmentFormProps {
  open: boolean;
  editingAssessment: Assessment | null;
  formData: AssessmentFormData;
  setFormData: (data: AssessmentFormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  topics: Topic[];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AssessmentForm({
  open,
  editingAssessment,
  formData,
  setFormData,
  handleSubmit,
  onClose,
  topics,
}: AssessmentFormProps) {
  const set = <K extends keyof AssessmentFormData>(key: K, val: AssessmentFormData[K]) =>
    setFormData({ ...formData, [key]: val });

  return (
    <AnimatePresence>
      {open && (
        // Wider shell for the dense assessment form
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel — max-w-3xl for assessment */}
          <div
            className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto
              rounded-2xl border border-(--glass-border-strong)]
              bg-(--color-background-elevated)]
              shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.7)]"
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <FormHeader
                title={editingAssessment ? "Edit Assessment" : "New Assessment"}
                description={
                  editingAssessment
                    ? "Update assessment configuration"
                    : "Configure a formal assessment for students"
                }
                icon={<ClipboardList className="h-4 w-4" />}
                onClose={onClose}
              />

              <div className="p-6 space-y-8">

                {/* ── Basic Info ── */}
                <div className="space-y-4">
                  <SectionHeader
                    title="Basic Information"
                    icon={<LayoutList className="h-4 w-4" />}
                  />

                  {/* Title */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="as-title"
                      className="text-sm font-medium text-(--color-foreground-muted)]"
                    >
                      Title <span className="text-(--color-error)]">*</span>
                    </Label>
                    <Input
                      id="as-title"
                      placeholder="e.g. Mid-term Biology Assessment"
                      value={formData.title}
                      onChange={(e) => set("title", e.target.value)}
                      required
                      className="glass-input"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="as-desc"
                      className="text-sm font-medium text-(--color-foreground-muted)]"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="as-desc"
                      placeholder="Instructions or overview for students…"
                      value={formData.description}
                      onChange={(e) => set("description", e.target.value)}
                      rows={3}
                      className="glass-input min-h-0 h-auto py-3 resize-none"
                    />
                  </div>

                  {/* Topic + Status row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Topic */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-(--color-foreground-muted)]">
                        Topic Scope
                      </Label>
                      <Select
                        value={formData.topicId}
                        onValueChange={(v) => set("topicId", v)}
                      >
                        <SelectTrigger className="glass-input h-12">
                          <SelectValue placeholder="All topics" />
                        </SelectTrigger>
                        <SelectContent className="bg-(--color-background-elevated)] border-(--glass-border)]">
                          <SelectItem
                            value=""
                            className="text-(--color-foreground-subtle)] focus:bg-[hsl(263_70%_58%/0.15)]"
                          >
                            No restriction
                          </SelectItem>
                          {topics.map((t) => (
                            <SelectItem
                              key={t.id}
                              value={t.id}
                              className="text-(--color-foreground)] focus:bg-[hsl(263_70%_58%/0.15)]"
                            >
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-(--color-foreground-muted)]">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => set("status", v as AssessmentFormData["status"])}
                      >
                        <SelectTrigger className="glass-input h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-(--color-background-elevated)] border-(--glass-border)]">
                          {(["DRAFT", "SCHEDULED", "ACTIVE", "COMPLETED"] as const).map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="text-(--color-foreground)] focus:bg-[hsl(263_70%_58%/0.15)]"
                            >
                              {s.charAt(0) + s.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* ── Schedule ── */}
                <div className="space-y-4">
                  <SectionHeader
                    title="Schedule & Availability"
                    icon={<CalendarClock className="h-4 w-4" />}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Scheduled At */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="as-scheduled"
                        className="text-sm font-medium text-(--color-foreground-muted)]"
                      >
                        Scheduled At
                      </Label>
                      <Input
                        id="as-scheduled"
                        type="datetime-local"
                        value={formData.scheduledAt}
                        onChange={(e) => set("scheduledAt", e.target.value)}
                        className="glass-input"
                      />
                    </div>

                    {/* Deadline */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="as-deadline"
                        className="text-sm font-medium text-(--color-foreground-muted)]"
                      >
                        Deadline
                      </Label>
                      <Input
                        id="as-deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => set("deadline", e.target.value)}
                        className="glass-input"
                      />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="as-start"
                        className="text-sm font-medium text-(--color-foreground-muted)]"
                      >
                        Available From
                      </Label>
                      <Input
                        id="as-start"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => set("startDate", e.target.value)}
                        className="glass-input"
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="as-end"
                        className="text-sm font-medium text-(--color-foreground-muted)]"
                      >
                        Available Until
                      </Label>
                      <Input
                        id="as-end"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => set("endDate", e.target.value)}
                        className="glass-input"
                      />
                    </div>
                  </div>

                  {/* Time Limit */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-(--color-foreground-muted)]">
                      Time Limit
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={1}
                        placeholder="e.g. 60"
                        value={formData.timeLimit === "" ? "" : formData.timeLimit}
                        onChange={(e) =>
                          set("timeLimit", e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="glass-input w-36"
                      />
                      <span className="text-sm text-(--color-foreground-subtle)]">
                        minutes · leave blank for no limit
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Scoring Config ── */}
                <div className="space-y-4">
                  <SectionHeader
                    title="Scoring"
                    icon={<Settings2 className="h-4 w-4" />}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Passing Score */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="as-pass"
                        className="text-sm font-medium text-(--color-foreground-muted)]"
                      >
                        Passing Score (%)
                      </Label>
                      <Input
                        id="as-pass"
                        type="number"
                        min={0}
                        max={100}
                        value={formData.passingScore}
                        onChange={(e) => set("passingScore", Number(e.target.value))}
                        className="glass-input"
                      />
                    </div>

                    {/* Max Attempts */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="as-attempts"
                        className="text-sm font-medium text-(--color-foreground-muted)]"
                      >
                        Max Attempts
                      </Label>
                      <Input
                        id="as-attempts"
                        type="number"
                        min={1}
                        value={formData.maxAttempts}
                        onChange={(e) => set("maxAttempts", Number(e.target.value))}
                        className="glass-input"
                      />
                    </div>

                    {/* Max Violations */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="as-viol"
                        className="text-sm font-medium text-(--color-foreground-muted)]"
                      >
                        Max Violations
                      </Label>
                      <Input
                        id="as-viol"
                        type="number"
                        min={0}
                        value={formData.maxViolations}
                        onChange={(e) => set("maxViolations", Number(e.target.value))}
                        className="glass-input"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Security / Proctoring ── */}
                <div className="space-y-4">
                  <SectionHeader
                    title="Security & Proctoring"
                    icon={<ShieldCheck className="h-4 w-4" />}
                  />
                  <div className="space-y-2">
                    <ToggleRow
                      id="proctoredMode"
                      label="Proctored Mode"
                      description="Enable screen monitoring and tab-switch detection"
                      checked={formData.proctoredMode}
                      onCheckedChange={(v) => set("proctoredMode", v)}
                    />
                    <ToggleRow
                      id="shuffleQuestions"
                      label="Shuffle Questions"
                      description="Randomise question order per attempt"
                      checked={formData.shuffleQuestions}
                      onCheckedChange={(v) => set("shuffleQuestions", v)}
                    />
                    <ToggleRow
                      id="shuffleOptions"
                      label="Shuffle Options"
                      description="Randomise answer options for each MCQ"
                      checked={formData.shuffleOptions}
                      onCheckedChange={(v) => set("shuffleOptions", v)}
                    />
                  </div>
                </div>

                {/* ── Behaviour ── */}
                <div className="space-y-4">
                  <SectionHeader
                    title="Student Experience"
                    icon={<Settings2 className="h-4 w-4" />}
                  />
                  <div className="space-y-2">
                    <ToggleRow
                      id="allowReview"
                      label="Allow Review"
                      description="Students can revisit questions before submitting"
                      checked={formData.allowReview}
                      onCheckedChange={(v) => set("allowReview", v)}
                    />
                    <ToggleRow
                      id="allowRetry"
                      label="Allow Retry"
                      description="Students can retake up to the max attempts limit"
                      checked={formData.allowRetry}
                      onCheckedChange={(v) => set("allowRetry", v)}
                    />
                    <ToggleRow
                      id="showResultImmediately"
                      label="Show Result Immediately"
                      description="Display score and feedback right after submission"
                      checked={formData.showResultImmediately}
                      onCheckedChange={(v) => set("showResultImmediately", v)}
                    />
                    <ToggleRow
                      id="published"
                      label="Published"
                      description="Make this assessment visible and accessible to students"
                      checked={formData.published}
                      onCheckedChange={(v) => set("published", v)}
                    />
                  </div>
                </div>

              </div>

              {/* Footer */}
              <FormFooter
                isEditing={!!editingAssessment}
                onCancel={onClose}
                submitLabel="Create Assessment"
                editLabel="Update Assessment"
              />
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}