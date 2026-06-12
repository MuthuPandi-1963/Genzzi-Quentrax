/* eslint-disable @next/next/no-img-element */
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
import { Eye, Clipboard, BookOpen, Calendar, Tag, BarChart3, Layers } from "lucide-react";
import type { Topic } from "@/@types";
import { toast } from "sonner";
import { Difficulty } from "@/@types/enums";

// ─────────────────────────────────────────────────────────────────────────────

interface TopicViewProps {
    topic: Topic;
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
        <div className="flex items-start gap-3 p-3 rounded border border-glass-border)]">
            <span className="mt-0.5 text-[hsl(263_70%_68%)] shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="text-xs font-medium text-foreground-muted mb-0.5">{label}</p>
                <div className="text-sm text-foreground break-word">{children}</div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TopicView({ topic }: TopicViewProps) {
    const difficultyConfig = {
        EASY: {
            color: "hsl(142 76% 45%)",
            bg: "hsl(142 76% 45% / 0.12)",
            label: "Easy",
        },
        MEDIUM: {
            color: "hsl(217 90% 60%)",
            bg: "hsl(217 90% 60% / 0.12)",
            label: "Medium",
        },
        HARD: {
            color: "hsl(330 80% 55%)",
            bg: "hsl(330 80% 55% / 0.12)",
            label: "Hard",
        },
    } satisfies Record<Difficulty, {
        color: string;
        bg: string;
        label: string;
    }>;

    const difficulty = difficultyConfig[topic.difficulty];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-glass-border)] hover:bg-glass-surface-hover)] hover:border-[hsl(263_70%_58%/0.4)] transition-all duration-200"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent
                className="max-w-3xl min-w-[50%] p-0 gap-0 overflow-hidden rounded-2xl border bg-background shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.6)]"
            >
                {/* ── Hero banner ── */}
                <div className="relative h-64 w-full overflow-hidden">
                    {topic.imageUrl ? (
                        <img
                            src={topic.imageUrl}
                            alt={topic.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-[hsl(263_70%_20%)] to-[hsl(330_80%_20%)]">
                            <BookOpen className="h-12 w-12 text-[hsl(263_70%_68%/0.5)]" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-color-background via-transparent to-transparent" />
                </div>

                {/* ── Header ── */}
                <DialogHeader className="px-6 pt-2 pb-0">
                    <DialogTitle className="text-xl font-bold text-foreground">
                        {topic.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-foreground-muted">
                        Topic details & metadata
                    </DialogDescription>
                </DialogHeader>

                {/* ── Body ── */}
                <div className="px-6 py-4 space-y-3">

                    {/* Description */}
                    {topic.description && (
                        <DetailRow icon={<BookOpen className="h-4 w-4" />} label="Description">
                            {topic.description}
                        </DetailRow>
                    )}

                    {/* Category */}
                    <DetailRow icon={<Layers className="h-4 w-4" />} label="Category">
                        <Badge
                            className="font-semibold bg-[hsl(263_70%_58%/0.15)] text-[hsl(263_70%_78%)] border border-[hsl(263_70%_58%/0.3)]"
                        >
                            {topic.category?.name ?? "Uncategorized"}
                        </Badge>
                    </DetailRow>

                    {/* Difficulty */}
                    <DetailRow icon={<BarChart3 className="h-4 w-4" />} label="Difficulty">
                        <Badge
                            className="font-semibold text-xs border"
                            style={{
                                background: difficulty.bg,
                                color: difficulty.color,
                                borderColor: `${difficulty.color}40`,
                            }}
                        >
                            {difficulty.label}
                        </Badge>
                    </DetailRow>

                    {/* Tags */}
                    {topic.tags && topic.tags.length > 0 && (
                        <DetailRow icon={<Tag className="h-4 w-4" />} label="Tags">
                            <div className="flex flex-wrap gap-1.5">
                                {topic.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs bg-[hsl(263_70%_58%/0.08)] text-[hsl(263_70%_68%)] border-[hsl(263_70%_58%/0.2)]"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </DetailRow>
                    )}

                    {/* Dates row */}
                    <div className="grid grid-cols-2 gap-3">
                        <DetailRow icon={<Calendar className="h-4 w-4" />} label="Created">
                            {new Date(topic.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </DetailRow>
                        <DetailRow icon={<Calendar className="h-4 w-4" />} label="Updated">
                            {new Date(topic.updatedAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </DetailRow>
                    </div>

                    {/* ID + copy */}
                    <div className="flex items-center justify-between p-3 rounded bg-background-sunken border border-(--glass-border)">
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-(--color-foreground-muted) mb-0.5">
                                Topic ID
                            </p>
                            <p className="text-xs font-mono text-foreground-subtle truncate max-w-[18rem]">
                                {topic.id}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 ml-3 h-8 w-8 border-(--glass-border) hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)] transition-all duration-200"
                            onClick={() => {
                                navigator.clipboard.writeText(topic.id);
                                toast.success("Topic ID copied!");
                            }}
                        >
                            <Clipboard className="h-3.5 w-3.5 text-(--color-foreground)" />
                        </Button>
                    </div>

                    {/* Soft-deleted badge */}
                    {topic.deletedAt && (
                        <div className="flex items-center gap-2 p-3 rounded bg-[hsl(0_84%_60%/0.08)] border border-[hsl(0_84%_60%/0.25)]">
                            <span className="h-2 w-2 rounded-full bg-(--color-error)" />
                            <p className="text-xs text-(--color-error)">
                                Archived on {new Date(topic.deletedAt).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-6 pb-5 pt-1 flex justify-end">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="border-(--glass-border) text-(--color-foreground-muted) hover:text-(--color-foreground) hover:bg-(--glass-surface-hover)"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}