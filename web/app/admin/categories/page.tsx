"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, Layers, BookOpen, Archive, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Category } from "@/@types";
import { useCategories } from "@/hooks";
import { useConfirm } from "@/context/confirm.dialog.context";
import { CategoryFormData } from "@/components/forms";
import { toast } from "sonner";
import { LoadingDialog } from "@/components/custom/LoadingDailog";
import CategoryTable from "./_table";
import CategoryForm from "@/components/forms/CategoryForm";

// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM: CategoryFormData = { name: "", description: "", imageUrl: "" };

// ─────────────────────────────────────────────────────────────────────────────


const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
} satisfies Variants;

// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const { Categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { confirm } = useConfirm();

  const [categories, setCategories]         = useState<Category[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState("");
  const [isFormOpen, setIsFormOpen]         = useState(false);
  const [editing, setEditing]               = useState<Category | null>(null);
  const [formData, setFormData]             = useState<CategoryFormData>(EMPTY_FORM);

  // ── Sync from query ──
  useEffect(() => {
   (async()=>{
     setLoading(Categories.isLoading);
     console.log(Categories);
     
    setCategories(Categories ?? []);
   })()
  }, [Categories.isLoading, Categories]);

  // ── Helpers ──
  const resetForm = () => { setFormData(EMPTY_FORM); setEditing(null); };

  const openCreate = () => { resetForm(); setIsFormOpen(true); };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setFormData({ name: cat.name, description: cat.description ?? "", imageUrl: cat.imageUrl ?? "" });
    setIsFormOpen(true);
  };

  const handleClose = () => { setIsFormOpen(false); resetForm(); };

  // ── CRUD ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateCategory.mutate(
        { id: editing.id, data: formData },
        {
          onSuccess: (res) => {
            toast.success(res.data?.message ?? "Category updated");
            handleClose();
          },
          onError: (err: unknown) =>
            toast((err as { response: { data: { message: string }}})?.response?.data?.message ?? "Failed to update"),
        }
      );
    } else {
      createCategory.mutate(formData, {
        onSuccess: (res) => {
          toast.success(res.data?.message ?? "Category created");
          handleClose();
        },
        onError: (err: unknown) =>
          toast.success((err as { response: { data: { message: string }}})?.response?.data?.message ?? "Failed to create"),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (await confirm("Delete this category? All its topics will be unlinked.")) {
      deleteCategory.mutate(id, {
        onSuccess: (res) => toast.success(res.data?.message ?? "Category deleted"),
        onError: (err: unknown) =>
          toast((err as { response: { data: { message: string }}})?.response?.data?.message ?? "Failed to delete"),
      });
    }
  };

  // ── Derived stats ──
  const totalTopics   = categories.reduce((sum, c) => sum + (c.topics?.length ?? 0), 0);
  const archived      = categories.filter((c) => !!c.deletedAt).length;
  const active        = categories.length - archived;

  // ── Filter ──
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingDialog open={loading} />;

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8">

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--color-foreground)">
            Categories
          </h1>
          <p className="text-sm text-(--color-foreground-muted)">
            Organise your content into top-level categories
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gradient-primary gap-2 w-full sm:w-auto justify-center text-white font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Categories",
            value: categories.length,
            icon: <Layers className="h-4 w-4" />,
            color: "hsl(263 70% 58%)",
            bg: "hsl(263 70% 58% / 0.1)",
          },
          {
            label: "Active",
            value: active,
            icon: <TrendingUp className="h-4 w-4" />,
            color: "hsl(142 76% 45%)",
            bg: "hsl(142 76% 45% / 0.1)",
          },
          {
            label: "Total Topics",
            value: totalTopics,
            icon: <BookOpen className="h-4 w-4" />,
            color: "hsl(217 90% 60%)",
            bg: "hsl(217 90% 60% / 0.1)",
          },
          {
            label: "Archived",
            value: archived,
            icon: <Archive className="h-4 w-4" />,
            color: "hsl(0 84% 60%)",
            bg: "hsl(0 84% 60% / 0.1)",
          },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Card
              className="border-(--glass-border)] bg-(--color-background-elevated)]
                hover:shadow-[0_8px_32px_-8px_hsl(263_70%_58%/0.2)] transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-(--color-foreground-muted)]">
                  {stat.label}
                </CardTitle>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: stat.bg, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <CategoryTable
          filteredCategories={filtered}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleEdit={openEdit}
          handleDelete={handleDelete}
        />
      </motion.div>

      {/* ── Form Modal ── */}
      <CategoryForm
        open={isFormOpen}
        editingCategory={editing}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        onClose={handleClose}
      />
    </div>
  );
}