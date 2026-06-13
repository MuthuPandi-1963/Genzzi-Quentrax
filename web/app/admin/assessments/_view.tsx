/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Clipboard,
  BookOpen,
  Clock,
  Layers,
  Calendar,
  Shield,
  RotateCcw,
  CheckCircle,
  Users,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import type { Assessment } from "@/@types/assessment.types";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────

interface AssessmentViewProps {
  assessment: Assessment;
}

// ─────────────────────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-(--glass-border)">
      <span className="mt-0.5 text-[hsl(263_70%_68%)] shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-(--color-foreground-muted) mb-0.5">{label}</p>
        <div className="text-sm text-(--color-foreground) wrap-break-word">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    ACTIVE: {
      bg: "hsl(142 76% 45% / 0.12)",
      text: "hsl(142 76% 65%)",
      border: "hsl(142 76% 45% / 0.3)",
    },
    INACTIVE: {
      bg: "hsl(0 84% 60% / 0.12)",
      text: "hsl(0 84% 70%)",
      border: "hsl(0 84% 60% / 0.3)",
    },
    DRAFT: {
      bg: "hsl(38 92% 50% / 0.12)",
      text: "hsl(38 92% 65%)",
      border: "hsl(38 92% 50% / 0.3)",
    },
    COMPLETED: {
      bg: "hsl(217 90% 60% / 0.12)",
      text: "hsl(217 90% 70%)",
      border: "hsl(217 90% 60% / 0.3)",
    },
  };
  const c = colors[status] || colors.DRAFT;
  return (
    <Badge
      className="font-semibold text-xs"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {status}
    </Badge>
  );
}

function BooleanBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs ${value ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}
    >
      {value ? "Enabled" : "Disabled"} — {label}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AssessmentView({ assessment }: AssessmentViewProps) {
  const assignmentsCount = assessment.assignments?.length ?? 0;
  const attemptsCount = assessment.attempts?.length ?? 0;
  const questionsCount = assessment.assessmentQuestions?.length ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-(--glass-border) hover:bg-(--glass-surface-hover)
            hover:border-[hsl(263_70%_58%/0.4)] transition-all duration-200"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-3xl min-w-[50%] p-0 gap-0 overflow-hidden rounded-2xl
          border border-(--glass-border-strong) bg-background
          shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.6)] max-h-[90vh] overflow-y-auto"
      >
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={assessment.status} />
            <Badge
              className={`font-semibold text-xs ${
                assessment.published
                  ? "bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)] border border-[hsl(142_76%_45%/0.3)]"
                  : "bg-[hsl(38_92%_50%/0.12)] text-[hsl(38_92%_65%)] border border-[hsl(38_92%_50%/0.3)]"
              }`}
            >
              {assessment.published ? "Published" : "Unpublished"}
            </Badge>
            {assessment.timeLimit && (
              <Badge
                className="font-semibold text-xs
                  bg-[hsl(217_90%_60%/0.12)] text-[hsl(217_90%_70%)]
                  border border-[hsl(217_90%_60%/0.3)]"
              >
                {assessment.timeLimit}m
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-(--color-foreground) leading-relaxed">
            {assessment.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-(--color-foreground-muted)">
            Assessment details &amp; configuration
          </DialogDescription>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="px-6 py-4 space-y-3">

          {/* Status & Published */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<BookOpen className="h-4 w-4" />} label="Status">
              <StatusBadge status={assessment.status} />
            </DetailRow>
            <DetailRow icon={<CheckCircle className="h-4 w-4" />} label="Published">
              <span className="font-semibold">{assessment.published ? "Yes" : "No"}</span>
            </DetailRow>
          </div>

          {/* Topic */}
          {assessment.topic && (
            <DetailRow icon={<Layers className="h-4 w-4" />} label="Topic">
              <span className="font-medium">{assessment.topic.name}</span>
            </DetailRow>
          )}

          {/* Description */}
          {assessment.description && (
            <DetailRow icon={<BookOpen className="h-4 w-4" />} label="Description">
              <p className="text-sm leading-relaxed">{assessment.description}</p>
            </DetailRow>
          )}

          {/* Time & Scheduling */}
          <div className="grid grid-cols-2 gap-3">
            {assessment.timeLimit && (
              <DetailRow icon={<Clock className="h-4 w-4" />} label="Time Limit">
                <span className="font-semibold">{assessment.timeLimit} minutes</span>
              </DetailRow>
            )}
            {assessment.deadline && (
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Deadline">
                {new Date(assessment.deadline).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </DetailRow>
            )}
          </div>

          {/* Date Range */}
          {(assessment.startDate || assessment.endDate) && (
            <div className="grid grid-cols-2 gap-3">
              {assessment.startDate && (
                <DetailRow icon={<Calendar className="h-4 w-4" />} label="Start Date">
                  {new Date(assessment.startDate).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </DetailRow>
              )}
              {assessment.endDate && (
                <DetailRow icon={<Calendar className="h-4 w-4" />} label="End Date">
                  {new Date(assessment.endDate).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </DetailRow>
              )}
            </div>
          )}

          {/* Scoring & Attempts */}
          <div className="grid grid-cols-3 gap-3">
            <DetailRow icon={<BarChart3 className="h-4 w-4" />} label="Passing Score">
              <span className="font-semibold">{assessment.passingScore}%</span>
            </DetailRow>
            <DetailRow icon={<RotateCcw className="h-4 w-4" />} label="Max Attempts">
              <span className="font-semibold">{assessment.maxAttempts}</span>
            </DetailRow>
            <DetailRow icon={<AlertTriangle className="h-4 w-4" />} label="Max Violations">
              <span className="font-semibold">{assessment.maxViolations}</span>
            </DetailRow>
          </div>

          {/* Configuration Toggles */}
          <DetailRow icon={<Shield className="h-4 w-4" />} label="Configuration">
            <div className="flex flex-wrap gap-1.5">
              <BooleanBadge value={assessment.proctoredMode} label="Proctored" />
              <BooleanBadge value={assessment.shuffleQuestions} label="Shuffle Qs" />
              <BooleanBadge value={assessment.shuffleOptions} label="Shuffle Opts" />
              <BooleanBadge value={assessment.allowReview} label="Review" />
              <BooleanBadge value={assessment.allowRetry} label="Retry" />
              <BooleanBadge value={assessment.showResultImmediately} label="Instant Results" />
            </div>
          </DetailRow>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <DetailRow icon={<BookOpen className="h-4 w-4" />} label="Questions">
              <span className="font-semibold">{questionsCount}</span>
            </DetailRow>
            <DetailRow icon={<Users className="h-4 w-4" />} label="Assignments">
              <span className="font-semibold">{assignmentsCount}</span>
            </DetailRow>
            <DetailRow icon={<BarChart3 className="h-4 w-4" />} label="Attempts">
              <span className="font-semibold">{attemptsCount}</span>
            </DetailRow>
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Created">
              {new Date(assessment.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </DetailRow>
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Updated">
              {new Date(assessment.updatedAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </DetailRow>
          </div>

          {/* ID + copy */}
          <div className="flex items-center justify-between p-3 rounded-lg
            bg-background-sunken border border-(--glass-border)">
            <div className="min-w-0">
              <p className="text-xs font-medium text-(--color-foreground-muted) mb-0.5">
                Assessment ID
              </p>
              <p className="text-xs font-mono text-foreground-subtle truncate max-w-[18rem]">
                {assessment.id}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 ml-3 h-8 w-8 border-(--glass-border)
                hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
                transition-all duration-200"
              onClick={() => {
                navigator.clipboard.writeText(assessment.id);
                toast.success("Assessment ID copied!");
              }}
            >
              <Clipboard className="h-3.5 w-3.5 text-(--color-foreground)" />
            </Button>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 pt-1 flex justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-(--glass-border) text-(--color-foreground-muted)
                hover:text-(--color-foreground) hover:bg-(--glass-surface-hover)"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
