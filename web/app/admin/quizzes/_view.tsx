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
  Tag,
  Image,
} from "lucide-react";
import type { Quiz } from "@/@types";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────

interface QuizViewProps {
  quiz: Quiz;
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
    <div className="flex items-start gap-3 p-3 rounded-lg
       border border-(--glass-border)">
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

// ─────────────────────────────────────────────────────────────────────────────

export default function QuizView({ quiz }: QuizViewProps) {
  const tagsCount = quiz.tags?.length ?? 0;

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
          shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.6)]"
      >
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={quiz.status} />
            <Badge
              className="font-semibold text-xs
                bg-[hsl(217_90%_60%/0.12)] text-[hsl(217_90%_70%)]
                border border-[hsl(217_90%_60%/0.3)]"
            >
              {quiz.timeLimit}m
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-(--color-foreground) leading-relaxed">
            {quiz.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-(--color-foreground-muted)">
            Quiz details &amp; metadata
          </DialogDescription>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="px-6 py-4 space-y-3">

          {/* Status & Time Limit */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<BookOpen className="h-4 w-4" />} label="Status">
              <StatusBadge status={quiz.status} />
            </DetailRow>
            <DetailRow icon={<Clock className="h-4 w-4" />} label="Time Limit">
              <span className="font-semibold">{quiz.timeLimit} minutes</span>
            </DetailRow>
          </div>

          {/* Topic */}
          {quiz.topic && (
            <DetailRow icon={<Layers className="h-4 w-4" />} label="Topic">
              <span className="font-medium">{quiz.topic.name}</span>
              {quiz.topic.category && (
                <span className="text-(--color-foreground-muted) ml-1">
                  in {quiz.topic.category.name}
                </span>
              )}
            </DetailRow>
          )}

          {/* Description */}
          <DetailRow icon={<BookOpen className="h-4 w-4" />} label="Description">
            <p className="text-sm leading-relaxed">{quiz.description}</p>
          </DetailRow>

          {/* Tags */}
          {tagsCount > 0 && (
            <DetailRow icon={<Tag className="h-4 w-4" />} label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {quiz.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-(--glass-border) text-(--color-foreground-muted)"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </DetailRow>
          )}

          {/* Cover Image */}
          {quiz.imageUrl && (
            <DetailRow icon={<Image className="h-4 w-4" />} label="Cover Image">
              <div className="mt-1 rounded-lg overflow-hidden border border-(--glass-border) max-w-xs">
                <img
                  src={quiz.imageUrl}
                  alt={quiz.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </DetailRow>
          )}

          {/* Dates row */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Created">
              {new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </DetailRow>
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Updated">
              {new Date(quiz?.updatedAt || "").toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </DetailRow>
          </div>

          {/* ID + copy */}
          <div className="flex items-center justify-between p-3 rounded-lg
            bg-background-sunken border border-(--glass-border)">
            <div className="min-w-0">
              <p className="text-xs font-medium text-(--color-foreground-muted) mb-0.5">
                Quiz ID
              </p>
              <p className="text-xs font-mono text-foreground-subtle truncate max-w-[18rem]">
                {quiz.id}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 ml-3 h-8 w-8 border-(--glass-border)
                hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
                transition-all duration-200"
              onClick={() => {
                navigator.clipboard.writeText(quiz.id);
                toast.success("Quiz ID copied!");
              }}
            >
              <Clipboard className="h-3.5 w-3.5 text-(--color-foreground)" />
            </Button>
          </div>

          {/* Soft-deleted badge */}
          {quiz.deletedAt && (
            <div className="flex items-center gap-2 p-3 rounded-lg
              bg-[hsl(0_84%_60%/0.08)] border border-[hsl(0_84%_60%/0.25)]">
              <span className="h-2 w-2 rounded-full bg-(--color-error)" />
              <p className="text-xs text-(--color-error)">
                Archived on {new Date(quiz.deletedAt).toLocaleDateString()}
              </p>
            </div>
          )}
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