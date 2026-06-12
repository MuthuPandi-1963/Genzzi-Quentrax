/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { BookOpen, Image, Loader2 } from "lucide-react";
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
import {
  FormShell,
  FormHeader,
  FormFooter,
  SectionHeader,
  DifficultySelector,
  TagInput,
} from "@/components/forms/FormParts";
import { Category, Topic } from "@/@types";
import { TopicFormData } from "@/hooks/useTopics";
import { Difficulty } from "@/@types/enums";
import { uploadToCloudinary } from "@/lib/cloudinary";

// ─────────────────────────────────────────────────────────────────────────────

interface TopicFormProps {
  open: boolean;
  editingTopic: Topic | null;
  formData: TopicFormData;
  setFormData: (data: TopicFormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  categories: Category[];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TopicForm({
  open,
  editingTopic,
  formData,
  setFormData,
  handleSubmit,
  onClose,
  categories,
}: TopicFormProps) {
  const [uploading, setUploading] = React.useState(false);
  console.log(categories);
  
  const set = <K extends keyof TopicFormData>(
    key: K,
    val: TopicFormData[K]
  ) => setFormData({ ...formData, [key]: val });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const result = await uploadToCloudinary(file);

      setFormData({
        ...formData,
        imageUrl: result.url,
      });
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <FormShell onClose={onClose}>
          <form onSubmit={handleSubmit}>
            <FormHeader
              title={editingTopic ? "Edit Topic" : "New Topic"}
              description={
                editingTopic
                  ? "Update topic details"
                  : "Add a topic under an existing category"
              }
              icon={<BookOpen className="h-4 w-4" />}
              onClose={onClose}
            />

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <SectionHeader
                  title="Details"
                  icon={<BookOpen className="h-4 w-4" />}
                />

                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Category <span className="text-destructive">*</span>
                  </Label>

                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) => set("categoryId", v)}
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>

                    <SelectContent className="bg-background -rounded-10 p-2">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="text-foreground"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="topic-name"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Topic Name <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id="topic-name"
                    placeholder="e.g. Quantum Mechanics"
                    value={formData.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                    className="text-foreground"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="topic-desc"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Description
                  </Label>

                  <Textarea
                    id="topic-desc"
                    placeholder="What will learners explore in this topic?"
                    value={formData.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={3}
                    className="text-foreground min-h-0 h-auto py-3 resize-none"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <DifficultySelector
                value={formData.difficulty as Difficulty}
                onChange={(v) =>
                  set("difficulty", v as Difficulty)
                }
              />

              {/* Tags */}
              <TagInput
                label="Tags"
                tags={formData.tags}
                onChange={(t) => set("tags", t)}
                placeholder="Add tag…"
              />

              {/* Thumbnail */}
              <div className="space-y-4">
                <SectionHeader
                  title="Thumbnail"
                  description="Optional cover image for this topic"
                  icon={<Image className="h-4 w-4" />}
                />

                <div className="space-y-1.5">
                  <Label
                    htmlFor="topic-img"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Topic Image
                  </Label>

                  <Input
                    id="topic-img"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />

                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}

                  {formData.imageUrl && (
                    <>
                      <Input
                        value={formData.imageUrl}
                        readOnly
                        className="text-foreground"
                      />

                      <div
                        className="
                          mt-2 relative h-32 w-full overflow-hidden rounded-xl
                          border border-border bg-muted
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
            </div>

            <FormFooter
              isEditing={!!editingTopic}
              onCancel={onClose}
              submitLabel="Create Topic"
              editLabel="Update Topic"
            />
          </form>
        </FormShell>
      )}
    </AnimatePresence>
  );
}