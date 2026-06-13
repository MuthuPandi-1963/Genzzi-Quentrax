/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/@types";
import { CategoryFormData } from ".";
import { FormFooter, FormHeader, FormShell, SectionHeader } from "./FormParts";
import { Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

// ─────────────────────────────────────────────────────────────────────────────

interface CategoryFormProps {
  open: boolean;
  editingCategory: Category | null;
  formData: CategoryFormData;
  setFormData: (data: CategoryFormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryForm({
  open,
  editingCategory,
  formData,
  setFormData,
  handleSubmit,
  onClose,
}: CategoryFormProps) {
    const [uploading, setUploading] = React.useState(false);
  const set = <K extends keyof CategoryFormData>(key: K, val: CategoryFormData[K]) =>
    setFormData({ ...formData, [key]: val });
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
            {/* Header */}
            <FormHeader
              title={editingCategory ? "Edit Category" : "New Category"}
              description={
                editingCategory
                  ? "Update category details"
                  : "Create a top-level content category"
              }
              icon={<Layers className="h-4 w-4" />}
              onClose={onClose}
            />

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4 overflow-y-auto">
                <SectionHeader title="Details" icon={<Layers className="h-4 w-4" />} />

                {/* Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cat-name"
                    className="text-sm font-medium text-(--color-foreground-muted)"
                  >
                    Category Name <span className="text-(--color-error)">*</span>
                  </Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g. Science & Technology"
                    value={formData.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                    className="text-foreground"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cat-desc"
                    className="text-sm font-medium text-(--color-foreground-muted)"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="cat-desc"
                    placeholder="Brief description of this category…"
                    value={formData.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={3}
                    className="text-foreground min-h-0 h-auto py-3 resize-none"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
  <Label
    htmlFor="cat-img"
    className="text-sm font-medium text-(--color-foreground-muted)"
  >
    Category Image
  </Label>

  <Input
    id="cat-img"
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
        className="glass-input"
      />

      <div
        className="
          mt-2 relative h-32 w-full overflow-hidden rounded-xl
          border border-(--glass-border)
          bg-background-sunken
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

            {/* Footer */}
            <FormFooter
              isEditing={!!editingCategory}
              onCancel={onClose}
              submitLabel="Create Category"
              editLabel="Update Category"
            />
          </form>
        </FormShell>
      )}
    </AnimatePresence>
  );
}