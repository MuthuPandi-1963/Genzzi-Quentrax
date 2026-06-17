"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Layers,
  Search,
  Plus,
  CheckCircle2,
  X,
  Loader2,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import type { Assessment, AssessmentQuestionRelation } from "@/@types/assessment.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import QuestionBulkImportForm from "@/components/forms/QuestionBulkImportForm";

// ─────────────────────────────────────────────────────────────────────────────

interface AssignQuestionsProps {
  assessment: Assessment;
}

interface QuestionItem {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: string;
  points: number;
  category?: string;
}

// ─────────────────────────────────────────────────────────────────────────────


async function fetchQuestions(): Promise<QuestionItem[]> {
  const res = await axiosInstance.get("/questions"); // adjust endpoint as needed
  return res.data.data ?? [];
}

async function fetchAssessmentQuestions(assessmentId: string): Promise<AssessmentQuestionRelation[]> {
  const res = await axiosInstance.get(`/assessment-questions/assessment/${assessmentId}`);
  return res.data.data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AssignQuestions({ assessment }: AssignQuestionsProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all available questions
  const { data: allQuestions = [], isLoading: loadingQuestions } = useQuery({
    queryKey: ["questions", "all"],
    queryFn: fetchQuestions,
    enabled: open,
  });

  // Fetch currently assigned questions for this assessment
  const { data: assignedQuestions = [], isLoading: loadingAssigned } = useQuery({
    queryKey: ["assessment-questions", assessment.id],
    queryFn: () => fetchAssessmentQuestions(assessment.id),
    enabled: open,
  });

  // Sync selectedIds when dialog opens
  React.useEffect(() => {
    if (open && assignedQuestions.length > 0) {
      setSelectedIds(new Set(assignedQuestions.map((aq) => aq.questionId)));
    }
  }, [open, assignedQuestions]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentIds = new Set(assignedQuestions.map((aq) => aq.questionId));
      const toAdd = Array.from(selectedIds).filter((id) => !currentIds.has(id));
      const toRemove = assignedQuestions
        .filter((aq) => !selectedIds.has(aq.questionId))
        .map((aq) => aq.id); // use assessmentQuestion id for removal

      // Bulk create new assignments
      if (toAdd.length > 0) {
        await axiosInstance.post("/assessment-questions/many", {
          assessmentQuestions: toAdd.map((questionId, idx) => ({
            assessmentId: assessment.id,
            questionId,
            sortOrder: assignedQuestions.length + idx,
          })),
        });
      }

      // Remove unselected ones
      for (const aqId of toRemove) {
        await axiosInstance.delete(`/assessment-questions/${aqId}`);
      }

      toast.success(`Questions updated: +${toAdd.length} added, -${toRemove.length} removed`);
      queryClient.invalidateQueries({ queryKey: ["assessment-questions", assessment.id] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update questions");
    } finally {
      setSaving(false);
    }
  };

  const filtered = allQuestions.filter(
    (q) =>
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.questionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = loadingQuestions || loadingAssigned;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-(--glass-border)
            hover:border-[hsl(263_70%_58%/0.4)] hover:text-[hsl(263_70%_68%)]
            transition-all duration-200"
        >
          <Layers className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-4xl min-w-[60%] p-0 gap-0 overflow-hidden rounded-2xl
          border border-(--glass-border-strong) bg-background
          shadow-[0_24px_80px_-16px_hsl(263_70%_20%/0.6)] max-h-[90vh]"
      >
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              className="font-semibold text-xs
                bg-[hsl(263_70%_58%/0.12)] text-[hsl(263_70%_68%)]
                border border-[hsl(263_70%_58%/0.3)]"
            >
              {assignedQuestions.length} assigned
            </Badge>
            <Badge
              className="font-semibold text-xs
                bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)]
                border border-[hsl(142_76%_45%/0.3)]"
            >
              {selectedIds.size} selected
            </Badge>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-(--color-foreground)">
                Assign Questions
              </DialogTitle>
              <DialogDescription className="text-sm text-(--color-foreground-muted)">
                Select questions to link to <span className="font-semibold text-(--color-foreground)">{assessment.title}</span>
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkImportOpen(true)}
              className="gap-2 font-semibold"
            >
              <Plus className="h-4 w-4" />
              Bulk Import
            </Button>
          </div>
        </DialogHeader>

        {/* ── Search ── */}
        <div className="px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input
              placeholder="Search questions by text, type, or difficulty…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input h-10 pl-9 text-sm"
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="px-6 pb-2 flex-1 overflow-hidden">
          <div className="border border-(--glass-border) rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-(--glass-border) bg-background-overlay hover:bg-background-overlay">
                  <TableHead className="w-10 text-center">
                    <Checkbox
                      checked={filtered.length > 0 && filtered.every((q) => selectedIds.has(q.id))}
                      onCheckedChange={(checked) => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          filtered.forEach((q) => {
                            if (checked) next.add(q.id);
                            else next.delete(q.id);
                          });
                          return next;
                        });
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-foreground-subtle font-semibold">Question</TableHead>
                  <TableHead className="text-foreground-subtle font-semibold w-28">Type</TableHead>
                  <TableHead className="text-foreground-subtle font-semibold w-24">Difficulty</TableHead>
                  <TableHead className="text-foreground-subtle font-semibold w-16 text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-[hsl(263_70%_58%)]" />
                        <p className="text-sm text-foreground-subtle mt-2">Loading questions…</p>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-foreground-subtle">
                        {searchTerm ? "No questions match your search" : "No questions available"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((q, idx) => {
                      const isSelected = selectedIds.has(q.id);
                      const isAlreadyAssigned = assignedQuestions.some((aq) => aq.questionId === q.id);
                      return (
                        <motion.tr
                          key={q.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className={`border-(--glass-border) transition-colors cursor-pointer
                            ${isSelected ? "bg-[hsl(263_70%_58%/0.06)]" : "hover:bg-[hsl(263_70%_58%/0.03)]"}`}
                          onClick={() => toggleSelection(q.id)}
                        >
                          <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelection(q.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <GripVertical className="h-4 w-4 text-foreground-subtle shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-(--color-foreground) line-clamp-2">
                                  {q.questionText}
                                </p>
                                {isAlreadyAssigned && !isSelected && (
                                  <Badge variant="outline" className="text-[10px] mt-1 border-amber-500/30 text-amber-400">
                                    Will be removed
                                  </Badge>
                                )}
                                {isAlreadyAssigned && isSelected && (
                                  <Badge variant="outline" className="text-[10px] mt-1 border-green-500/30 text-green-400">
                                    Already assigned
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs border-(--glass-border) text-foreground-subtle">
                              {q.questionType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs font-medium px-2 py-1 rounded-md
                              ${q.difficulty === "HARD" ? "bg-red-500/10 text-red-400" :
                                q.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-400" :
                                "bg-green-500/10 text-green-400"}`}>
                              {q.difficulty}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm text-(--color-foreground)">
                            {q.points}
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-(--glass-border)">
          <div className="text-sm text-(--color-foreground-muted)">
            <span className="font-semibold text-(--color-foreground)">{selectedIds.size}</span> questions selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-(--glass-border) text-(--color-foreground-muted)"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gradient-primary gap-2 text-white font-semibold"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>

      <QuestionBulkImportForm
        bulkQuestions={isBulkImportOpen}
        setBulkQuestions={(open) => {
          setIsBulkImportOpen(open);
          if (!open) {
            queryClient.invalidateQueries({ queryKey: ["questions", "all"] });
          }
        }}
      />
    </Dialog>
  );
}
