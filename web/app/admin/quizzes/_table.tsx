"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, BookOpen, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Quiz } from "@/@types";
import QuizView from "./_view";
import AssignQuestions from "../questions/_assign-questions";

// ─────────────────────────────────────────────────────────────────────────────

interface QuizTableProps {
    filteredQuizzes: Quiz[];
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    handleEdit: (quiz: Quiz) => void;
    handleDelete: (id: string) => void;
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

export default function QuizTable({
    filteredQuizzes,
    searchTerm,
    setSearchTerm,
    handleEdit,
    handleDelete,
}: QuizTableProps) {
    return (
        <Card className="border-(--glass-border) bg-(--color-background-elevated)">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-(--color-foreground)">Quizzes</CardTitle>
                        <CardDescription className="text-(--color-foreground-muted)">
                            Manage all quizzes and their configurations
                        </CardDescription>
                    </div>
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                        <Input
                            placeholder="Search quizzes…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass-input h-10 pl-9 text-sm"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="border-t border-(--glass-border) rounded-b-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-225 max-h-120 overflow-y-auto">
                            <Table>
                                {/* ── Head ── */}
                                <TableHeader>
                                    <TableRow className="border-(--glass-border) bg-background-overlay hover:bg-background-overlay">
                                        <TableHead className="w-12 text-center text-foreground-subtle font-semibold">
                                            #
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold min-w-70">
                                            Title
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Time Limit
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Topic
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Questions
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Tags
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                {/* ── Body ── */}
                                <TableBody>
                                    <AnimatePresence>
                                        {filteredQuizzes.map((q, idx) => (
                                            <motion.tr
                                                key={q.id}
                                                custom={idx}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="border-(--glass-border) transition-colors duration-150
                          hover:bg-[hsl(263_70%_58%/0.05)]"
                                            >
                                                {/* Serial */}
                                                <TableCell className="text-center font-medium text-foreground-subtle text-sm">
                                                    {idx + 1}
                                                </TableCell>

                                                {/* Title + Description */}
                                                <TableCell>
                                                    <div className="flex items-start gap-2 w-78">
                                                        <BookOpen className="h-4 w-4 text-[hsl(263_70%_68%)] shrink-0 mt-0.5" />
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="truncate font-semibold text-(--color-foreground) text-sm line-clamp-2">
                                                                {q.title}
                                                            </span>
                                                            <span className="truncate text-xs text-(--color-foreground-muted) line-clamp-1">
                                                                {q.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <StatusBadge status={q.status} />
                                                </TableCell>

                                                {/* Time Limit */}
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5 text-[hsl(217_90%_60%)]" />
                                                        <span className="font-semibold text-sm text-(--color-foreground)">
                                                            {q.timeLimit}m
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                {/* Topic */}
                                                <TableCell>
                                                    <span className="text-sm text-(--color-foreground-muted)">
                                                        {q.topic?.name ?? <span className="text-foreground-subtle italic">Unassigned</span>}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <span className="text-sm font-semibold text-(--color-foreground)">
                                                        {q.questions?.length ?? 0}
                                                    </span>
                                                </TableCell>
                                                {/* Tags */}
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1 max-w-30">
                                                        {q.tags?.slice(0, 2).map((tag: string) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="outline"
                                                                className="text-[10px] px-1.5 py-0 border-(--glass-border) text-foreground-subtle"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {(q.tags?.length ?? 0) > 2 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] px-1.5 py-0 border-(--glass-border) text-foreground-subtle"
                                                            >
                                                                +{(q.tags?.length ?? 0) - 2}
                                                            </Badge>
                                                        )}
                                                        {!(q.tags?.length) && (
                                                            <span className="text-xs text-foreground-subtle italic">None</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <QuizView quiz={q} />
                                                        <AssignQuestions quiz={q} />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(q)}
                                                            className="h-8 w-8 p-0 border-(--glass-border)
        hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
        transition-all duration-200"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(q.id)}
                                                            className="h-8 w-8 p-0 border-(--glass-border)
        hover:border-[hsl(0_84%_60%/0.4)] hover:text-(--color-error)
        transition-all duration-200"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Empty state */}
                    {filteredQuizzes.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center gap-3 py-16
                text-foreground-subtle"
                        >
                            <div className="p-4 rounded-2xl bg-[hsl(263_70%_58%/0.08)] border border-[hsl(263_70%_58%/0.15)]">
                                <BookOpen className="h-8 w-8 text-[hsl(263_70%_58%/0.5)]" />
                            </div>
                            <p className="text-sm font-medium">
                                {searchTerm ? "No quizzes match your search" : "No quizzes yet"}
                            </p>
                            {searchTerm && (
                                <p className="text-xs text-foreground-subtle">
                                    Try a different keyword
                                </p>
                            )}
                        </motion.div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}