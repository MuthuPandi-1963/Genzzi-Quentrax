"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, BookOpen, Clock, Users, CheckCircle, Shield } from "lucide-react";
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
import type { Assessment } from "@/@types/assessment.types";
import AssessmentView from "./_view";
import AssignQuestions from "./_assign-questions";
import AssignUsers from "./_assign-users";

// ─────────────────────────────────────────────────────────────────────────────

interface AssessmentTableProps {
    filteredAssessments: Assessment[];
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    handleEdit: (assessment: Assessment) => void;
    handleDelete: (id: string) => void;
    handlePublish: (id: string, published: boolean) => void;
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

// ─────────────────────────────────────────────────────────────────────────────

export default function AssessmentTable({
    filteredAssessments,
    searchTerm,
    setSearchTerm,
    handleEdit,
    handleDelete,
    handlePublish,
}: AssessmentTableProps) {
    return (
        <Card className="border-(--glass-border) bg-(--color-background-elevated)">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-(--color-foreground)">Assessments</CardTitle>
                        <CardDescription className="text-(--color-foreground-muted)">
                            Manage all assessments and their configurations
                        </CardDescription>
                    </div>
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                        <Input
                            placeholder="Search assessments…"
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
                                            Published
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
                                            Assignments
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Attempts
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Proctored
                                        </TableHead>
                                        <TableHead className="text-foreground-subtle font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                {/* ── Body ── */}
                                <TableBody>
                                    <AnimatePresence>
                                        {filteredAssessments.map((a, idx) => (
                                            <motion.tr
                                                key={a.id}
                                                custom={idx}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ delay: idx * 0.03, duration: 0.2 }}
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
                                                                {a.title}
                                                            </span>
                                                            <span className="truncate text-xs text-(--color-foreground-muted) line-clamp-1">
                                                                {a.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <StatusBadge status={a.status} />
                                                </TableCell>

                                                {/* Published */}
                                                <TableCell>
                                                    <button
                                                        onClick={() => handlePublish(a.id, !a.published)}
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                                                            a.published
                                                                ? "bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)] border border-[hsl(142_76%_45%/0.3)] hover:bg-[hsl(142_76%_45%/0.2)]"
                                                                : "bg-[hsl(38_92%_50%/0.12)] text-[hsl(38_92%_65%)] border border-[hsl(38_92%_50%/0.3)] hover:bg-[hsl(38_92%_50%/0.2)]"
                                                        }`}
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        {a.published ? "Yes" : "No"}
                                                    </button>
                                                </TableCell>

                                                {/* Time Limit */}
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5 text-[hsl(217_90%_60%)]" />
                                                        <span className="font-semibold text-sm text-(--color-foreground)">
                                                            {a.timeLimit ? `${a.timeLimit}m` : "—"}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                {/* Topic */}
                                                <TableCell>
                                                    <span className="text-sm text-(--color-foreground-muted)">
                                                        {a.topic?.name ?? <span className="text-foreground-subtle italic">Unassigned</span>}
                                                    </span>
                                                </TableCell>

                                                {/* Questions */}
                                                <TableCell>
                                                    <span className="text-sm font-semibold text-(--color-foreground)">
                                                        {a.assessmentQuestions?.length ?? 0}
                                                    </span>
                                                </TableCell>

                                                {/* Assignments */}
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="h-3.5 w-3.5 text-[hsl(263_70%_68%)]" />
                                                        <span className="text-sm font-semibold text-(--color-foreground)">
                                                            {a.assignments?.length ?? 0}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                {/* Attempts */}
                                                <TableCell>
                                                    <span className="text-sm font-semibold text-(--color-foreground)">
                                                        {a.attempts?.length ?? 0}
                                                    </span>
                                                </TableCell>

                                                {/* Proctored */}
                                                <TableCell>
                                                    {a.proctoredMode ? (
                                                        <Shield className="h-4 w-4 text-[hsl(142_76%_45%)]" />
                                                    ) : (
                                                        <span className="text-xs text-foreground-subtle">—</span>
                                                    )}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <AssessmentView assessment={a} />
                                                        <AssignQuestions assessment={a} />
                                                        <AssignUsers assessment={a} />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(a)}
                                                            className="h-8 w-8 p-0 border-(--glass-border)
        hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
        transition-all duration-200"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(a.id)}
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
                    {filteredAssessments.length === 0 && (
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
                                {searchTerm ? "No assessments match your search" : "No assessments yet"}
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
