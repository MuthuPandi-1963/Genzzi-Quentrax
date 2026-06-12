/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Tag,
  X,
  Clock,
  Image,
  Loader2,
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

import { FormFooter, FormHeader, FormShell, SectionHeader } from "@/components/forms/FormParts";
import { useTopics } from "@/hooks";
import type { Topic } from "@/@types";
import type { Quiz } from "@/@types";
import type { QuizFormData } from "@/api/quizzes";
import { uploadToCloudinary } from "@/lib/cloudinary";

// ─────────────────────────────────────────────────────────────────────────────

interface QuizFormProps {
  open: boolean;
  editingQuiz: Quiz | null;
  formData: QuizFormData;
  setFormData: (data: QuizFormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

const STATUSES = [
  { value: "ACTIVE" as const, label: "Active" },
  { value: "INACTIVE" as const, label: "Inactive" },
  { value: "DRAFT" as const, label: "Draft" },
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

export default function QuizForm({
  open,
  editingQuiz,
  formData,
  setFormData,
  handleSubmit,
  onClose,
}: QuizFormProps) {
  const { topics } = useTopics();
  const [tagInput, setTagInput] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const set = <K extends keyof QuizFormData>(key: K, val: QuizFormData[K]) =>
    setFormData({ ...formData, [key]: val });

  // ── Image upload ──
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadToCloudinary(file);
      setFormData({ ...formData, imageUrl: result.url });
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Tag management ──
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      set("tags", [...formData.tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    set("tags", formData.tags.filter((t: string) => t !== tag));
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <FormShell onClose={onClose}>
          <form onSubmit={handleSubmit}>

            {/* ── Header ── */}
            <FormHeader
              title={editingQuiz ? "Edit Quiz" : "New Quiz"}
              description={
                editingQuiz ? "Update quiz details" : "Create a new quiz"
              }
              icon={<BookOpen className="h-4 w-4" />}
              onClose={onClose}
            />

            {/* ── Body ── */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* ── Quiz Details ── */}
              <div className="space-y-4">
                <SectionHeader title="Quiz Details" icon={<BookOpen className="h-4 w-4" />} />

                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="q-title" className="text-sm font-medium text-(--color-foreground-muted)">
                    Title <span className="text-(--color-error)">*</span>
                  </Label>
                  <Input
                    id="q-title"
                    placeholder="Enter quiz title…"
                    value={formData.title}
                    onChange={(e) => set("title", e.target.value)}
                    required
                    className="text-(--color-foreground)"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="q-desc" className="text-sm font-medium text-(--color-foreground-muted)">
                    Description
                  </Label>
                  <Textarea
                    id="q-desc"
                    placeholder="Enter quiz description…"
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
                    onValueChange={(v) => set("status", v as QuizFormData["status"])}
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
                    onValueChange={(v) => set("topicId", v)}
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

                {/* Time Limit */}
                <div className="space-y-1.5">
                  <Label htmlFor="q-time" className="text-sm font-medium text-(--color-foreground-muted)">
                    Time Limit (min)
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(217_90%_60%)]" />
                    <Input
                      id="q-time"
                      type="number"
                      min={1}
                      max={300}
                      value={formData.timeLimit ?? 0}
                      onChange={(e) => set("timeLimit", parseInt(e.target.value) || "")}
                      className="pl-9 text-(--color-foreground)"
                    />
                  </div>
                </div>
              </div>

              {/* ── Thumbnail ── */}
              <div className="space-y-4">
                <SectionHeader
                  title="Cover Image"
                  description="Optional cover image for this quiz"
                  icon={<Image className="h-4 w-4" />}
                />

                <div className="space-y-1.5">
                  <Label
                    htmlFor="q-image"
                    className="text-sm font-medium text-(--color-foreground-muted)"
                  >
                    Quiz Image
                  </Label>

                  <Input
                    id="q-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-(--color-foreground)"
                  />

                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-foreground-subtle">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}

                  {formData.imageUrl && (
                    <>
                      <Input
                        value={formData.imageUrl}
                        readOnly
                        className="text-(--color-foreground) mt-2"
                      />

                      <div
                        className="
                          mt-2 relative h-32 w-full overflow-hidden rounded-xl
                          border border-(--glass-border) bg-background-sunken
                        "
                      >
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── Tags ── */}
              <div className="space-y-4">
                <SectionHeader title="Tags" icon={<Tag className="h-4 w-4" />} />

                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag and press Enter…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addTag(); }
                    }}
                    className="flex-1 text-(--color-foreground)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    className="border-(--glass-border) hover:border-[hsl(263_70%_58%/0.4)]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="gap-1 pr-1.5 border-(--glass-border) text-(--color-foreground-muted)
                          hover:border-[hsl(263_70%_58%/0.4)] transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-0.5 rounded-full hover:bg-[hsl(0_84%_60%/0.15)] hover:text-(--color-error)
                            p-0.5 transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <FormFooter
              isEditing={!!editingQuiz}
              onCancel={onClose}
              submitLabel="Create Quiz"
              editLabel="Update Quiz"
            />
          </form>
        </FormShell>
      )}
    </AnimatePresence>
  );
}