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
  Users,
  Search,
  CheckCircle2,
  Loader2,
  User,
  GraduationCap,
  Shield,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import type { Assessment, AssignmentRelation } from "@/@types/assessment.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────

interface AssignUsersProps {
  assessment: Assessment;
}

interface UserItem {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatar?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────


async function fetchUsers(): Promise<UserItem[]> {
  const res = await axiosInstance.get("/users"); // adjust endpoint as needed
  return res.data.data ?? [];
}

async function fetchAssessmentAssignments(assessmentId: string): Promise<AssignmentRelation[]> {
  const res = await axiosInstance.get(`/assessments/${assessmentId}/assignments`);
  return res.data.data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AssignUsers({ assessment }: AssignUsersProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all users (exclude ADMIN)
  const { data: allUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users", "all"],
    queryFn: fetchUsers,
    enabled: open,
    select: (data) => data.filter((u) => u.role !== "ADMIN"),
  });

  // Fetch currently assigned users
  const { data: assignments = [], isLoading: loadingAssigned } = useQuery({
    queryKey: ["assessments", assessment.id, "assignments"],
    queryFn: () => fetchAssessmentAssignments(assessment.id),
    enabled: open,
  });

  // Sync selectedIds when dialog opens
  React.useEffect(() => {
    if (open && assignments.length > 0) {
      setSelectedIds(new Set(assignments.map((a) => a.userId)));
    }
  }, [open, assignments]);

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
      const currentIds = new Set(assignments.map((a) => a.userId));
      const toAdd = Array.from(selectedIds).filter((id) => !currentIds.has(id));
      const toRemove = assignments
        .filter((a) => !selectedIds.has(a.userId))
        .map((a) => a.id);

      // Assign new users via bulk endpoint
      if (toAdd.length > 0) {
        await axiosInstance.post(`/assessments/${assessment.id}/assign`, {
          userIds: toAdd,
        });
      }

      // Remove unselected assignments
      for (const assignmentId of toRemove) {
        await axiosInstance.delete(`/assessment-assignments/${assignmentId}`);
      }

      toast.success(`Users updated: +${toAdd.length} assigned, -${toRemove.length} removed`);
      queryClient.invalidateQueries({ queryKey: ["assessments", assessment.id, "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update assignments");
    } finally {
      setSaving(false);
    }
  };

  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = loadingUsers || loadingAssigned;

  const getRoleIcon = (role: string) => {
    if (role === "STAFF") return <Shield className="h-3.5 w-3.5 text-amber-400" />;
    if (role === "STUDENT") return <GraduationCap className="h-3.5 w-3.5 text-blue-400" />;
    return <User className="h-3.5 w-3.5 text-foreground-subtle" />;
  };

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
          <Users className="h-3.5 w-3.5" />
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
              {assignments.length} assigned
            </Badge>
            <Badge
              className="font-semibold text-xs
                bg-[hsl(142_76%_45%/0.12)] text-[hsl(142_76%_65%)]
                border border-[hsl(142_76%_45%/0.3)]"
            >
              {selectedIds.size} selected
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-(--color-foreground)">
            Assign Students
          </DialogTitle>
          <DialogDescription className="text-sm text-(--color-foreground-muted)">
            Assign users to <span className="font-semibold text-(--color-foreground)">{assessment.title}</span>
          </DialogDescription>
        </DialogHeader>

        {/* ── Search + Due Date ── */}
        <div className="px-6 py-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input
              placeholder="Search users by name, email, or role…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input h-10 pl-9 text-sm"
            />
          </div>
          <div className="relative sm:w-56">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input
              type="datetime-local"
              placeholder="Due date (optional)"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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
                      checked={filtered.length > 0 && filtered.every((u) => selectedIds.has(u.id))}
                      onCheckedChange={(checked) => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          filtered.forEach((u) => {
                            if (checked) next.add(u.id);
                            else next.delete(u.id);
                          });
                          return next;
                        });
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-foreground-subtle font-semibold">User</TableHead>
                  <TableHead className="text-foreground-subtle font-semibold w-32">Role</TableHead>
                  <TableHead className="text-foreground-subtle font-semibold w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-[hsl(263_70%_58%)]" />
                        <p className="text-sm text-foreground-subtle mt-2">Loading users…</p>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-foreground-subtle">
                        {searchTerm ? "No users match your search" : "No users available"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((u, idx) => {
                      const isSelected = selectedIds.has(u.id);
                      const existingAssignment = assignments.find((a) => a.userId === u.id);
                      return (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className={`border-(--glass-border) transition-colors cursor-pointer
                            ${isSelected ? "bg-[hsl(263_70%_58%/0.06)]" : "hover:bg-[hsl(263_70%_58%/0.03)]"}`}
                          onClick={() => toggleSelection(u.id)}
                        >
                          <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelection(u.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-[hsl(263_70%_58%/0.15)] flex items-center justify-center text-xs font-bold text-[hsl(263_70%_68%)]">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-(--color-foreground)">{u.name}</p>
                                <p className="text-xs text-(--color-foreground-muted)">{u.email ?? "—"}</p>
                                {existingAssignment && !isSelected && (
                                  <Badge variant="outline" className="text-[10px] mt-1 border-amber-500/30 text-amber-400">
                                    Will be unassigned
                                  </Badge>
                                )}
                                {existingAssignment && isSelected && (
                                  <Badge variant="outline" className="text-[10px] mt-1 border-green-500/30 text-green-400">
                                    Already assigned — {existingAssignment.status}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {getRoleIcon(u.role)}
                              <span className="text-sm text-(--color-foreground-muted)">{u.role}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {existingAssignment ? (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  existingAssignment.status === "COMPLETED"
                                    ? "border-green-500/30 text-green-400"
                                    : existingAssignment.status === "IN_PROGRESS"
                                    ? "border-blue-500/30 text-blue-400"
                                    : "border-amber-500/30 text-amber-400"
                                }`}
                              >
                                {existingAssignment.status}
                              </Badge>
                            ) : (
                              <span className="text-xs text-foreground-subtle italic">Not assigned</span>
                            )}
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
            <span className="font-semibold text-(--color-foreground)">{selectedIds.size}</span> users selected
            {dueDate && (
              <span className="ml-2">
                · Due: <span className="font-medium">{new Date(dueDate).toLocaleString()}</span>
              </span>
            )}
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
    </Dialog>
  );
}
