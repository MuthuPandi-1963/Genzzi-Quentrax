"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, BookOpen, Layers, Archive, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Topic } from "@/@types";
import { useTopics, useTopicMutations, TopicFormData } from "@/hooks/useTopics";
import { useCategories } from "@/hooks";
import { useConfirm } from "@/context/confirm.dialog.context";
import { toast } from "sonner";
import { LoadingDialog } from "@/components/custom/LoadingDailog";
import TopicTable from "./_table"
import { Difficulty } from "@/@types/enums";
import TopicForm from "@/components/forms/TopicForm";

// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM: TopicFormData = {
    name: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    difficulty: Difficulty.EASY,
    tags: [],
};

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

export default function TopicsPage() {
    const { topics, isLoading } = useTopics();
    const { createTopic, updateTopic, deleteTopic } = useTopicMutations();
    const { Categories } = useCategories();
    const { confirm } = useConfirm();

    const [topicsList, setTopicsList] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editing, setEditing] = useState<Topic | null>(null);
    const [formData, setFormData] = useState<TopicFormData>(EMPTY_FORM);
    console.log(Categories);
    

    // ── Sync from query ──
    useEffect(() => {
        (async () => {
            setLoading(isLoading);
            console.log(topics.data);
            
            setTopicsList(topics ?? []);
        })()
    }, [isLoading]);

    // ── Helpers ──
    const resetForm = () => { setFormData(EMPTY_FORM); setEditing(null); };

    const openCreate = () => { resetForm(); setIsFormOpen(true); };

    const openEdit = (topic: Topic) => {
        setEditing(topic);
        setFormData({
            name: topic.name,
            description: topic.description ?? "",
            imageUrl: topic.imageUrl ?? "",
            categoryId: topic.categoryId ?? "",
            difficulty: topic.difficulty,
            tags: topic.tags ?? [],
        });
        setIsFormOpen(true);
    };

    const handleClose = () => { setIsFormOpen(false); resetForm(); };

    // ── CRUD ──
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            updateTopic.mutate(
                { id: editing.id, data: formData },
                {
                    onSuccess: (res) => {
                        toast.success(res.data?.message ?? "Topic updated");
                        handleClose();
                    },
                    onError: (err: unknown) =>
                        toast.error((err as { response: { data: { message: string } } })?.response?.data?.message ?? "Failed to update"),
                }
            );
        } else {
            createTopic.mutate(formData, {
                onSuccess: (res) => {
                    toast.success(res.data?.message ?? "Topic created");
                    handleClose();
                },
                onError: (err: unknown) =>
                    toast.error((err as { response: { data: { message: string } } })?.response?.data?.message ?? "Failed to create"),
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (await confirm("Delete this topic? This action cannot be undone.")) {
            deleteTopic.mutate(id, {
                onSuccess: (res) => toast.success(res.data?.message ?? "Topic deleted"),
                onError: (err: unknown) =>
                    toast.error((err as { response: { data: { message: string } } })?.response?.data?.message ?? "Failed to delete"),
            });
        }
    };

    // ── Derived stats ──
    const totalCategories = new Set(topicsList.length > 0 ? topicsList.map((t) => t.categoryId) : []).size;
    const archived = topicsList.length > 0 ? topicsList.filter((t) => !!t.deletedAt).length : 0;
    const active = topicsList.length - archived;
    //   const avgDifficulty = topicsList.length > 0
    //     ? topicsList.reduce((sum, t) => {
    //         const map = { easy: 1, medium: 2, hard: 3 };
    //         return sum + (map[t.difficulty] ?? 1);
    //       }, 0) / topicsList.length
    //     : 0;

    // ── Filter ──
    const filtered = topicsList.length > 0 ? topicsList.filter(
        (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];

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
                        Topics
                    </h1>
                    <p className="text-sm text-(--color-foreground-muted)">
                        Manage learning topics and their content
                    </p>
                </div>
                <Button
                    onClick={openCreate}
                    className="gradient-primary gap-2 w-full sm:w-auto justify-center text-white font-semibold"
                >
                    <Plus className="h-4 w-4" />
                    Add Topic
                </Button>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    {
                        label: "Total Topics",
                        value: topicsList.length ?? 0,
                        icon: <BookOpen className="h-4 w-4" />,
                        color: "hsl(263 70% 58%)",
                        bg: "hsl(263 70% 58% / 0.1)",
                    },
                    {
                        label: "Active",
                        value: !Number.isNaN(active)  ? active : 0,
                        icon: <TrendingUp className="h-4 w-4" />,
                        color: "hsl(142 76% 45%)",
                        bg: "hsl(142 76% 45% / 0.1)",
                    },
                    {
                        label: "Categories Used",
                        value: totalCategories,
                        icon: <Layers className="h-4 w-4" />,
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
                            className=" bg-background hover:shadow-[0_8px_32px_-8px_hsl(263_70%_58%/0.2)] transition-shadow duration-300"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-medium text-foreground-muted">
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
                                    {stat.value ? `${stat.value}` : stat.value}
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
                <TopicTable
                    filteredTopics={filtered}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleEdit={openEdit}
                    handleDelete={handleDelete}
                />
            </motion.div>

            {/* ── Form Modal ── */}
            <TopicForm
                open={isFormOpen}
                editingTopic={editing}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                onClose={handleClose}
                categories={Categories ?? []}
            />
        </div>
    );
}