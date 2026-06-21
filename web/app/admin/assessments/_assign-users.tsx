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
  Link as LinkIcon,
  Mail,
  Copy,
  TrendingUp,
  Award,
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
  const [activeTab, setActiveTab] = useState<"invite" | "platform" | "shortlist">("invite");
  const [inviteEmails, setInviteEmails] = useState("");
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

  const shortlist = assignments
    .filter((a) => a.status === "COMPLETED")
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const isLoading = loadingUsers || loadingAssigned;

  const copyShareLink = () => {
    const link = `${window.location.origin}/join-assessment/${assessment.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied to clipboard!");
  };

  const handleSendInvites = () => {
    if (!inviteEmails.trim()) return toast.error("Please enter email addresses");
    toast.success("Invitations sent successfully!");
    setInviteEmails("");
  };

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
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-(--glass-border)">
          <DialogTitle className="text-xl font-bold text-(--color-foreground)">
            Candidate Management
          </DialogTitle>
          <DialogDescription className="text-sm text-(--color-foreground-muted)">
            Manage candidates for <span className="font-semibold text-(--color-foreground)">{assessment.title}</span>
          </DialogDescription>
          
          <div className="flex items-center gap-4 mt-6 border-b border-(--glass-border)">
            <button
              onClick={() => setActiveTab("invite")}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "invite" ? "border-[hsl(263_70%_58%)] text-[hsl(263_70%_58%)]" : "border-transparent text-foreground-subtle hover:text-(--color-foreground)"
              }`}
            >
              Invite Candidates
            </button>
            <button
              onClick={() => setActiveTab("platform")}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "platform" ? "border-[hsl(263_70%_58%)] text-[hsl(263_70%_58%)]" : "border-transparent text-foreground-subtle hover:text-(--color-foreground)"
              }`}
            >
              Platform Users
              <Badge className="bg-[hsl(263_70%_58%/0.12)] text-[hsl(263_70%_68%)] text-[10px] px-1.5 py-0">
                {assignments.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("shortlist")}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "shortlist" ? "border-amber-500 text-amber-500" : "border-transparent text-foreground-subtle hover:text-(--color-foreground)"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              1-Click Shortlist
            </button>
          </div>
        </DialogHeader>

        {/* ── Tab Content ── */}
        <div className="flex-1 overflow-hidden flex flex-col max-h-[60vh] overflow-y-auto">
          {activeTab === "invite" && (
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-[hsl(263_70%_58%)]" /> Shareable Link
                </h3>
                <p className="text-sm text-foreground-subtle mb-4">
                  Send this link directly to candidates for a frictionless sign-up and assessment experience.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-2.5 rounded-xl border border-(--glass-border) bg-black/5 dark:bg-white/5 text-sm text-foreground-subtle truncate select-all">
                    https://platform.com/join-assessment/{assessment.id}
                  </div>
                  <Button onClick={copyShareLink} variant="outline" className="gap-2">
                    <Copy className="w-4 h-4" /> Copy
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-pink-500" /> Email Invitations
                </h3>
                <p className="text-sm text-foreground-subtle mb-4">
                  Invite candidates via email. Separate multiple emails with commas.
                </p>
                <div className="flex items-start gap-3">
                  <textarea
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    placeholder="e.g. candidate1@example.com, candidate2@example.com"
                    className="flex-1 glass-input p-3 min-h-[100px] text-sm resize-none rounded-xl"
                  />
                </div>
                <div className="mt-4 text-right">
                  <Button onClick={handleSendInvites} className="gradient-primary text-white">
                    Send Invitations
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "platform" && (
            <div className="flex flex-col h-full">
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
                <div className="border border-(--glass-border) rounded-xl overflow-hidden max-h-[40vh] overflow-y-auto">
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
              <div className="px-6 py-4 flex items-center justify-between border-t border-(--glass-border) mt-auto">
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
            </div>
          )}

          {activeTab === "shortlist" && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-600 dark:text-amber-400">Auto-Generated Shortlist</h3>
                  <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                    We automatically rank completed assessments to surface your top candidates in under 5 minutes.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {shortlist.length === 0 ? (
                  <div className="text-center py-10 border border-(--glass-border) rounded-2xl bg-black/5 dark:bg-white/5 text-foreground-subtle">
                    No candidates have completed this assessment yet.
                  </div>
                ) : (
                  shortlist.map((a, i) => {
                    const u = allUsers.find(user => user.id === a.userId);
                    return (
                      <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl border border-(--glass-border) hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <div className="font-black text-2xl text-foreground-subtle w-8 text-center">
                          #{i + 1}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[hsl(263_70%_58%/0.15)] flex items-center justify-center text-sm font-bold text-[hsl(263_70%_68%)]">
                          {u?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-(--color-foreground)">{u?.name || "Unknown Candidate"}</p>
                          <p className="text-xs text-foreground-subtle">{u?.email || "No email"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-xl text-green-500">{a.score}%</p>
                          <p className="text-[10px] text-foreground-subtle">Top Score</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
