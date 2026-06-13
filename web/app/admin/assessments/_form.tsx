"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Shield,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  Calendar,
  Layers,
  Eye,
  RefreshCw,
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

import { FormFooter, FormHeader, FormShell, SectionHeader } from "@/components/forms/FormParts";
import { useTopics } from "@/hooks";
import type { Topic } from "@/@types";
import { Assessment, AssessmentFormData } from "@/@types/assessment.types";
import { AssessmentStatus } from "@/@types/enums";

// ─────────────────────────────────────────────────────────────────────────────

interface AssessmentFormProps {
  open: boolean;
  editingAssessment: Assessment | null;
  formData: AssessmentFormData;
  setFormData: (data: AssessmentFormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

const STATUSES = [
  { value: AssessmentStatus.ACTIVE, label: "Active" },
  { value: AssessmentStatus.INACTIVE, label: "Inactive" },
  { value: AssessmentStatus.DRAFT, label: "Draft" },
  { value: AssessmentStatus.COMPLETED, label: "Completed" },
];

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

export default function AssessmentForm({
  open,
  editingAssessment,
  formData,
  setFormData,
  handleSubmit,
  onClose,
}: AssessmentFormProps) {
  const { topics } = useTopics();

  const set = <K extends keyof AssessmentFormData>(key: K, val: AssessmentFormData[K]) =>
    setFormData({ ...formData, [key]: val });

  const toggle = (key: keyof AssessmentFormData) =>
    setFormData({ ...formData, [key]: !formData[key] });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <FormShell onClose={onClose}>
          <form onSubmit={handleSubmit}>

            {/* ── Header ── */}
            <FormHeader
              title={editingAssessment ? "Edit Assessment" : "New Assessment"}
              description={
                editingAssessment ? "Update assessment details" : "Create a new assessment"
              }
              icon={<BookOpen className="h-4 w-4" />}
              onClose={onClose}
            />

            {/* ── Body ── */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* ── Basic Details ── */}
              <div className="space-y-4">
                <SectionHeader title="Basic Details" icon={<BookOpen className="h-4 w-4" />} />

                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="a-title" className="text-sm font-medium text-(--color-foreground-muted)">
                    Title <span className="text-(--color-error)">*</span>
                  </Label>
                  <Input
                    id="a-title"
                    placeholder="Enter assessment title…"
                    value={formData.title}
                    onChange={(e) => set("title", e.target.value)}
                    required
                    className="text-(--color-foreground)"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="a-desc" className="text-sm font-medium text-(--color-foreground-muted)">
                    Description
                  </Label>
                  <Textarea
                    id="a-desc"
                    placeholder="Enter assessment description…"
                    value={formData.description ?? ""}
                    onChange={(e) => set("description", e.target.value)}
                    rows={3}
                    className="text-(--color-foreground) min-h-0 h-auto py-3 resize-none"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-(--color-foreground-muted)">
                    Status <span className="text-(--color-error)">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => set("status", v as AssessmentStatus)}
                  >
                    <SelectTrigger className="glass-input text-(--color-foreground)">
                      <SelectValue placeholder="Select status" />
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

                {/* Topic */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-(--color-foreground-muted)">
                    Topic <span className="text-(--color-error)">*</span>
                  </Label>
                  <Select
                    value={formData.topicId ?? ""}
                    onValueChange={(v) => set("topicId", v || null)}
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
              </div>

              {/* ── Scheduling ── */}
              <div className="space-y-4">
                <SectionHeader title="Scheduling" icon={<Calendar className="h-4 w-4" />} />

                <div className="grid grid-cols-2 gap-3">
                  {/* Deadline */}
                  <div className="space-y-1.5">
                    <Label htmlFor="a-deadline" className="text-sm font-medium text-(--color-foreground-muted)">
                      Deadline
                    </Label>
                    <Input
                      id="a-deadline"
                      type="datetime-local"
                      value={formData.deadline ?? ""}
                      onChange={(e) => set("deadline", e.target.value || null)}
                      className="text-(--color-foreground)"
                    />
                  </div>

                  {/* Scheduled At */}
                  <div className="space-y-1.5">
                    <Label htmlFor="a-scheduled" className="text-sm font-medium text-(--color-foreground-muted)">
                      Scheduled At
                    </Label>
                    <Input
                      id="a-scheduled"
                      type="datetime-local"
                      value={formData.scheduledAt ?? ""}
                      onChange={(e) => set("scheduledAt", e.target.value || null)}
                      className="text-(--color-foreground)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="a-start" className="text-sm font-medium text-(--color-foreground-muted)">
                      Start Date
                    </Label>
                    <Input
                      id="a-start"
                      type="date"
                      value={formData.startDate ?? ""}
                      onChange={(e) => set("startDate", e.target.value || null)}
                      className="text-(--color-foreground)"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="a-end" className="text-sm font-medium text-(--color-foreground-muted)">
                      End Date
                    </Label>
                    <Input
                      id="a-end"
                      type="date"
                      value={formData.endDate ?? ""}
                      onChange={(e) => set("endDate", e.target.value || null)}
                      className="text-(--color-foreground)"
                    />
                  </div>
                </div>

                {/* Time Limit */}
                <div className="space-y-1.5">
                  <Label htmlFor="a-time" className="text-sm font-medium text-(--color-foreground-muted)">
                    Time Limit (minutes)
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(217_90%_60%)]" />
                    <Input
                      id="a-time"
                      type="number"
                      min={1}
                      max={300}
                      value={formData.timeLimit ?? ""}
                      onChange={(e) => set("timeLimit", e.target.value ? parseInt(e.target.value) : null)}
                      className="pl-9 text-(--color-foreground)"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>

              {/* ── Scoring & Limits ── */}
              <div className="space-y-4">
                <SectionHeader title="Scoring & Limits" icon={<BarChart3 className="h-4 w-4" />} />

                <div className="grid grid-cols-3 gap-3">
                  {/* Passing Score */}
                  <div className="space-y-1.5">
                    <Label htmlFor="a-passing" className="text-sm font-medium text-(--color-foreground-muted)">
                      Passing Score (%)
                    </Label>
                    <Input
                      id="a-passing"
                      type="number"
                      min={0}
                      max={100}
                      value={formData.passingScore ?? 50}
                      onChange={(e) => set("passingScore", parseInt(e.target.value) || 0)}
                      className="text-(--color-foreground)"
                    />
                  </div>

                  {/* Max Attempts */}
                  <div className="space-y-1.5">
                    <Label htmlFor="a-attempts" className="text-sm font-medium text-(--color-foreground-muted)">
                      Max Attempts
                    </Label>
                    <div className="relative">
                      <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(263_70%_68%)]" />
                      <Input
                        id="a-attempts"
                        type="number"
                        min={1}
                        value={formData.maxAttempts ?? 1}
                        onChange={(e) => set("maxAttempts", parseInt(e.target.value) || 1)}
                        className="pl-9 text-(--color-foreground)"
                      />
                    </div>
                  </div>

                  {/* Max Violations */}
                  <div className="space-y-1.5">
                    <Label htmlFor="a-violations" className="text-sm font-medium text-(--color-foreground-muted)">
                      Max Violations
                    </Label>
                    <div className="relative">
                      <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(0_84%_60%)]" />
                      <Input
                        id="a-violations"
                        type="number"
                        min={0}
                        value={formData.maxViolations ?? 3}
                        onChange={(e) => set("maxViolations", parseInt(e.target.value) || 0)}
                        className="pl-9 text-(--color-foreground)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Configuration Toggles ── */}
              <div className="space-y-4">
                <SectionHeader title="Configuration" icon={<Shield className="h-4 w-4" />} />

                <div className="grid grid-cols-2 gap-4">
                  {/* Published */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-(--glass-border)">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(142_76%_45%)]" />
                      <div>
                        <p className="text-sm font-medium text-(--color-foreground)">Published</p>
                        <p className="text-xs text-(--color-foreground-muted)">Make visible to users</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.published ?? false}
                      onCheckedChange={(v) => set("published", v)}
                    />
                  </div>

                  {/* Proctored Mode */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-(--glass-border)">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[hsl(263_70%_68%)]" />
                      <div>
                        <p className="text-sm font-medium text-(--color-foreground)">Proctored Mode</p>
                        <p className="text-xs text-(--color-foreground-muted)">Enable anti-cheating</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.proctoredMode ?? false}
                      onCheckedChange={(v) => set("proctoredMode", v)}
                    />
                  </div>

                  {/* Shuffle Questions */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-(--glass-border)">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-[hsl(217_90%_60%)]" />
                      <div>
                        <p className="text-sm font-medium text-(--color-foreground)">Shuffle Questions</p>
                        <p className="text-xs text-(--color-foreground-muted)">Randomize question order</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.shuffleQuestions ?? false}
                      onCheckedChange={(v) => set("shuffleQuestions", v)}
                    />
                  </div>

                  {/* Shuffle Options */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-(--glass-border)">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[hsl(38_92%_50%)]" />
                      <div>
                        <p className="text-sm font-medium text-(--color-foreground)">Shuffle Options</p>
                        <p className="text-xs text-(--color-foreground-muted)">Randomize answer choices</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.shuffleOptions ?? false}
                      onCheckedChange={(v) => set("shuffleOptions", v)}
                    />
                  </div>

                  {/* Allow Review */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-(--glass-border)">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[hsl(263_70%_68%)]" />
                      <div>
                        <p className="text-sm font-medium text-(--color-foreground)">Allow Review</p>
                        <p className="text-xs text-(--color-foreground-muted)">Let users review answers</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.allowReview ?? true}
                      onCheckedChange={(v) => set("allowReview", v)}
                    />
                  </div>

                  {/* Allow Retry */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-(--glass-border)">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-[hsl(142_76%_45%)]" />
                      <div>
                        <p className="text-sm font-medium text-(--color-foreground)">Allow Retry</p>
                        <p className="text-xs text-(--color-foreground-muted)">Enable re-attempts</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.allowRetry ?? true}
                      onCheckedChange={(v) => set("allowRetry", v)}
                    />
                  </div>

                  {/* Show Result Immediately */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-(--glass-border) col-span-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[hsl(217_90%_60%)]" />
                      <div>
                        <p className="text-sm font-medium text-(--color-foreground)">Show Result Immediately</p>
                        <p className="text-xs text-(--color-foreground-muted)">Display score right after submission</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.showResultImmediately ?? true}
                      onCheckedChange={(v) => set("showResultImmediately", v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <FormFooter
              isEditing={!!editingAssessment}
              onCancel={onClose}
              submitLabel="Create Assessment"
              editLabel="Update Assessment"
            />
          </form>
        </FormShell>
      )}
    </AnimatePresence>
  );
}
